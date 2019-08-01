import { createClient } from '../../../../src/client/client';
import { requestJsonInterceptor } from '../../../../src/interceptors/requestInterceptors/requestJsonInterceptor';

describe('RequestJsonIntercepotr test', () => {
  const client = createClient({});
  it('defaults to json if content type not provided', async () => {
    const action = {
      body: { user: 'User Name' },
    };

    const resp = await requestJsonInterceptor(client)(action);

    expect(resp).toEqual({
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(action.body),
    });
  });

  it('do not change content type if provided', async () => {
    const action = {
      headers: { 'Content-Type': 'plain/text' },
      body: 'User Name',
    };

    const resp = await requestJsonInterceptor(client)(action);

    expect(resp).toEqual({
      headers: action.headers,
      body: action.body,
    });
  });

  it('handle request without body', async () => {
    const resp = await requestJsonInterceptor(client)({});

    expect(resp).toEqual({
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  });
});
