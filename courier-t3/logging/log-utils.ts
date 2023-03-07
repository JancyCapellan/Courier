import logLevelData from '../log-level'
import pino, { Logger } from 'pino'

const logLevels = new Map<string, string>(Object.entries(logLevelData))

export function getLogLevel(logger: string): string {
  return logLevels.get(logger) || logLevels.get('*') || 'info'
}

// not using log level data
export function getLogger(name: string): Logger {
  return pino({
    name,
    // level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    level: 'info',

    // browser: { asObject: true },
    // transport: {
    //   target: 'pino-pretty',
    //   options: {
    //     colorize: true,
    //   },
    // },
    // base: {
    //   env: process.env.NODE_ENV,

    //   // revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    // },
  })
}

// server side
// export const fileLogger = pino(
//   pino.destination({ dest: './logs.json', sync: false })
// )
