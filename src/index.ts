import { once } from 'events';
import { readFileSync } from 'fs';
import http, { IncomingHttpHeaders } from 'http';
import path from 'path';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@as-integrations/express5';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import DataLoader from 'dataloader';
import dotenv from 'dotenv';
import express, { Request } from 'express';
import {
  DateTypeDefinition,
  DateResolver,
  DateTimeTypeDefinition,
  DateTimeResolver,
} from 'graphql-scalars';

import { AccountAPI } from './datasources/account';
import {
  FeedAPI,
  EventResponse,
  SportWithCategoryResponse,
  SportsResponse,
} from './datasources/feed';
import { TradingAPI } from './datasources/trading';
import { Resolvers } from './generated/types';
import { requestLoggingPlugin } from './plugins/requestLogging';
import { registerProbes } from './probes';
import { categoryResolvers } from './resolvers/category';
import { eventResolvers } from './resolvers/event';
import { mutationResolvers } from './resolvers/mutation';
import { queryResolvers } from './resolvers/query';
import { sportResolvers, sportsSummaryResolvers } from './resolvers/sport';
import { Context } from './types/context';
import { createRequestLogger } from './utils/logger';
import { maskUrls } from './utils/maskUrls';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
  quiet: true,
});

const gqlSchema = readFileSync(
  path.resolve(__dirname, './schema.graphql'),
  'utf-8',
);

const sportsAPIBaseURL =
  process.env['SPORTS_API_HOSTNAME'] || 'https://sports-api.cloudbet.com';
const accountAPIBaseURL =
  process.env['ACCOUNT_HOSTNAME'] || 'https://sports-api.cloudbet.com';
const tradingBaseURL =
  process.env['TRADING_HOSTNAME'] || 'https://sports-api.cloudbet.com';
const port = process.env['PORT'] || '3000';
const enableMockServer = process.env['ENABLE_MOCK_SERVER'] === 'true' || false;

void (async () => {
  const typeDefs = [gqlSchema, DateTypeDefinition, DateTimeTypeDefinition];
  const resolvers: Resolvers = {
    Date: DateResolver,
    DateTime: DateTimeResolver,
    Query: queryResolvers,
    Mutation: mutationResolvers,
    Sport: sportResolvers,
    Category: categoryResolvers,
    Event: eventResolvers,
    SportSummary: sportsSummaryResolvers,
  };

  const app = express();
  const httpServer = http.createServer(app);

  let server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault(),
      requestLoggingPlugin(),
    ],
    introspection: true,
    formatError: (formattedError, _error) => {
      const maskedError = {
        ...formattedError,
        message: maskUrls(formattedError.message),
      };

      // do not internal info to client response
      let extensions;
      if (maskedError.extensions?.code && maskedError.extensions?.response) {
        const response = maskedError.extensions.response as {
          status?: number;
          statusText?: string;
          body?: string;
        };
        extensions = {
          code: maskedError.extensions?.code,
          response: {
            status: response.status,
            statusText: response.statusText,
            body: response.body ? maskUrls(response.body) : undefined,
          },
        };
      }

      return {
        message: maskedError.message,
        locations: maskedError.locations,
        path: maskedError.path,
        extensions: extensions,
      };
    },
  });

  if (enableMockServer) {
    server = new ApolloServer<Context>({
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault(),
      ],
      introspection: true,
      schema: addMocksToSchema({
        schema: makeExecutableSchema({ typeDefs, resolvers }),
      }),
    });
  }

  await server.start();
  registerProbes(app);

  app.use(express.json());
  const apolloMiddleware = expressMiddleware(server, {
    context: ({ req }: { req: Request }) => {
      const requestLogger = createRequestLogger();

      const headersToProxy = retrieveAllXHeaders(req.headers);
      const dataSources = {
        accountAPI: new AccountAPI({
          baseURL: accountAPIBaseURL,
          headersToProxy,
        }),
        tradingAPI: new TradingAPI({
          baseURL: tradingBaseURL,
          headersToProxy,
          logger: requestLogger,
        }),
        feedAPI: new FeedAPI({
          baseURL: sportsAPIBaseURL,
          headersToProxy,
        }),
      };

      const eventLoader = new DataLoader<string, EventResponse>(async (ids) => {
        return Promise.all(
          ids.map((id) => dataSources.feedAPI.getEvent({ id })),
        );
      });

      const sportLoader = new DataLoader<string, SportWithCategoryResponse>(
        async (keys) => {
          return Promise.all(
            keys.map((key) => dataSources.feedAPI.getSport(key)),
          );
        },
      );
      const sportsLoader = new DataLoader<string, SportsResponse>(async () => {
        return [await dataSources.feedAPI.getSports()];
      });

      return Promise.resolve({
        logger: requestLogger,
        headersToProxy,
        dataSources,
        eventLoader,
        sportLoader,
        sportsLoader,
      });
    },
  });

  app.use('/', cors<cors.CorsRequest>(), apolloMiddleware);

  const listening = once(httpServer, 'listening');
  const listeningError = (async () => {
    const [error] = await once(httpServer, 'error');
    throw error;
  })();
  httpServer.listen(Number(port));
  await Promise.race([listening, listeningError]);
})();

function retrieveAllXHeaders(
  headers: IncomingHttpHeaders,
): Map<string, string> {
  const prefix = 'x-';
  const headerMap = new Map<string, string>();
  for (const [key, value] of Object.entries(headers)) {
    if (!key.toLowerCase().startsWith(prefix.toLowerCase())) {
      continue;
    }

    if (Array.isArray(value)) {
      // Only keep the first value for arrays
      if (value.length > 0 && typeof value[0] === 'string') {
        headerMap.set(key, value[0]);
      }
    } else if (typeof value === 'string') {
      // If value is a string, set it directly
      headerMap.set(key, value);
    }
  }

  return headerMap;
}
