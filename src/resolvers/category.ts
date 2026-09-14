import {
  apiCompetitionToGraphql,
  competitionFilterToGetCompetitionRequest,
} from './mapper';
import { GetCompetitionRequest } from '../datasources/feed';
import { CategoryResolvers, Competition } from '../generated/types';

export const categoryResolvers: CategoryResolvers = {
  competitions: async (category, _, { dataSources, competitionFilter }) => {
    if (!category.competitions) {
      return [];
    }

    const promises = category.competitions.map(
      async (competition): Promise<Competition> => {
        // default request without filtering
        let getCompetitionRequest: GetCompetitionRequest = {
          key: competition.key,
          // TODO: fix the limit for calling sports query otherwise too much loads
          limit: 1,
        };
        if (competitionFilter) {
          getCompetitionRequest = competitionFilterToGetCompetitionRequest({
            ...competitionFilter,
            key: competition.key,
          });
        }

        const competitionResp = await dataSources.feedAPI.getCompetition(
          getCompetitionRequest,
        );

        const competitionGql = apiCompetitionToGraphql(competitionResp);

        if (competitionFilter?.eventStatus) {
          competitionGql.events = competitionGql.events?.filter(
            (e) => e.status === competitionFilter.eventStatus,
          );
        }

        return competitionGql;
      },
    );

    return Promise.all(promises);
  },
};
