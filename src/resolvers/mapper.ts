import { add, parseJSON } from 'date-fns';

import {
  CompetitionResponse,
  EventForCompetition,
  EventResponse,
  LineResponse,
  Market as APIMarket,
  Submarket as APISubmarket,
  Selection as APISelection,
  EventMetadata as APIEventMetadata,
  Identifier,
  GetCompetitionRequest,
  FixtureListEntry,
  FixturesCompetition,
} from '../datasources/feed';
import {
  BetResponse,
  BetStatus as APIBetStatus,
  PlaceBetRequest,
} from '../datasources/trading';
import {
  Bet,
  Competition,
  Selection,
  PlaceBetInput,
  Event,
  Market,
  Submarket,
  EventMetadata,
  OutcomeProbability,
  BetStatus,
  BetErrorCode,
  PlaceBetResult,
} from '../generated/types';
import { CompetitionFilter } from '../types/context';

export function apiBetToGraphql(bet: BetResponse): Bet {
  return {
    referenceId: bet.referenceId,
    sportsKey: bet.sportsKey,
    categoryKey: bet.categoryKey,
    // TODO: expose competition key from api
    eventId: bet.eventId,
    eventName: bet.eventName,
    marketUrl: bet.marketUrl,
    currency: bet.currency,
    price: bet.price,
    stake: bet.stake,
    side: bet.side,
    returnAmount: bet.returnAmount,
    betStatus: apiBetStatusToGraphql(bet.status),
    betErrorCode: apiBetStatusToErrorGraphql(bet.status),
  };
}

export function apiBetToGraphqlPlaceBetResult(
  bet: BetResponse,
): PlaceBetResult {
  return {
    referenceId: bet.referenceId,
    eventId: bet.eventId,
    marketUrl: bet.marketUrl,
    currency: bet.currency,
    price: bet.price,
    stake: bet.stake,
    side: bet.side,
    betStatus: apiBetStatusToGraphql(bet.status),
    betErrorCode: apiBetStatusToErrorGraphql(bet.status),
  };
}

export function apiBetStatusToGraphql(status: APIBetStatus): BetStatus {
  if (Object.values(BetStatus).includes(status as unknown as BetStatus)) {
    return status as unknown as BetStatus;
  }

  return BetStatus.Rejected;
}

export function apiBetStatusToErrorGraphql(
  errStatus: APIBetStatus,
): BetErrorCode | null {
  if (
    Object.values(BetErrorCode).includes(errStatus as unknown as BetErrorCode)
  ) {
    return errStatus as unknown as BetErrorCode;
  }

  return null;
}

export function apiPlaceBetRequestFromGraphql(
  input: PlaceBetInput,
): PlaceBetRequest {
  return {
    referenceId: input.referenceId,
    eventId: input.eventId,
    marketUrl: input.marketUrl,
    currency: input.currency,
    price: input.price,
    stake: input.stake,
    side: input.side,
    acceptPriceChange: input.acceptPriceChange,
  };
}

export function apiCompetitionToGraphql(
  competition: CompetitionResponse,
): Competition {
  return {
    key: competition.key,
    name: competition.name,
    sport: competition.sport,
    category: competition.category,
    eventCount: competition.events.length,
    events: competition.events.map((e) =>
      apiEventForCompetitionToGraphql(
        e,
        competition.sport,
        competition.category,
        competition.key,
        competition.name,
      ),
    ),
  };
}

export function apiEventForCompetitionToGraphql(
  event: EventForCompetition,
  sport: Identifier,
  category: Identifier,
  competitionKey: string,
  competitionName: string,
): Event {
  return {
    id: event.id.toString(),
    key: event.key,
    name: event.name,
    status: event.status,
    sport: sport,
    category: category,
    competition: {
      key: competitionKey,
      name: competitionName,
    },
    cutoffTime: parseJSON(event.cutoffTime),
    home: event.home,
    away: event.away,
    metadata: apiEventMetadataToGraphql(event.metadata),
    markets: apiMarketsToGraphql(event.markets, event.id.toString()),
    sequence: event.sequence.toString(),
  };
}

function apiEventMetadataToGraphql(metadata: APIEventMetadata): EventMetadata {
  const opinions = metadata.opinion.map((op): OutcomeProbability => {
    return {
      marketUrl: getMarketURL(op.marketKey, op.outcome, op.params),
      probability: op.probability.toString(),
    };
  });

  return {
    opinions,
  };
}

function apiMarketsToGraphql(
  marketDictionary: {
    [key: string]: APIMarket;
  },
  eventId: string,
): Market[] {
  const markets = new Array<Market>();
  for (const marketKey in marketDictionary) {
    const market = apiMarketToGraphql(
      marketDictionary[marketKey],
      marketKey,
      eventId,
    );
    markets.push(market);
  }

  return markets;
}

