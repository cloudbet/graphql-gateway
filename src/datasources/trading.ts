import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';
import { GraphQLError } from 'graphql';
import { Logger } from 'winston';

import { serializeError } from '../utils/logger';

export enum AcceptPriceChange {
  None = 'NONE',
  // All = 'ALL',
  Better = 'BETTER',
}

export enum Side {
  Back = 'BACK',
  Lay = 'LAY',
}

export enum BetStatus {
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  DuplicateRequest = 'DUPLICATE_REQUEST',
  MalformedRequest = 'MALFORMED_REQUEST',
  PriceAboveMarket = 'PRICE_ABOVE_MARKET',
  InsufficientFunds = 'INSUFFICIENT_FUNDS',
  StakeAboveMax = 'STAKE_ABOVE_MAX',
  StakeBelowMin = 'STAKE_BELOW_MIN',
  LiabilityLimitExceeded = 'LIABILITY_LIMIT_EXCEEDED',
  MarketSuspended = 'MARKET_SUSPENDED',
  Accepted = 'ACCEPTED',
  PendingAcceptance = 'PENDING_ACCEPTANCE',
  Restricted = 'RESTRICTED',
  VerificationRequired = 'VERIFICATION_REQUIRED',
  Win = 'WIN',
  Loss = 'LOSS',
  Push = 'PUSH',
  HalfWin = 'HALF_WIN',
  HalfLoss = 'HALF_LOSS',
  Partial = 'PARTIAL',
}

export interface PlaceBetRequest {
  referenceId: string;
  eventId: string;
  marketUrl: string;
  currency: string;
  price: string;
  stake: string;
  side?: Side | null;
  acceptPriceChange?: AcceptPriceChange | null;
}

export interface BetResponse {
  referenceId: string;
  sportsKey: string;
  categoryKey: string;
  eventId: string;
  eventName: string;
  marketUrl: string;
  currency: string;
  price: string;
  stake: string;
  side: Side;
  returnAmount: string;
  status: BetStatus;
  error?: string;
}

function isBetResponse(body: unknown): body is BetResponse {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const response = body as Record<string, unknown>;

  return (
    typeof response.referenceId === 'string' &&
    typeof response.sportsKey === 'string' &&
    typeof response.categoryKey === 'string' &&
    typeof response.eventId === 'string' &&
    typeof response.eventName === 'string' &&
    typeof response.marketUrl === 'string' &&
    typeof response.currency === 'string' &&
    typeof response.price === 'string' &&
    typeof response.stake === 'string' &&
    typeof response.side === 'string' &&
    typeof response.returnAmount === 'string' &&
    typeof response.status === 'string'
  );
}

export interface BetHistoryResponse {
  bets: Array<BetResponse>;
  totalBets: number;
}

export interface GetBetsRequest {
  limit?: number | null;
  offset?: number | null;
}

export interface ITradingAPIDataSource {
  placeBet: (request: PlaceBetRequest) => Promise<BetResponse>;
  getBet: (referenceId: string) => Promise<BetResponse>;
  getBets: (request?: GetBetsRequest) => Promise<BetHistoryResponse>;
}

export class TradingAPI
  extends RESTDataSource
  implements ITradingAPIDataSource
{
  private headersToProxy: Map<string, string>;
  private requestLogger: Logger;

  constructor(options: {
    baseURL: string;
    headersToProxy: Map<string, string>;
    logger: Logger;
  }) {
    super();

    this.baseURL = options.baseURL;
    this.headersToProxy = options.headersToProxy;
    this.requestLogger = options.logger;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    for (const [key, value] of this.headersToProxy) {
      request.headers[key] = value;
    }
  }

  async placeBet(request: PlaceBetRequest): Promise<BetResponse> {
    try {
      const resp = await this.post<BetResponse>('/pub/v3/bets/place', {
        body: request,
      });

      return resp;
    } catch (err) {
      // non 2XX http status code
      if (err instanceof GraphQLError) {
        const response = err.extensions['response'] as {
          [key: string]: unknown;
        };

        // do not return graphql error given the response body is in the format of bet response
        if (isBetResponse(response.body)) {
          this.requestLogger.warn(
            'placed bet returned GraphQL error response',
            {
              error: serializeError(err),
            },
          );

          return response.body;
        }
      }

      throw err;
    }
  }

  async getBet(referenceId: string): Promise<BetResponse> {
    return this.get(`/pub/v3/bets/${referenceId}/status`);
  }

  async getBets(request?: GetBetsRequest): Promise<BetHistoryResponse> {
    const searchParams = new URLSearchParams();
    if (request?.limit) {
      searchParams.append('limit', request?.limit.toString());
    }
    if (request?.offset) {
      searchParams.append('offset', request?.offset.toString());
    }

    return this.get('/pub/v4/bets/history', { params: searchParams });
  }
}
