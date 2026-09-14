import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../types/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: Date; output: Date; }
  DateTime: { input: Date; output: Date; }
};

export enum AcceptPriceChange {
  Better = 'BETTER',
  None = 'NONE'
}

/** Account Balance */
export type AccountBalance = {
  __typename?: 'AccountBalance';
  /** The account balance */
  amount: Scalars['String']['output'];
  /** Currency */
  currency: Scalars['String']['output'];
};

/** Account Info */
export type AccountInfo = {
  __typename?: 'AccountInfo';
  /** Email of this account */
  email: Scalars['String']['output'];
  /** Nickname of this account */
  nickname: Scalars['String']['output'];
  /** UUID of this account */
  uuid: Scalars['String']['output'];
};

/** Bet Detail */
export type Bet = {
  __typename?: 'Bet';
  /** Bet error code if any */
  betErrorCode?: Maybe<BetErrorCode>;
  /** Bet status to indicate bet acceptance and settlement result */
  betStatus: BetStatus;
  /** Slug for this Category */
  categoryKey: Scalars['String']['output'];
  /** Currency for given stake */
  currency: Scalars['String']['output'];
  /** Event ID */
  eventId: Scalars['String']['output'];
  /** Name of this event */
  eventName: Scalars['String']['output'];
  /**
   * Market URL, is compiled from the feed data as marketKey/outcome?params, if no params (empty string) are present omit the query string and format as marketKey/outcome
   * Special Note about handicap markets:
   * For handicap markets a line is identified by the same params. Selections can be grouped by market key and params alone. Home and away outcomes then have the same market URL for the same handicap lines. The handicap value is dictated by the home team value and inverted on the away side.
   */
  marketUrl: Scalars['String']['output'];
  /** Price placed on this Selection */
  price: Scalars['String']['output'];
  /** Reference ID, randomly generated request id to allow idempotent calls. Required to be in the UUID format. */
  referenceId: Scalars['ID']['output'];
  /** Return Amount as number, pending bets will have 0 */
  returnAmount: Scalars['String']['output'];
  /**
   * Side of a selection signals whether a selection
   * is available for back or lay side betting
   */
  side: Side;
  /** Slug for this Sport */
  sportsKey: Scalars['String']['output'];
  /** Stake placed on this Selection */
  stake: Scalars['String']['output'];
};

export enum BetErrorCode {
  /** Duplicated request with same Reference ID was posted, this is due to idempotent request handling. If you want to resubmit this bet. Please add a new Reference ID */
  DuplicateRequest = 'DUPLICATE_REQUEST',
  /** Account doesn't have sufficient funds in the requested currency */
  InsufficientFunds = 'INSUFFICIENT_FUNDS',
  /** Unexpected error at server side. Our engineering team is informed of the issue. Please try again or contact our customer support if this problem persists */
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  /** Your current liability limit on this event was exceeded. Please reference stake from response payload about the corrected value for retry */
  LiabilityLimitExceeded = 'LIABILITY_LIMIT_EXCEEDED',
  /** The request was not sent as per the expected request structure */
  MalformedRequest = 'MALFORMED_REQUEST',
  /** You attempted to bet on an inactive selection */
  MarketSuspended = 'MARKET_SUSPENDED',
  /** Bet price requested was above the current market price. Please reference price from response payload about the corrected value for retry */
  PriceAboveMarket = 'PRICE_ABOVE_MARKET',
  /** Your current account settings don't allow you to bet on this event. Restrictions will be lifted automatically as your account attains tenure and trust. Please contact customer support if you believe you qualify and we will review your account. */
  Restricted = 'RESTRICTED',
  /** Stake requested was above the current maximum stake on a selection. Please reference stake from response payload about the corrected value for retry */
  StakeAboveMax = 'STAKE_ABOVE_MAX',
  /** Stake requested was below the current minimum stake on a selection. Please reference stake from response payload about the corrected value for retry */
  StakeBelowMin = 'STAKE_BELOW_MIN',
  /** Your account needs to be verified using our KYC procedures. Please contact customer support for more details. */
  VerificationRequired = 'VERIFICATION_REQUIRED'
}

