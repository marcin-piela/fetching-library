import { requestJsonInterceptor, responseJsonInterceptor, responseTextInterceptor } from '../interceptors';
import { Action, ClientOptions, QueryResponse, RequestInterceptor, ResponseInterceptor } from './client.types';

export type HandleRequestInterceptors<R> = (
  action: Action<R>,
  interceptors: Array<RequestInterceptor<R>>,
) => Promise<Action<R>>;

export type HandleResponseInterceptors<R> = (
  action: Action<R>,
  response: QueryResponse<any>,
  interceptors: Array<ResponseInterceptor<R, any>>,
) => Promise<QueryResponse<any>>;

export const createClient = <R = any>(clientOptions: ClientOptions<R>) => {
  const cache = clientOptions.cacheProvider;

  const handleRequestInterceptors: HandleRequestInterceptors<R> = async (action, interceptors) => {
    const [interceptor, ...next] = interceptors;

    return interceptor ? await handleRequestInterceptors(await interceptor(client)(action), next) : action;
  };

  const handleResponseInterceptors: HandleResponseInterceptors<R> = async (action, response, interceptors) => {
    const [interceptor, ...next] = interceptors;

    return interceptor
      ? await handleResponseInterceptors(action, await interceptor(client)(action, response), next)
      : response;
  };

  const client = {
    cache,
    query: async <T>(actionInit: Action<R>, skipCache = false): Promise<QueryResponse<T>> => {
      try {
        const action = await handleRequestInterceptors(
          actionInit,
          clientOptions.requestInterceptors || [requestJsonInterceptor],
        );
        const { endpoint, ...options } = action;

        if (cache && !skipCache) {
          const cachedResponse = cache.get(actionInit);

          if (cachedResponse) {
            return cachedResponse;
          }
        }

        const response = await fetch(endpoint, options);

        const queryResponse = await handleResponseInterceptors(
          action,
          {
            error: !response.ok,
            headers: response.headers,
            response,
            status: response.status,
          },
          clientOptions.responseInterceptors || [responseJsonInterceptor, responseTextInterceptor],
        );

        if (cache && response.ok) {
          cache.add(actionInit, queryResponse);
        }

        return queryResponse;
      } catch (error) {
        return {
          error: true,
          errorObject: error,
        };
      }
    },
  };

  return client;
};
