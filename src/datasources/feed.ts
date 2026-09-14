import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';
import { formatISO, getUnixTime } from 'date-fns';

/**
 * Category is used for the /sports/{key} endpoint
 * @export
 * @interface Category
 */
export interface Category {
  key: string;
  name: string;
  competitions: Array<CompetitionForSport>;
}

/**
 * Competition is used for the /sports/competitions/{key} endpoint
 * @export
 * @interface Competition
 */
export interface Competition {
  key: string;
  name: string;
  sport: Identifier;
  category: Identifier;
  events: Array<EventForCompetition>;
}

/**
 * CompetitionForSport is used for the /sports/{key} endpoint
 * @export
 * @interface CompetitionForSport
 */
export interface CompetitionForSport {
  key: string;
  name: string;
  eventCount?: number;
}

/**
 * CompetitionResponse presents competition with list of events
 * @export
 * @interface CompetitionResponse
 */
export interface CompetitionResponse {
  key: string;
  name: string;
  sport: Identifier;
  category: Identifier;
  events: Array<EventForCompetition>;
}

/**
 * CompetitionWithCategory is used for the /sports/events/{id} endpoint to link events with competitions
 * @export
 * @interface CompetitionWithCategory
 */
export interface CompetitionWithCategory {
  key: string;
  name: string;
  category: Identifier;
}

/**
 * Event is used for the /sports/events/{id} endpoint
 * @export
 * @interface Event
 */
export interface Event {
  id: number;
  key: string;
  name: string;
  status: EventStatus;
  sport: Identifier;
  competition: CompetitionWithCategory;
  cutoffTime: string;
  home: TeamIdentifier;
  away: TeamIdentifier;
  metadata: EventMetadata;
  markets: { [key: string]: Market };
  sequence: number;
}

/**
 * EventForCompetition is used for the /sports/competitions/{key} endpoint
 * @export
 * @interface EventForCompetition
 */
export interface EventForCompetition {
  id: number;
  key: string;
  name: string;
  status: EventStatus;
  home: TeamIdentifier;
  away: TeamIdentifier;
  cutoffTime: string;
  markets: { [key: string]: Market };
  metadata: EventMetadata;
  sequence: number;
}

/**
 * Event metadata contains additional event info
 * @export
 * @interface EventMetadata
 */
export interface EventMetadata {
  opinion: Array<OutcomeProbability>;
}

/**
 * EventResponse presents an Event with markets and submarkets
 * @export
 * @interface EventResponse
 */
export interface EventResponse {
  id: number;
  key: string;
  name: string;
  sport: Identifier;
  status: EventStatus;
  home: TeamIdentifier;
  away: TeamIdentifier;
  competition: CompetitionWithCategory;
  cutoffTime: string;
  markets: { [key: string]: Market };
  metadata: EventMetadata;
  sequence: number;
}

/**
 * EventStatus presents the current status for a given Event
 * @export
 * @enum {string}
 */
export enum EventStatus {
  PreTrading = 'PRE_TRADING',
  Trading = 'TRADING',
  TradingLive = 'TRADING_LIVE',
  Resulted = 'RESULTED',
  Interrupted = 'INTERRUPTED',
  AwaitingResults = 'AWAITING_RESULTS',
  PostTrading = 'POST_TRADING',
  Cancelled = 'CANCELLED',
}

/**
 * FixtureListEntry is used for the /fixtures endpoint It gives an individual sporting event without markets or metadata information
 * @export
 * @interface FixtureListEntry
 */
export interface FixtureListEntry {
  id: number;
  key: string;
  name: string;
  cutoffTime: string;
  home?: TeamIdentifier;
  away?: TeamIdentifier;
  status: EventStatus;
}

/**
 * FixturesCompetition is used for the /fixtures endpoint It gives a list of all events for a given competition
 * @export
 * @interface FixturesCompetition
 */
export interface FixturesCompetition {
  key: string;
  name: string;
  category: Identifier;
  events: Array<FixtureListEntry>;
}

/**
 * FixturesResponse presents a list of upcoming fixtures for a given sport and date
 * @export
 * @interface FixturesResponse
 */
export interface FixturesResponse {
  competitions: Array<FixturesCompetition>;
}

/**
 * Identifier represents a name-key tuple which together identify a given entity such as a sport
 * @export
 * @interface Identifier
 */
export interface Identifier {
  key: string;
  name: string;
}

/**
 * LineResponse presents a selection for a given market key, outcome and params
 * @export
 * @interface LineResponse
 */
export interface LineResponse {
  outcome: string;
  params: string;
  minStake: number;
  maxStake: number;
  price: number;
  probability: number;
  side: Side;
  status: SelectionStatus;
}

/**
 * Market is used as a part of Event and EventForCompetition used to build a list of all markets for a given Event
 * @export
 * @interface Market
 */
export interface Market {
  submarkets?: { [key: string]: Submarket };
}

/**
 * Similar to Selection, but represents opinion (probability) for particular outcome of the market
 * @export
 * @interface OutcomeProbability
 */
export interface OutcomeProbability {
  marketKey: string;
  outcome: string;
  params: string;
  probability: number;
}

/**
 * Selection is used as a part of Submarket used to build a list of all selections for a given Submarket
 * @export
 * @interface Selection
 */
export interface Selection {
  outcome: string;
  params: string;
  minStake: number;
  maxStake: number;
  price: number;
  probability: number;
  side: Side;
  status: SelectionStatus;
}

/**
 * SelectionStatus presents the current status for a given selection
 * @export
 * @enum {string}
 */
export enum SelectionStatus {
  SelectionDisabled = 'SELECTION_DISABLED',
  SelectionEnabled = 'SELECTION_ENABLED',
}

