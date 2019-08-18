import { Logger, LoggerOptions, Logs } from './logger.types';

const defaultOptions = {
  collapse: true,
  show: true,
};

const formatTitle = (logs: Logs) => {
  const { action, response } = logs;

  const actionType = action.id || action.endpoint;
  const titleName = response ? 'Response' : 'Request';
  const titleCSS = [`color: ${response && response.error ? 'red' : 'gray'}`, 'color: gray; font-weight: normal'];

  const title = [`%c ${titleName} %c ${actionType}`, ...titleCSS];
  const simpleTitle = `${titleName} ${actionType}`;

  return { title, simpleTitle };
};

export const createLogger = (options?: LoggerOptions): Logger => logs => {
  const loggerOptions = { ...defaultOptions, ...options };

  if (loggerOptions.show) {
    const { title, simpleTitle } = formatTitle(logs);

    try {
      if (loggerOptions.collapse) {
        console.groupCollapsed(...title);
      } else {
        console.group(...title);
      }
    } catch (e) {
      console.log(simpleTitle);
    }

    (Object.keys(logs) as Array<keyof Logs>).forEach(key => {
      console.log(`%c ${key}`, 'font-weight: bold', logs[key]);
    });

    try {
      console.groupEnd();
    } catch (e) {
      console.log('-- END --');
    }
  }
};
