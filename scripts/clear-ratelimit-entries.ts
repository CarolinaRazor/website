import 'dotenv/config'
import {cleanupOldEntries} from '../src/lib/newsletter/rateLimiter.js'

async function run() {
  console.log('Cleaning stale ratelimiter entries')
  cleanupOldEntries()
  console.log("done!")
  process.exit(0)
}

run()