/** Bet Status */
export enum BetStatus {
  /** Your bet was accepted successfully */
  Accepted = 'ACCEPTED',
  /** Half loss, e.g. on a handicap market */
  HalfLoss = 'HALF_LOSS',
  /** Half win, e.g. on a handicap market */
  HalfWin = 'HALF_WIN',
  /** You lost the bet */
  Loss = 'LOSS',
  /** Partial win, including dead heat result */
  Partial = 'PARTIAL',
  /** Your bet is being processed by the system. Please check the bet status again periodically to get bet status updates */
  PendingAcceptance = 'PENDING_ACCEPTANCE',
  /** Market not applicable to result, e.g. draw on 2way, handicap */
  Push = 'PUSH',
  /** Your bet was rejected */
  Rejected = 'REJECTED',
  /** You won the bet */
  Win = 'WIN'
}

/** Category is used for an individual category's details */
export type Category = {
  __typename?: 'Category';
  /** List of all competitions associated with this Category */
  competitions?: Maybe<Array<Competition>>;
  /** Slug for this Category */
  key: Scalars['ID']['output'];
  /** Name for this Category */
  name: Scalars['String']['output'];
};

/** CategorySummary is used for an individual category's summary */
export type CategorySummary = {
  __typename?: 'CategorySummary';
  /** Slug for this Category */
  key: Scalars['ID']['output'];
  /** Name for this Category */
  name: Scalars['String']['output'];
};

/** Competition presents competition with list of events */
export type Competition = {
  __typename?: 'Competition';
  /** Identifier for category */
  category: Identifier;
  /** Number of events associated with this Sport, 0 indicates inactive Sport */
  eventCount?: Maybe<Scalars['Int']['output']>;
  /** List of all events associated with this competition */
  events?: Maybe<Array<Event>>;
  /** Slug for this Competition. Composed of <sport-key>-<category-key>-<competition-key> as shown in the example value. */
  key: Scalars['ID']['output'];
  /** Name for this Competition */
  name: Scalars['String']['output'];
  /** Identifier for sport */
  sport: Identifier;
};

/** Event with markets and submarkets */
export type Event = {
  __typename?: 'Event';
  /** TeamIdentifier identifies a team competitor for a given event */
  away?: Maybe<TeamIdentifier>;
  /** Identifier for category */
  category: Identifier;
  /** Identifier for competition */
  competition: Identifier;
  /** Event cutoff time in string format "2006-01-02T15:04:05Z07:00" (RFC3339) */
  cutoffTime: Scalars['DateTime']['output'];
  /** TeamIdentifier identifies a team competitor for a given event */
  home?: Maybe<TeamIdentifier>;
  /** Unique ID for this Event */
  id: Scalars['ID']['output'];
  /** Slug for this Event */
  key: Scalars['String']['output'];
  /** List of all markets for a given Event */
  markets?: Maybe<Array<Market>>;
  /** Event metadata contains additional event info */
  metadata?: Maybe<EventMetadata>;
  /** Name of this Event */
  name: Scalars['String']['output'];
  /** Sequential update number for this Event */
  sequence: Scalars['String']['output'];
  /** Identifier for sport */
  sport: Identifier;
  /** EventStatus presents the current status for a given Event */
  status: EventStatus;
};

/** Event metadata contains additional event info */
export type EventMetadata = {
  __typename?: 'EventMetadata';
  /** Opinion is an answer to the question "How do players bet on Cloudbet v/s the currently offered odds?" */
  opinions?: Maybe<Array<OutcomeProbability>>;
};

/** Event Status */
export enum EventStatus {
  AwaitingResults = 'AWAITING_RESULTS',
  Cancelled = 'CANCELLED',
  Interrupted = 'INTERRUPTED',
  PostTrading = 'POST_TRADING',
  PreTrading = 'PRE_TRADING',
  Resulted = 'RESULTED',
  Trading = 'TRADING',
  TradingLive = 'TRADING_LIVE'
}

