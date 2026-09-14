import { GraphQLError } from 'graphql';

import {
  apiBetToGraphql,
  apiCompetitionToGraphql,
  apiEventToGraphql,
  apiLineToGraphql,
  competitionFilterToGetCompetitionRequest,
  apiEventForCompetitionToGraphql,
  getLineId,
} from './mapper';
import {
  QueryResolvers,
  AccountBalance,
  Competition,
  SportSummary,
  Selection,
} from '../generated/types';

export const queryResolvers: QueryResolvers = {
  sports: async (_, __, { sportsLoader }) => {
    const sportsResp = await sportsLoader.load('all');

    return sportsResp.sports.map((sport): Partial<SportSummary> => {
      return {
        key: sport.key,
        name: sport.name,
        competitionCount: sport.competitionCount,
        eventCount: sport.eventCount,
      };
    });
  },

  sport: async (
    _,
    { sportKey, categoryKey, date, from, to, eventStatus },
    ctx,
  ) => {
    const resp = await ctx.sportLoader.load(sportKey);

    ctx.categoryFilter = {
      key: categoryKey,
    };

    ctx.competitionFilter = {
      date,
      from,
      to,
      eventStatus,
      // TODO: apply limit?
    };

    return {
      key: resp.key,
      name: resp.name,
      // TODO: make event/competition count works with filtering?
    };
  },

  competitions: async (_, { sportKey, date, limit }, { dataSources }) => {
    // use today by default
    let dateParams = new Date();
    if (date) {
      dateParams = date;
    }

    const resp = await dataSources.feedAPI.getFixtures({
      sportsKey: sportKey,
      date: dateParams,
      limit: limit,
    });

    // The fixture response from sports api feed doesn't contain event market data,
    // so the graphql resolver will fetch the event market data by event id one by one automatically.
    // To avoid fetching the event market data on each event, we can fetch the event market data by competition key instead.
    const competitionKeys = resp.competitions.map(
      (competition) => competition.key,
    );

    const competitionResponses = await Promise.allSettled(
      competitionKeys.map((key) =>
        dataSources.feedAPI.getCompetition(
          competitionFilterToGetCompetitionRequest({
            key: key,
          }),
        ),
      ),
    );

    const competitions: Competition[] = [];

    for (let i = 0; i < resp.competitions.length; i++) {
      const competition = resp.competitions[i];
      const filteredEventIdSet = new Set(competition.events.map((e) => e.id));
      const competitionResponse = competitionResponses[i];

      if (competitionResponse.status === 'rejected') {
        continue;
      }
      const sport = competitionResponse.value.sport;

      const events = competitionResponse.value.events
        .filter((e) => filteredEventIdSet.has(e.id))
        .map((e) =>
          apiEventForCompetitionToGraphql(
            e,
            sport,
            competition.category,
            competition.key,
            competition.name,
          ),
        );

      competitions.push({
        key: competition.key,
        name: competition.name,
        sport,
        category: competition.category,
        eventCount: competition.events.length,
        events: events,
      });
    }

    return competitions;
  },

  competition: async (
    _,
    { competitionKey, date, from, to, markets, limit },
    { dataSources },
  ) => {
    const resp = await dataSources.feedAPI.getCompetition(
      competitionFilterToGetCompetitionRequest({
        key: competitionKey,
        date,
        from,
        to,
        marketKeys: markets,
        limit,
      }),
    );

    const gqlResp = apiCompetitionToGraphql(resp);

    if (markets) {
      gqlResp.events = gqlResp.events?.filter(
        (event) => event.markets && event.markets.length > 0,
      );
      gqlResp.eventCount = gqlResp.events?.length;
    }

    return gqlResp;
  },

  event: async (_, { id }, { eventLoader }) => {
    const event = await eventLoader.load(id);
    return apiEventToGraphql(event);
  },

  line: async (_, { id }, { eventLoader }) => {
    const split = id.indexOf('/');
    const eventId = id.slice(0, split);
    const marketKey =
      id.indexOf('?') === -1
        ? id.slice(split + 1)
        : id.slice(split + 1, id.indexOf('?'));

    const resp = await eventLoader.load(eventId);
    const e = apiEventToGraphql(resp);

    const lineSelections: Selection[] = [];
    e.markets
      ?.filter((market) => market.marketKey === marketKey)
      .forEach((market) =>
        market.submarkets?.forEach((submarket) => {
          const matchedSelections = submarket.selections?.filter(
            (selection) => getLineId(e.id, selection.marketUrl) === id,
          );

          if (matchedSelections && matchedSelections.length > 0) {
            lineSelections.push(...matchedSelections);
          }
        }),
      );

    if (lineSelections.length === 0) {
      throw new GraphQLError('Not Found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return lineSelections;
  },

  selection: async (_, { id }, { dataSources }) => {
    const split = id.indexOf('/');
    const eventId = id.slice(0, split);
    const marketUrl = id.slice(split + 1);

    const resp = await dataSources.feedAPI.getLine({
      eventId: eventId,
      marketUrl: marketUrl,
    });

    return apiLineToGraphql(marketUrl, resp, eventId);
  },

  accountBalance: async (_, { currency }, { dataSources }) => {
    const resp = await dataSources.accountAPI.getAccountBalance(currency);

    return {
      currency: currency,
      amount: resp.amount,
    };
  },

  accountBalances: async (_, __, { dataSources }) => {
    const currenciesResp =
      await dataSources.accountAPI.getAvailableCurrencies();

    const promises = currenciesResp.currencies.map(
      async (currency): Promise<AccountBalance> => {
        const resp = await dataSources.accountAPI.getAccountBalance(currency);

        return {
          currency: currency,
          amount: resp.amount,
        };
      },
    );
    const results = await Promise.all(promises);

    return results;
  },

  accountCurrencies: async (_, __, { dataSources }) => {
    const resp = await dataSources.accountAPI.getAvailableCurrencies();

    return resp.currencies;
  },

  accountInfo: async (_, __, { dataSources }) => {
    return dataSources.accountAPI.getAccountInfo();
  },

  bet: async (_, { referenceId }, { dataSources }) => {
    const resp = await dataSources.tradingAPI.getBet(referenceId);

    return apiBetToGraphql(resp);
  },

  bets: async (_, { offset, limit }, { dataSources }) => {
    const resp = await dataSources.tradingAPI.getBets({
      offset,
      limit,
    });

    return resp.bets.map(apiBetToGraphql);
  },
};
