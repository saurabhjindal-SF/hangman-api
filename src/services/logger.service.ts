import {BindingScope, injectable} from '@loopback/core';
import {TransformableInfo} from 'logform';
import winston, {createLogger, format, transports} from 'winston';

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}

interface LogMessage {
  key?: string;
  message: string;
  level: number;
  timestamp?: Date;
}

@injectable({scope: BindingScope.TRANSIENT})
export class LoggerService {
  logger: winston.Logger;

  log(info: LogMessage): void {
    switch (Number(info.level)) {
      case LogLevel.INFO:
        this.info(info.message, info.key);
        break;
      case LogLevel.WARN:
        this.warn(info.message, info.key);
        break;
      case LogLevel.ERROR:
        this.error(info.message, info.key);
        break;
      case LogLevel.DEBUG:
        this.debug(info.message, info.key);
        break;
    }
  }
  info(message: string, key = 'App_Log'): void {
    this.logger.info(`${key} -> ${message}`);
  }
  warn(message: string, key = 'App_Log'): void {
    this.logger.warn(`${key} -> ${message}`);
  }
  error(message: string, key = 'App_Log'): void {
    this.logger.error(`${key} -> ${message}`);
  }
  debug(message: string, key = 'App_Log'): void {
    this.logger.debug(`${key} -> ${message}`);
  }

  constructor() {
    const logFormat = format.combine(
      format.timestamp(),
      format.printf(
        (log: TransformableInfo) =>
          `[${log.timestamp}] ${log.level} :: ${log.message}`,
      ),
    );

    this.logger = createLogger({
      transports: [new transports.Console()],
      format: logFormat,
      level: process.env.LOG_LEVEL ?? LogLevel[LogLevel.ERROR].toLowerCase(),
    });
  }
}
