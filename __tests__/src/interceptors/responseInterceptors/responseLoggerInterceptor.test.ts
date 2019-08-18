import { createClient } from '../../../../src/client/client';
import { responseLoggerInterceptor } from '../../../../src/interceptors/responseInterceptors/responseLoggerInterceptor';

describe('ResponseLoggerInterceptor test', () => {
  const client = createClient({});

  it('defaults to json if content type not provided', async () => {
    const action = {
      body: { user: 'User Name' },
    };

    const logger = jest.fn();

    const response ={
      error: false,
    }

    await responseLoggerInterceptor(logger)(client)(action, response);

    expect(logger).toHaveBeenCalledWith({action, response});
  });
});
