import 'dotenv/config'
import {generateNewsletter} from '../src/lib/newsletter/generateNewsletter.js'

async function run() {
  console.log('Generating newsletter')
  const result = await generateNewsletter()

  if (result.success) {
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
