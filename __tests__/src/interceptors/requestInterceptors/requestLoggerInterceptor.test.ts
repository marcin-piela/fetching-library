import { createClient } from '../../../../src/client/client';
import { requestLoggerInterceptor } from '../../../../src/interceptors/requestInterceptors/requestLoggerInterceptor';

describe('RequestLoggerInterceptor test', () => {
  const client = createClient({});

  it('defaults to json if content type not provided', async () => {
    const action = {
      body: { user: 'User Name' },
    };

    const logger = jest.fn();

    await requestLoggerInterceptor(logger)(client)(action);

    expect(logger).toHaveBeenCalledWith({action});
  });
});
