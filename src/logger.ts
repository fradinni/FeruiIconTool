export enum LogLevel {
  DEBUG,
  INFO ,
  WARN,
  ERROR
}

export class Logger {

  logLevel: LogLevel = LogLevel.DEBUG;

  constructor(public console: any) {
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  debug = (...args: any[]) => {
    if (this.logLevel <= LogLevel.DEBUG) {
      this.console.debug(...args);
    }
  }

  log = (...args: any[]) => {
    if (this.logLevel <= LogLevel.DEBUG) {
      this.console.log(...args);
    }
  }

  info = (...args: any[]) => {
    if (this.logLevel <= LogLevel.INFO) {
      this.console.info(...args);
    }
  }

  warn = (...args: any[]) => {
    if (this.logLevel <= LogLevel.WARN) {
      this.console.warn(...args);
    }
  }

  error = (...args: any[]) => {
    if (this.logLevel <= LogLevel.ERROR) {
      this.console.error(...args);
    }
  }
}