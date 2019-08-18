import { Logger } from "../../logger/logger.types";
import { RequestInterceptor } from "../../client/client.types";

export const requestLoggerInterceptor: (logger: Logger) => RequestInterceptor = logger => client => async action => {
  logger({ action });

  return action;
};