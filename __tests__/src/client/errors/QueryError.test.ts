import { QueryError } from '../../../../src/client/errors/QueryError';
import { QueryResponse } from '../../../../src/client/client.types';

describe('QueryError test', () => {
  it('responses with queryResponse object on success fetch', async () => {
    const queryResponse:QueryResponse = {
      error:false,
    };
    
    const error = new QueryError('test', queryResponse);

    expect(error.message).toEqual('test');
    expect(error.response).toEqual(queryResponse);
  });
});