/** Identifier represents a name-key tuple which together identify a given entity such as a sport */
export type Identifier = {
  __typename?: 'Identifier';
  /** Slug for this Identifier */
  key: Scalars['ID']['output'];
  /** Name for this Identifier */
  name: Scalars['String']['output'];
};

/** Market is used to build a list of all markets for a given Event */
export type Market = {
  __typename?: 'Market';
  /** Slug for this market */
  marketKey: Scalars['String']['output'];
  /** All associated submarkets for this Market */
  submarkets?: Maybe<Array<Submarket>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Place bet request */
  placeBet: PlaceBetResult;
};


export type MutationPlaceBetArgs = {
  input: PlaceBetInput;
};

/** Similar to Selection, but represents opinion (probability) for particular outcome of the market */
export type OutcomeProbability = {
  __typename?: 'OutcomeProbability';
  /**
   * MarketUrl is composed from the initial Feed API selection response as marketKey/outcome?params.
   * If no params (empty string) were present in the initial Feed API response, then omit the params query string format the marketUrl as marketKey/outcome
   * Special Note about handicap markets:
   * For handicap markets a line is identified by the same params. Selections can be grouped by market key and params alone. Home and away outcomes then have the same market URL for the same handicap lines. The handicap value is dictated by the home team value and inverted on the away side.
   */
  marketUrl: Scalars['String']['output'];
  /** Similar to Selection, but represents opinion (probability) for particular outcome of the market */
  probability: Scalars['String']['output'];
};

/** Request to place bet */
export type PlaceBetInput = {
  /** Accept price changes when placing bet (default: NONE) */
  acceptPriceChange?: InputMaybe<AcceptPriceChange>;
  /** Currency for given stake */
  currency: Scalars['String']['input'];
  /** Event ID */
  eventId: Scalars['String']['input'];
  /**
   * Market URL, is compiled from the feed data as marketKey/outcome?params, if no params (empty string) are present omit the query string and format as marketKey/outcome
   * Special Note about handicap markets:
   * For handicap markets a line is identified by the same params. Selections can be grouped by market key and params alone. Home and away outcomes then have the same market URL for the same handicap lines. The handicap value is dictated by the home team value and inverted on the away side.
   */
  marketUrl: Scalars['String']['input'];
  /** Price placed on this Selection */
  price: Scalars['String']['input'];
  /** Reference ID, randomly generated request id to allow idempotent calls. Required to be in the UUID format. */
  referenceId: Scalars['ID']['input'];
  /** Side of a selection (default: BACK) */
  side?: InputMaybe<Side>;
  /** Stake placed on this Selection */
  stake: Scalars['String']['input'];
};

/** Place Bet Result */
export type PlaceBetResult = {
  __typename?: 'PlaceBetResult';
  /** Bet error code if any */
  betErrorCode?: Maybe<BetErrorCode>;
  /** Bet status to indicate bet acceptance and settlement result */
  betStatus: BetStatus;
  /** Currency for given stake */
  currency: Scalars['String']['output'];
  /** Event ID */
  eventId: Scalars['String']['output'];
  /**
   * Market URL, is compiled from the feed data as marketKey/outcome?params, if no params (empty string) are present omit the query string and format as marketKey/outcome
   * Special Note about handicap markets:
   * For handicap markets a line is identified by the same params. Selections can be grouped by market key and params alone. Home and away outcomes then have the same market URL for the same handicap lines. The handicap value is dictated by the home team value and inverted on the away side.
   */
  marketUrl: Scalars['String']['output'];
  /** Price placed on this Selection */
  price: Scalars['String']['output'];
  /** Reference ID, randomly generated request id to allow idempotent calls. Required to be in the UUID format. */
  referenceId: Scalars['ID']['output'];
  /**
   * Side of a selection signals whether a selection
   * is available for back or lay side betting
   */
  side: Side;
  /** Stake placed on this Selection */
  stake: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get the account balance by currency */
  accountBalance: AccountBalance;
  /** Get the account balances for all currencies */
  accountBalances?: Maybe<Array<AccountBalance>>;
  /** List currencies available on the account */
  accountCurrencies?: Maybe<Array<Scalars['String']['output']>>;
  /** Show account information */
  accountInfo: AccountInfo;
  /** Get bet by reference id (randomly generated UUID) */
  bet: Bet;
  /** Get accepted bet history request with pagination */
  bets?: Maybe<Array<Bet>>;
  /** Get compeition for live and upcoming events of the given competiiton key */
  competition: Competition;
  /** Shows live and upcoming competitions of a given sport for a given date. Note that a "day" counts as 00:00:00 UTC to 23:59:59 UTC on the requested date. */
  competitions?: Maybe<Array<Competition>>;
  /** Get event by id */
  event: Event;
  /** Obtain latest odds for a line based on market key and params. Composed of <event-id>/<market-key>?<params>. e.g. 12118347/tennis.winner. The params are optional, e.g. handicap=1 for handicap market. */
  line?: Maybe<Array<Selection>>;
  /** Obtain latest odds for a selection based on market key, outcome and params. Composed of <event-id>/<market-key>/<outcome>?<params>. e.g. 12118347/tennis.winner/home. The params are optional, e.g. handicap=1 for handicap market. */
  selection: Selection;
  /** Get sport related information by given constraints */
  sport: Sport;
  /** Get list of all available sports offerred */
  sports?: Maybe<Array<SportSummary>>;
};


