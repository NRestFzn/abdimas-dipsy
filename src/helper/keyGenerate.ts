import { green, red, yellow } from 'colorette'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

try {
  const newSecret = crypto.randomBytes(32).toString('base64')
  const newEnvVariable = `JWT_SECRET=${newSecret}`
  const envFilePath = path.join(__dirname, '/../../.env')

  let lines: string[] = []
  if (fs.existsSync(envFilePath)) {
    lines = fs.readFileSync(envFilePath, 'utf8').split('\n')
  }

  const secretIndex = lines.findIndex((line) => line.startsWith('JWT_SECRET='))

  if (secretIndex !== -1) {
    lines[secretIndex] = newEnvVariable
  } else {
    lines.push(newEnvVariable)
  }

  fs.writeFileSync(envFilePath, lines.join('\n'))

  console.log(green('JWT secret key generated successfully'))
} catch (error: any) {
  console.error(`${red('Error')} : ${yellow(error)}`)
}
