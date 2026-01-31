import 'dotenv/config'
import {generateBroadcast} from '../src/lib/newsletter/generateBroadcast.js'

async function run() {
  console.log('Generating broadcast')
  const result = await generateBroadcast()
  if (result.success) {
    console.log("Broadcast id:", result.broadcastId)
    console.log(result.message)
    process.exit(0)
  } else {
    console.error(result.message)
    process.exit(1)
  }
}

run().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