export type QueryAccountBalanceArgs = {
  currency: Scalars['String']['input'];
};


export type QueryBetArgs = {
  referenceId: Scalars['String']['input'];
};


export type QueryBetsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCompetitionArgs = {
  competitionKey: Scalars['String']['input'];
  date?: InputMaybe<Scalars['Date']['input']>;
  from?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  markets?: InputMaybe<Array<Scalars['String']['input']>>;
  to?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryCompetitionsArgs = {
  date?: InputMaybe<Scalars['Date']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sportKey: Scalars['String']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLineArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySelectionArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySportArgs = {
  categoryKey?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  eventStatus?: InputMaybe<EventStatus>;
  from?: InputMaybe<Scalars['DateTime']['input']>;
  sportKey: Scalars['String']['input'];
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

/**
 * Selection is used as a part of Submarket
 * used to build a list of all selections for a given Submarket
 */
export type Selection = {
  __typename?: 'Selection';
  /** Unique ID for this Selection. Composed of <event-id>/<market-key>/<outcome>/<params>. e.g. 9790627/american_football.team_odd_even/odd?team=away */
  id: Scalars['ID']['output'];
  /** Market Key */
  marketKey: Scalars['String']['output'];
  /**
   * MarketUrl is composed from the initial Feed API selection response as marketKey/outcome?params.
   * If no params (empty string) were present in the initial Feed API response, then omit the params query string format the marketUrl as marketKey/outcome
   * Special Note about handicap markets:
   * For handicap markets a line is identified by the same params. Selections can be grouped by market key and params alone. Home and away outcomes then have the same market URL for the same handicap lines. The handicap value is dictated by the home team value and inverted on the away side.
   */
  marketUrl: Scalars['String']['output'];
  /** Maximum stake in EUR which can be placed in bets on this Selection; market liability = selection max stake * (price - 1); minimum stake is 0.01 EUR for all markets */
  maxStake: Scalars['String']['output'];
  /** Minimum stake in EUR which can be placed in bets on this Selection */
  minStake: Scalars['String']['output'];
  /** Outcome */
  outcome: Scalars['String']['output'];
  /** Params */
  params: Scalars['String']['output'];
  /** Price at which bets can be placed on this Selection */
  price: Scalars['String']['output'];
  /** Probability of this Selection's outcome */
  probability: Scalars['String']['output'];
  /** Side of a selection */
  side: Side;
  /** SelectionStatus presents the current status for a given selection */
  status: SelectionStatus;
};

/** Selection status */
export enum SelectionStatus {
  SelectionDisabled = 'SELECTION_DISABLED',
  SelectionEnabled = 'SELECTION_ENABLED'
}

/** Side of a selection signals whether a selection is available for back or lay side betting */
export enum Side {
  Back = 'BACK',
  Lay = 'LAY'
}

/** Sport is used for an individual sport's details */
export type Sport = {
  __typename?: 'Sport';
  /** List of all categories associated with this Sport */
  categories?: Maybe<Array<Category>>;
  /** Number of competitions associated with this Sport, 0 indicates inactive Sport */
  competitionCount?: Maybe<Scalars['Int']['output']>;
  /** Number of events associated with this Sport, 0 indicates inactive Sport */
  eventCount?: Maybe<Scalars['Int']['output']>;
  /** Slug for this Sport */
  key: Scalars['ID']['output'];
  /** Name of this Sport */
  name: Scalars['String']['output'];
};

/** SportSummary is used for an individual sport's summary */
export type SportSummary = {
  __typename?: 'SportSummary';
  /** List of all categories associated with this Sport */
  categories?: Maybe<Array<CategorySummary>>;
  /** Number of competitions associated with this Sport, 0 indicates inactive Sport */
  competitionCount?: Maybe<Scalars['Int']['output']>;
  /** Number of events associated with this Sport, 0 indicates inactive Sport */
  eventCount?: Maybe<Scalars['Int']['output']>;
  /** Slug for this Sport */
  key: Scalars['ID']['output'];
  /** Name of this Sport */
  name: Scalars['String']['output'];
};

/**
 * Submarket contains selections which are inter-dependent on each other and is used as a part of Market
 * used to build a map of all submarkets for a given Market
 */
export type Submarket = {
  __typename?: 'Submarket';
  /** List of all associated selections */
  selections?: Maybe<Array<Selection>>;
  /** Sequential update number */
  sequence: Scalars['String']['output'];
  /** Slug for this submarket */
  submarketKey: Scalars['String']['output'];
};

/** TeamIdentifier identifies a team competitor for a given event */
export type TeamIdentifier = {
  __typename?: 'TeamIdentifier';
  /** Abbreviation for this team's name */
  abbreviation: Scalars['String']['output'];
  /** Slug for this Identifier */
  key: Scalars['ID']['output'];
  /** Name for this Identifier */
  name: Scalars['String']['output'];
  /** Team country code */
  nationality: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AcceptPriceChange: ResolverTypeWrapper<Partial<AcceptPriceChange>>;
  AccountBalance: ResolverTypeWrapper<Partial<AccountBalance>>;
  AccountInfo: ResolverTypeWrapper<Partial<AccountInfo>>;
  Bet: ResolverTypeWrapper<Partial<Bet>>;
  BetErrorCode: ResolverTypeWrapper<Partial<BetErrorCode>>;
  BetStatus: ResolverTypeWrapper<Partial<BetStatus>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  Category: ResolverTypeWrapper<Partial<Category>>;
  CategorySummary: ResolverTypeWrapper<Partial<CategorySummary>>;
  Competition: ResolverTypeWrapper<Partial<Competition>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']['output']>>;
  DateTime: ResolverTypeWrapper<Partial<Scalars['DateTime']['output']>>;
  Event: ResolverTypeWrapper<Partial<Event>>;
  EventMetadata: ResolverTypeWrapper<Partial<EventMetadata>>;
  EventStatus: ResolverTypeWrapper<Partial<EventStatus>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  Identifier: ResolverTypeWrapper<Partial<Identifier>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  Market: ResolverTypeWrapper<Partial<Market>>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  OutcomeProbability: ResolverTypeWrapper<Partial<OutcomeProbability>>;
  PlaceBetInput: ResolverTypeWrapper<Partial<PlaceBetInput>>;
  PlaceBetResult: ResolverTypeWrapper<Partial<PlaceBetResult>>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Selection: ResolverTypeWrapper<Partial<Selection>>;
  SelectionStatus: ResolverTypeWrapper<Partial<SelectionStatus>>;
  Side: ResolverTypeWrapper<Partial<Side>>;
  Sport: ResolverTypeWrapper<Partial<Sport>>;
  SportSummary: ResolverTypeWrapper<Partial<SportSummary>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  Submarket: ResolverTypeWrapper<Partial<Submarket>>;
  TeamIdentifier: ResolverTypeWrapper<Partial<TeamIdentifier>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountBalance: Partial<AccountBalance>;
  AccountInfo: Partial<AccountInfo>;
  Bet: Partial<Bet>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  Category: Partial<Category>;
  CategorySummary: Partial<CategorySummary>;
  Competition: Partial<Competition>;
  Date: Partial<Scalars['Date']['output']>;
  DateTime: Partial<Scalars['DateTime']['output']>;
  Event: Partial<Event>;
  EventMetadata: Partial<EventMetadata>;
  ID: Partial<Scalars['ID']['output']>;
  Identifier: Partial<Identifier>;
  Int: Partial<Scalars['Int']['output']>;
  Market: Partial<Market>;
  Mutation: Record<PropertyKey, never>;
  OutcomeProbability: Partial<OutcomeProbability>;
  PlaceBetInput: Partial<PlaceBetInput>;
  PlaceBetResult: Partial<PlaceBetResult>;
  Query: Record<PropertyKey, never>;
  Selection: Partial<Selection>;
  Sport: Partial<Sport>;
  SportSummary: Partial<SportSummary>;
  String: Partial<Scalars['String']['output']>;
  Submarket: Partial<Submarket>;
  TeamIdentifier: Partial<TeamIdentifier>;
}>;

export type AccountBalanceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AccountBalance'] = ResolversParentTypes['AccountBalance']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type AccountInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AccountInfo'] = ResolversParentTypes['AccountInfo']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nickname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type BetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Bet'] = ResolversParentTypes['Bet']> = ResolversObject<{
  betErrorCode?: Resolver<Maybe<ResolversTypes['BetErrorCode']>, ParentType, ContextType>;
  betStatus?: Resolver<ResolversTypes['BetStatus'], ParentType, ContextType>;
  categoryKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eventId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eventName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  marketUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  returnAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  side?: Resolver<ResolversTypes['Side'], ParentType, ContextType>;
  sportsKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stake?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type CategoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = ResolversObject<{
  competitions?: Resolver<Maybe<Array<ResolversTypes['Competition']>>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type CategorySummaryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CategorySummary'] = ResolversParentTypes['CategorySummary']> = ResolversObject<{
  key?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type CompetitionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Competition'] = ResolversParentTypes['Competition']> = ResolversObject<{
  category?: Resolver<ResolversTypes['Identifier'], ParentType, ContextType>;
  eventCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  events?: Resolver<Maybe<Array<ResolversTypes['Event']>>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sport?: Resolver<ResolversTypes['Identifier'], ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = ResolversObject<{
  away?: Resolver<Maybe<ResolversTypes['TeamIdentifier']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['Identifier'], ParentType, ContextType>;
  competition?: Resolver<ResolversTypes['Identifier'], ParentType, ContextType>;
  cutoffTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  home?: Resolver<Maybe<ResolversTypes['TeamIdentifier']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  markets?: Resolver<Maybe<Array<ResolversTypes['Market']>>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['EventMetadata']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sequence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sport?: Resolver<ResolversTypes['Identifier'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['EventStatus'], ParentType, ContextType>;
}>;

export type EventMetadataResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventMetadata'] = ResolversParentTypes['EventMetadata']> = ResolversObject<{
  opinions?: Resolver<Maybe<Array<ResolversTypes['OutcomeProbability']>>, ParentType, ContextType>;
}>;

export type IdentifierResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Identifier'] = ResolversParentTypes['Identifier']> = ResolversObject<{
  key?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MarketResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Market'] = ResolversParentTypes['Market']> = ResolversObject<{
  marketKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  submarkets?: Resolver<Maybe<Array<ResolversTypes['Submarket']>>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  placeBet?: Resolver<ResolversTypes['PlaceBetResult'], ParentType, ContextType, RequireFields<MutationPlaceBetArgs, 'input'>>;
}>;

export type OutcomeProbabilityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OutcomeProbability'] = ResolversParentTypes['OutcomeProbability']> = ResolversObject<{
  marketUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  probability?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type PlaceBetResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PlaceBetResult'] = ResolversParentTypes['PlaceBetResult']> = ResolversObject<{
  betErrorCode?: Resolver<Maybe<ResolversTypes['BetErrorCode']>, ParentType, ContextType>;
  betStatus?: Resolver<ResolversTypes['BetStatus'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eventId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  marketUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  referenceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  side?: Resolver<ResolversTypes['Side'], ParentType, ContextType>;
  stake?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  accountBalance?: Resolver<ResolversTypes['AccountBalance'], ParentType, ContextType, RequireFields<QueryAccountBalanceArgs, 'currency'>>;
  accountBalances?: Resolver<Maybe<Array<ResolversTypes['AccountBalance']>>, ParentType, ContextType>;
  accountCurrencies?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  accountInfo?: Resolver<ResolversTypes['AccountInfo'], ParentType, ContextType>;
  bet?: Resolver<ResolversTypes['Bet'], ParentType, ContextType, RequireFields<QueryBetArgs, 'referenceId'>>;
  bets?: Resolver<Maybe<Array<ResolversTypes['Bet']>>, ParentType, ContextType, Partial<QueryBetsArgs>>;
  competition?: Resolver<ResolversTypes['Competition'], ParentType, ContextType, RequireFields<QueryCompetitionArgs, 'competitionKey'>>;
  competitions?: Resolver<Maybe<Array<ResolversTypes['Competition']>>, ParentType, ContextType, RequireFields<QueryCompetitionsArgs, 'sportKey'>>;
  event?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<QueryEventArgs, 'id'>>;
  line?: Resolver<Maybe<Array<ResolversTypes['Selection']>>, ParentType, ContextType, RequireFields<QueryLineArgs, 'id'>>;
  selection?: Resolver<ResolversTypes['Selection'], ParentType, ContextType, RequireFields<QuerySelectionArgs, 'id'>>;
  sport?: Resolver<ResolversTypes['Sport'], ParentType, ContextType, RequireFields<QuerySportArgs, 'sportKey'>>;
  sports?: Resolver<Maybe<Array<ResolversTypes['SportSummary']>>, ParentType, ContextType>;
}>;

export type SelectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Selection'] = ResolversParentTypes['Selection']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  marketKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  marketUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  maxStake?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  minStake?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  outcome?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  params?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  probability?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  side?: Resolver<ResolversTypes['Side'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SelectionStatus'], ParentType, ContextType>;
}>;

