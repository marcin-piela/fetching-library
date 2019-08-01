import fetchMock from 'fetch-mock';

import { createClient } from '../../../../src/client/client';
import { responseJsonInterceptor } from '../../../../src/interceptors/responseInterceptors/responseJsonInterceptor';

describe('ResponseJsonIntercepotr test', () => {
  const client = createClient({});

  it('responses correctly if Resonse stream has already been readed', async () => {
    const action = {
      endpoint: 'endpoint',
      method: 'GET',
    };

    const responseInit = {
      error: false,
      response: 'User Name',
    };

    const queryResponse = await responseJsonInterceptor(client)(action, responseInit);

    expect(queryResponse).toEqual({
      error: false,
      response: 'User Name',
    });
  });

  it('modifys response correctly for json API response', async () => {
    fetchMock.get('http://example.com/json', {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: { user: 'User Name' },
    });

    const res = await fetch('http://example.com/json');

    const responseInit = {
      error: false,
      response: res,
    };

    const queryResponse = await responseJsonInterceptor(client)({}, responseInit);
    expect(queryResponse).toEqual({
      error: false,
      response: { user: 'User Name' },
    });
  });

  it('modifys response correctly for empty API response', async () => {
    fetchMock.get('http://example.com/204', { status: 204 });

    const res = await fetch('http://example.com/204');

    const responseInit = {
      error: false,
      response: res,
    };

    const queryResponse = await responseJsonInterceptor(client)({}, responseInit);
    expect(queryResponse).toEqual({
      error: false,
      response: '',
    });
  });

  it('responses correctly for other response', async () => {
    fetchMock.get('http://example.com/text', {
      headers: { 'Content-Type': 'text/plain' },
      body: 'User Name',
    });

    const res = await fetch('http://example.com/text');

    const responseInit = {
      error: false,
      response: res,
    };

    const queryResponse = await responseJsonInterceptor(client)({}, responseInit);

    expect(queryResponse).toEqual({
      error: false,
      response: res,
    });
  });
});
