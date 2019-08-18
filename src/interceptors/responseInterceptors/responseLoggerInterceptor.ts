import { Logger } from "../../logger/logger.types";
import { ResponseInterceptor } from "../../client/client.types";

export const responseLoggerInterceptor: (logger: Logger) => ResponseInterceptor = logger => client => async (
  action,
  response,
) => {
  logger({ action, response });

  return response;
};