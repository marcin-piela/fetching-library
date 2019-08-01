import { RequestInterceptor } from '../../client/client.types';

export const requestJsonInterceptor: RequestInterceptor = client => async action => {
  const headers = { ...{ 'Content-Type': 'application/json; charset=utf-8' }, ...action.headers };
  const shouldStringify = headers['Content-Type'].includes('json');

  const body = action.body ? (shouldStringify ? JSON.stringify(action.body) : action.body) : undefined;

  return {
    ...action,
    headers,
    ...(body && { body }),
  };
};
