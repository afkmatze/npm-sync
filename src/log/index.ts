export * from './log'
export * from './color'
import { createLogger, Config } from 'teelogger'

const config:Config.ILoggerConfig = {
  label: 'npm-sync',
  labelStyles: [ 1, 36 ],
  time: true
} 

export const logger = createLogger(config)
export default logger