/**
 * Side of a selection signals whether a selection is available for back or lay side betting
 * @export
 * @enum {string}
 */
export enum Side {
  Back = 'BACK',
  Lay = 'LAY',
}

/**
 * Sport is used for an individual sport's details in the /sports endpoint
 * @export
 * @interface Sport
 */
export interface Sport {
  key: string;
  name: string;
  competitionCount?: number;
  eventCount?: number;
}

/**
 * SportWithCategory is used for the /sports/{key} endpoint with this hierarchy: sport->categories->competitions
 * @export
 * @interface SportWithCategory
 */
export interface SportWithCategory {
  key: string;
  name: string;
  categories: Array<Category>;
  competitionCount?: number;
  eventCount?: number;
}

/**
 * SportWithCategoryResponse presents all competitions grouped by categories
 * @export
 * @interface SportWithCategoryResponse
 */
export interface SportWithCategoryResponse {
  key: string;
  name: string;
  categories: Array<Category>;
  competitionCount?: number;
  eventCount?: number;
}

/**
 * Sports is used as the root object in the /sports endpoint
 * @export
 * @interface Sports
 */
export interface Sports {
  sports: Array<Sport>;
}

/**
 * SportsResponse presents all sports with their competition count
 * @export
 * @interface SportsResponse
 */
export interface SportsResponse {
  sports: Array<Sport>;
}

/**
 * Submarket contains selections which are inter-dependent on each other and is used as a part of Market used to build a map of all submarkets for a given Market
 * @export
 * @interface Submarket
 */
export interface Submarket {
  selections: Array<Selection>;
  sequence: number;
}

/**
 * Team presents the team for a given player
 * @export
 * @enum {string}
 */
export enum Team {
  TEAMUNDEFINED = 'TEAM_UNDEFINED',
  HOME = 'HOME',
  AWAY = 'AWAY',
}

/**
 * TeamIdentifier identifies a team competitor for a given event
 * @export
 * @interface TeamIdentifier
 */
export interface TeamIdentifier {
  key: string;
  abbreviation: string;
  name: string;
  nationality: string;
}

export interface GetCompetitionRequest {
  key: string;
  from?: Date | null;
  to?: Date | null;
  marketKeys?: Array<string> | null;
  limit?: number | null;
}

export interface GetEventRequest {
  id: string;
  marketKeys?: Array<string>;
}

export interface GetLineRequest {
  eventId: string;
  marketUrl: string;
}

export interface GetFixturesRequest {
  sportsKey: string;
  date: Date;
  limit?: number | null;
}

export interface IFeedAPIDataSource {
  getCompetition: (
    request: GetCompetitionRequest,
  ) => Promise<CompetitionResponse>;
  getEvent: (request: GetEventRequest) => Promise<EventResponse>;
  getFixtures: (request: GetFixturesRequest) => Promise<FixturesResponse>;
  getLine: (request: GetLineRequest) => Promise<LineResponse>;
  getSports: () => Promise<SportsResponse>;
  getSport: (key: string) => Promise<SportWithCategoryResponse>;
}

export class FeedAPI extends RESTDataSource implements IFeedAPIDataSource {
  private headersToProxy: Map<string, string>;
  constructor(options: {
    baseURL: string;
    headersToProxy: Map<string, string>;
  }) {
    super();

    this.baseURL = options.baseURL;
    this.headersToProxy = options.headersToProxy;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    // we don't need pass everything for feed, just proxy the x-api-key. via cloudflare
    const apiKey = 'x-api-key';
    const value = this.headersToProxy?.get(apiKey);
    if (value) {
      request.headers[apiKey] = value;
    }
    request.headers['connection'] = 'keep-alive';
  }

  async getCompetition(
    request: GetCompetitionRequest,
  ): Promise<CompetitionResponse> {
    const searchParams = new URLSearchParams();
    if (request.from) {
      searchParams.append('from', getUnixTime(request.from).toString());
    }
    if (request.to) {
      searchParams.append('to', getUnixTime(request.to).toString());
    }
    if (request.marketKeys) {
      for (const marketKey of request.marketKeys) {
        searchParams.append('markets', marketKey);
      }
    }
    if (request.limit) {
      searchParams.append('limit', request.limit.toString());
    }

    return this.get(
      `/pub/v2/odds/competitions/${encodeURIComponent(request.key)}`,
      {
        params: searchParams,
      },
    );
  }

  async getEvent(request: GetEventRequest): Promise<EventResponse> {
    const searchParams = new URLSearchParams();
    if (request.marketKeys) {
      for (const marketKey of request.marketKeys) {
        searchParams.append('markets', marketKey);
      }
    }

    return this.get(`/pub/v2/odds/events/${encodeURIComponent(request.id)}`, {
      params: searchParams,
    });
  }

  async getFixtures(request: GetFixturesRequest): Promise<FixturesResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('sport', request.sportsKey);
    searchParams.append(
      'date',
      formatISO(request.date, { representation: 'date' }),
    );
    if (request.limit) {
      searchParams.append('limit', request.limit.toString());
    }

    return this.get('/pub/v2/odds/fixtures', { params: searchParams });
  }

  async getLine(request: GetLineRequest): Promise<LineResponse> {
    return this.post('/pub/v2/odds/lines', { body: request });
  }

  async getSports(): Promise<SportsResponse> {
    return this.get('/pub/v2/odds/sports');
  }

  async getSport(key: string): Promise<SportWithCategoryResponse> {
    return this.get(`/pub/v2/odds/sports/${encodeURIComponent(key)}`);
  }
}
