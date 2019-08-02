import fetchMock from 'fetch-mock';

import { createClient } from '../../../../src/client/client';
import { responseTextInterceptor } from '../../../../src/interceptors/responseInterceptors/responseTextInterceptor';

describe('ResponseTextInterceptor test', () => {
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

    const queryResponse = await responseTextInterceptor(client)(action, responseInit);

    expect(queryResponse).toEqual({
      error: false,
      response: 'User Name',
    });
  });

  it('resloves promise with text for json API response', async () => {
    fetchMock.get('http://example.com/text', {
      body: 'User Name',
    });

    const res = await fetch('http://example.com/text');

    const responseInit = {
      error: false,
      response: res,
    };

    const queryResponse = await responseTextInterceptor(client)({}, responseInit);
    expect(queryResponse).toEqual({
      error: false,
      response: 'User Name',
    });
  });
});
