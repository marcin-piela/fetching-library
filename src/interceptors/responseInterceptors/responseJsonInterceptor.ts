import { ResponseInterceptor } from '../../client/client.types';

const emptyCodes = [204, 205];

export const responseJsonInterceptor: ResponseInterceptor = client => async (action, queryResponse) => {
  const { payload: response } = queryResponse;

  if (response && response.constructor.name === 'Response') {
    const contentType = response.headers.get('Content-Type');

    const isEmpty = emptyCodes.includes(response.status);
    const isJSON = !isEmpty && contentType && contentType.includes('json');

    return {
      ...queryResponse,
      payload: isJSON ? await response.json() : isEmpty ? await response.text() : response,
    };
  }

  return queryResponse;
};
