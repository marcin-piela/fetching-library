import fetchMock from 'fetch-mock';

import { createClient } from '../../../src/client/client';
import { createCache } from '../../../src/cache/cache';
import { Action, QueryResponse } from '../../../src/client/client.types';
import { responseJsonInterceptor } from '../../../src/interceptors';

describe('Client test', () => {
  it('responses with Response object by default', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/default',
    };

    fetchMock.get(action.endpoint, {
      users: [],
    });

    const client = createClient({
      requestInterceptors: [],
      responseInterceptors: [],
    });

    const queryResponse: QueryResponse<Response> = await client.query(action);

    const payload = queryResponse.payload && (await queryResponse.payload.json());

    expect(payload).toEqual({ users: [] });
    expect(queryResponse.status).toEqual(200);
    expect(queryResponse.error).toEqual(false);
    queryResponse.headers && expect(queryResponse.headers.get('Content-Length')).toEqual('12');
  });

  it('responses with queryResponse object on success fetch', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users',
    };

    fetchMock.get(action.endpoint, {
      users: [],
    });

    const client = createClient();

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual({ users: [] });
    expect(queryResponse.status).toEqual(200);
    expect(queryResponse.error).toEqual(false);
    queryResponse.headers && expect(queryResponse.headers.get('Content-Length')).toEqual('12');
  });

  it('responses correctly for empty API response', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/204',
    };

    fetchMock.get(action.endpoint, { status: 204 });

    const client = createClient();

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual('');
    expect(queryResponse.status).toEqual(204);
    expect(queryResponse.error).toEqual(false);
  });

  it('responses with queryResponse object containing error flag true on failed fetch', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users/error',
    };

    fetchMock.get(action.endpoint, {
      throws: new TypeError('Failed to fetch'),
    });

    const client = createClient();

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual(undefined);
    expect(queryResponse.status).toEqual(undefined);
    expect(queryResponse.error).toEqual(true);
    queryResponse.headers && expect(queryResponse.headers.get('Content-Length')).toEqual('12');
  });

  it('intercepts response when responseInterceptor is configured', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users/response-interceptors',
    };

    fetchMock.get(action.endpoint, {
      data: {
        users: [],
      },
    });

    const responseInterceptor = () => async (action: Action, response: QueryResponse<any>) => {
      if (response.payload.data) {
        return {
          ...response,
          payload: response.payload.data,
        };
      }

      return response;
    };

    const client = createClient({
      responseInterceptors: [responseJsonInterceptor, responseInterceptor],
    });

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual({ users: [] });
  });

  it('intercepts request when requestInterceptor is configured', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'request-interceptors',
    };

    fetchMock.get('http://example.com/users/request-interceptors', {
      users: [],
    });

    const requestInterceptor = () => async (action: Action) => {
      return {
        ...action,
        endpoint: `http://example.com/users/${action.endpoint}`,
      };
    };

    const client = createClient({
      requestInterceptors: [requestInterceptor],
    });

    const queryResponse = await client.query(action);

    expect(queryResponse.payload).toEqual({ users: [] });
  });

  it('returns cached value on second fetch and non cached when skipCache flag is provided', async () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/cached-endpoint',
    };

    fetchMock.get(
      action.endpoint,
      {
        users: [],
      },
      { overwriteRoutes: true },
    );

    const cache = createCache<any>(
      action => {
        return true;
      },
      response => {
        return true;
      },
    );

    const client = createClient({
      cacheProvider: cache,
    });

    const queryResponse = await client.query(action);
    expect(queryResponse.payload).toEqual({ users: [] });

    fetchMock.get(
      action.endpoint,
      {
        users: [
          {
            uuid: 1,
          },
        ],
      },
      { overwriteRoutes: true },
    );

    const cachedQueryResponse = await client.query(action);
    expect(cachedQueryResponse.payload).toEqual({ users: [] });

    const nonCachedQueryResponse = await client.query(action, true);
    expect(nonCachedQueryResponse.payload).toEqual({ users: [
      {
        uuid: 1,
      },
    ], });
  });
});
