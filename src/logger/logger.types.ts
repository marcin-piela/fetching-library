import { Action, QueryResponse } from '../client/client.types';

export type LoggerOptions = {
  collapse?: boolean;
  show?: boolean;
};

export type Logs = {
  action: Action;
  response?: QueryResponse;
};

export type Logger = (logs: Logs) => void;