export type SportResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Sport'] = ResolversParentTypes['Sport']> = ResolversObject<{
  categories?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
  competitionCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  eventCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type SportSummaryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SportSummary'] = ResolversParentTypes['SportSummary']> = ResolversObject<{
  categories?: Resolver<Maybe<Array<ResolversTypes['CategorySummary']>>, ParentType, ContextType>;
  competitionCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  eventCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type SubmarketResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Submarket'] = ResolversParentTypes['Submarket']> = ResolversObject<{
  selections?: Resolver<Maybe<Array<ResolversTypes['Selection']>>, ParentType, ContextType>;
  sequence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  submarketKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type TeamIdentifierResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TeamIdentifier'] = ResolversParentTypes['TeamIdentifier']> = ResolversObject<{
  abbreviation?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nationality?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AccountBalance?: AccountBalanceResolvers<ContextType>;
  AccountInfo?: AccountInfoResolvers<ContextType>;
  Bet?: BetResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  CategorySummary?: CategorySummaryResolvers<ContextType>;
  Competition?: CompetitionResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Event?: EventResolvers<ContextType>;
  EventMetadata?: EventMetadataResolvers<ContextType>;
  Identifier?: IdentifierResolvers<ContextType>;
  Market?: MarketResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OutcomeProbability?: OutcomeProbabilityResolvers<ContextType>;
  PlaceBetResult?: PlaceBetResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Selection?: SelectionResolvers<ContextType>;
  Sport?: SportResolvers<ContextType>;
  SportSummary?: SportSummaryResolvers<ContextType>;
  Submarket?: SubmarketResolvers<ContextType>;
  TeamIdentifier?: TeamIdentifierResolvers<ContextType>;
}>;

