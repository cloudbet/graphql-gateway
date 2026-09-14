import { ApolloServerPlugin } from '@apollo/server';

import { Context } from '../types/context';
import { serializeError } from '../utils/logger';
import { maskUrls } from '../utils/maskUrls';

export function requestLoggingPlugin(): ApolloServerPlugin<Context> {
  return {
    async requestDidStart({ contextValue }) {
      const startTime = Date.now();
      const requestLogger = contextValue.logger;

      return Promise.resolve({
        didEncounterErrors({ errors, request }) {
          requestLogger.error('graphql request errors', {
            operationName: request.operationName,
            errors: errors.map(serializeError),
          });

          return Promise.resolve();
        },
        willSendResponse({ request, response }) {
          const durationMs = Date.now() - startTime;
          const requestHttp = request.http;

          requestLogger.info('graphql request', {
            method: requestHttp?.method,
            host:
              requestHttp?.headers &&
              maskUrls(String(requestHttp.headers.get('host') ?? '')),
            operationName: request.operationName,
            status: response.http?.status,
            durationMs,
          });

          return Promise.resolve();
        },
      });
    },
  };
}
