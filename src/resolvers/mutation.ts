import {
  apiBetToGraphqlPlaceBetResult,
  apiPlaceBetRequestFromGraphql,
} from './mapper';
import { MutationResolvers } from '../generated/types';

export const mutationResolvers: MutationResolvers = {
  placeBet: async (_, { input }, { dataSources }) => {
    const resp = await dataSources.tradingAPI.placeBet(
      apiPlaceBetRequestFromGraphql(input),
    );

    return apiBetToGraphqlPlaceBetResult(resp);
  },
};
