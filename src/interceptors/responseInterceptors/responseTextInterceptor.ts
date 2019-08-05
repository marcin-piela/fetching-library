import { ResponseInterceptor } from '../../client/client.types';

export const responseTextInterceptor: ResponseInterceptor = client => async (action, queryResponse) => {
  const { response } = queryResponse;

  if (response && response.constructor.name === 'Response') {
    return {
      ...queryResponse,
      response: await response.text(),
    };
  }

  return queryResponse;
};
