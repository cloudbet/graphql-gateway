import DataLoader from 'dataloader';
import { Logger } from 'winston';

import { IDataSource as IDataSources } from '../datasources';
import {
  EventResponse,
  SportsResponse,
  SportWithCategoryResponse,
} from '../datasources/feed';
import { EventStatus } from '../generated/types';

export interface Context {
  logger: Logger;

  headersToProxy: Map<string, string>;

  dataSources: IDataSources;

  eventLoader: DataLoader<string, EventResponse>;
  sportLoader: DataLoader<string, SportWithCategoryResponse>;
  sportsLoader: DataLoader<string, SportsResponse>;

  categoryFilter?: CategoryFilter;
  competitionFilter?: CompetitionFilter;
}

export interface CategoryFilter {
  key?: string | null;
}

export interface CompetitionFilter {
  key?: string | null;
  date?: Date | null;
  from?: Date | null;
  to?: Date | null;
  marketKeys?: string[] | null;
  limit?: number | null;
  eventStatus?: EventStatus | null;
}
