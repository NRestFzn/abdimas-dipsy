import { green, red, yellow, cyan } from 'colorette'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

try {
  const envFilePath = path.join(__dirname, '/../../.env')

  let lines: string[] = []
  if (fs.existsSync(envFilePath)) {
    lines = fs.readFileSync(envFilePath, 'utf8').split('\n')
  }

  const setEnvValue = (key: string, value: string) => {
    const index = lines.findIndex((line) => line.startsWith(`${key}=`))
    const newEntry = `${key}=${value}`

    if (index !== -1) {
      lines[index] = newEntry
    } else {
      lines.push(newEntry)
    }
  }

  const newJwtSecret = crypto.randomBytes(32).toString('base64')
  setEnvValue('JWT_SECRET', newJwtSecret)
  console.log(green('JWT_SECRET generated successfully'))

  const newEncryptionKey = crypto.randomBytes(16).toString('hex')
  setEnvValue('CRYPTO_ENCRYPTION_KEY', newEncryptionKey)
  console.log(cyan(`CRYPTO_ENCRYPTION_KEY generated successfully (32 chars)`))

  const newBlindIndexKey = crypto.randomBytes(32).toString('hex')
  setEnvValue('BLIND_INDEX_KEY', newBlindIndexKey)
  console.log(cyan(`BLIND_INDEX_KEY generated successfully (64 chars)`))

  fs.writeFileSync(envFilePath, lines.join('\n'))
} catch (error: any) {
  console.error(`${red('Error')} : ${yellow(error)}`)
}
