import { createLogger } from '../../../src/logger/logger';

import { Action, QueryResponse } from '../../../src/client/client.types';

describe('Logger test', () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.groupCollapsed = jest.fn();
    console.group = jest.fn();
    console.groupEnd = jest.fn();
  });

  it('logs request with default options', () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users',
    };

    const logger = createLogger({});
    logger({ action });

    expect(console.groupCollapsed).toHaveBeenCalledTimes(1);
    expect(console.group).not.toBeCalled();
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.groupEnd).toHaveBeenCalledTimes(1);

    expect(console.groupCollapsed).toHaveBeenCalledWith(
      '%c Request %c http://example.com/users',
      'color: gray',
      'color: gray; font-weight: normal',
    );
    expect(console.log).toHaveBeenCalledWith('%c action', 'font-weight: bold', action);
  });

  it('logs response with custom options', () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users',
    };

    const response: QueryResponse = {
      status: 200,
      error: false,
      response: [{ id: 1 }, { id: 2 }],
    };

    const logger = createLogger({ collapse: false });
    logger({ action, response });

    expect(console.groupCollapsed).not.toBeCalled();
    expect(console.group).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.groupEnd).toHaveBeenCalledTimes(1);

    expect(console.group).toHaveBeenCalledWith(
      '%c Response %c http://example.com/users',
      'color: gray',
      'color: gray; font-weight: normal',
    );
    expect(console.log).toHaveBeenNthCalledWith(1, '%c action', 'font-weight: bold', action);
    expect(console.log).toHaveBeenNthCalledWith(2, '%c response', 'font-weight: bold', response);
  });

  it('logs response with failed response', () => {
    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users',
    };

    const response: QueryResponse = {
      status: 401,
      error: true,
    };

    const logger = createLogger({ collapse: false });
    logger({ action, response });

    expect(console.groupCollapsed).not.toBeCalled();
    expect(console.group).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.groupEnd).toHaveBeenCalledTimes(1);

    expect(console.group).toHaveBeenCalledWith(
      '%c Response %c http://example.com/users',
      'color: red',
      'color: gray; font-weight: normal',
    );
    expect(console.log).toHaveBeenNthCalledWith(1, '%c action', 'font-weight: bold', action);
    expect(console.log).toHaveBeenNthCalledWith(2, '%c response', 'font-weight: bold', response);
  });

  it('defaults to log method if group not supported', () => {
    console.groupCollapsed = jest.fn(() => {
      throw Error;
    });
    console.groupEnd = jest.fn(() => {
      throw Error;
    });

    const action: Action = {
      method: 'GET',
      endpoint: 'http://example.com/users',
    };

    const logger = createLogger({});
    logger({ action });

    expect(console.log).toHaveBeenCalledTimes(3);

    expect(console.log).toHaveBeenNthCalledWith(1, 'Request http://example.com/users');
    expect(console.log).toHaveBeenNthCalledWith(2, '%c action', 'font-weight: bold', action);
    expect(console.log).toHaveBeenNthCalledWith(3, '-- END --');
  });
});
