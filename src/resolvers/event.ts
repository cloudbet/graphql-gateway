import { apiEventToGraphql } from './mapper';
import { EventResolvers, EventStatus } from '../generated/types';

export const eventResolvers: EventResolvers = {
  metadata: async (event, _, { eventLoader }) => {
    if (event.metadata) {
      return event.metadata;
    }

    if (!event.id) {
      return {};
    }

    if (event.status === EventStatus.PreTrading) {
      return {};
    }

    const resp = await eventLoader.load(event.id);
    const eventGql = apiEventToGraphql(resp);
    if (!eventGql.metadata) {
      return {};
    }

    return eventGql.metadata;
  },

  markets: async (event, _, { eventLoader }) => {
    if (event.markets && event.markets.length > 0) {
      return event.markets;
    }

    if (!event.id) {
      return [];
    }

    if (event.status === EventStatus.PreTrading) {
      return [];
    }

    const resp = await eventLoader.load(event.id);
    const eventGql = apiEventToGraphql(resp);
    if (!eventGql.markets) {
      return [];
    }

    return eventGql.markets;
  },

  sequence: async (event, _, { eventLoader }) => {
    if (event.sequence) {
      return event.sequence;
    }

    if (!event.id) {
      return '';
    }

    const resp = await eventLoader.load(event.id);
    const eventGql = apiEventToGraphql(resp);
    if (!eventGql.sequence) {
      return '';
    }

    return eventGql.sequence;
  },
};