function apiMarketToGraphql(
  market: APIMarket,
  marketKey: string,
  eventId: string,
): Market {
  const submarkets = new Array<Submarket>();
  for (const submarketKey in market.submarkets) {
    const submarket = apiSubmarketToGraphql(
      market.submarkets[submarketKey],
      marketKey,
      submarketKey,
      eventId,
    );
    submarkets.push(submarket);
  }

  return {
    marketKey,
    submarkets,
  };
}

function apiSubmarketToGraphql(
  submarket: APISubmarket,
  marketKey: string,
  submarketKey: string,
  eventId: string,
): Submarket {
  return {
    submarketKey: submarketKey,
    selections: submarket.selections.map((selection) =>
      apiSelectionToGraphql(selection, marketKey, eventId),
    ),
    sequence: submarket.sequence.toString(),
  };
}

function apiSelectionToGraphql(
  selection: APISelection,
  marketKey: string,
  eventId: string,
): Selection {
  const marketUrl = getMarketURL(
    marketKey,
    selection.outcome,
    selection.params,
  );

  return {
    id: `${eventId}/${marketUrl}`,
    marketUrl: marketUrl,
    marketKey: marketKey,
    params: selection.params,
    outcome: selection.outcome,
    maxStake: selection.maxStake.toString(),
    minStake: selection.minStake.toString(),
    price: selection.price.toString(),
    probability: selection.probability.toString(),
    side: selection.side,
    status: selection.status,
  };
}

export function apiEventToGraphql(event: EventResponse): Event {
  return {
    id: event.id.toString(),
    key: event.key,
    name: event.name,
    status: event.status,
    sport: event.sport,
    category: event.competition.category,
    competition: {
      key: event.competition.key,
      name: event.competition.name,
    },
    cutoffTime: parseJSON(event.cutoffTime),
    home: event.home,
    away: event.away,
    metadata: apiEventMetadataToGraphql(event.metadata),
    markets: apiMarketsToGraphql(event.markets, event.id.toString()),
    sequence: event.sequence.toString(),
  };
}

export function apiLineToGraphql(
  marketUrl: string,
  line: LineResponse,
  eventId: string,
): Selection {
  return {
    id: `${eventId}/${marketUrl}`,
    marketUrl: marketUrl,
    marketKey: marketUrl.split('/')[0],
    params: line.params,
    outcome: line.outcome,
    price: line.price.toString(),
    probability: line.probability.toString(),
    minStake: line.minStake.toString(),
    maxStake: line.maxStake.toString(),
    side: line.side,
    status: line.status,
  };
}

function getMarketURL(
  marketKey: string,
  outcome: string,
  params: string,
): string {
  const marketUrl = `${marketKey}/${outcome}`;

  if (params) {
    return `${marketUrl}?${params}`;
  }

  return marketUrl;
}

export function competitionFilterToGetCompetitionRequest(
  filter: CompetitionFilter,
): GetCompetitionRequest {
  if (!filter.key) {
    throw new Error('missing competition key');
  }

  let from = filter.from;
  let to = filter.to;
  if (filter.date) {
    from = filter.date;
    to = add(filter.date, {
      days: 1,
    });
  }

  return {
    key: filter.key,
    from: from,
    to: to,
    marketKeys: filter.marketKeys,
    limit: filter.limit,
  };
}

export function fixtureListEntryToEventGraphql(
  entry: FixtureListEntry,
  sportKey: string,
  sportName: string,
  fixtureCompetition: FixturesCompetition,
): Event {
  return {
    id: entry.id.toString(),
    key: entry.key,
    name: entry.name,
    status: entry.status,
    sport: {
      key: sportKey,
      name: sportName,
    },
    category: fixtureCompetition.category,
    competition: {
      key: fixtureCompetition.key,
      name: fixtureCompetition.name,
    },
    cutoffTime: parseJSON(entry.cutoffTime),
    home: entry.home,
    away: entry.away,

    metadata: undefined,
    markets: [],
    sequence: '',
  };
}

export function getLineId(eventId: string, marketUrl: string): string {
  const split = marketUrl.indexOf('/');
  const marketKey = marketUrl.slice(0, split);
  const outcomeParams = marketUrl.slice(split + 1);
  const params =
    outcomeParams.indexOf('?') === -1
      ? ''
      : outcomeParams.slice(outcomeParams.indexOf('?') + 1);

  let id = `${eventId}/${marketKey}`;
  if (params) {
    id += `?${params}`;
  }

  return id;
}
