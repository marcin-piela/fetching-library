import { ResponseInterceptor } from '../../client/client.types';

export const responseTextInterceptor: ResponseInterceptor = client => async (action, queryResponse) => {
  const { payload: response } = queryResponse;

  if (response && response.constructor.name === 'Response') {
    return {
      ...queryResponse,
      payload: await response.text(),
    };
  }

  return queryResponse;
};
