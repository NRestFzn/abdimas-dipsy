import crypto from 'crypto'
import { env } from '../config/env.config'

const ENCRYPTION_KEY = env.CRYPTO_ENCRYPTION_KEY || ''
const IV_LENGTH = 16

export class Encryption {
  static encrypt(text: string): string {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
      throw new Error('ENCRYPTION_KEY harus 32 karakter!')
    }

    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv
    )

    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    return iv.toString('hex') + ':' + encrypted.toString('hex')
  }

  static decrypt(text: string): string {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
      throw new Error('ENCRYPTION_KEY error!')
    }

    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift() as string, 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv
    )

    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString()
  }

  static hashIndex(text: string): string {
    return crypto
      .createHmac('sha256', env.BLIND_INDEX_KEY)
      .update(text)
      .digest('hex')
  }
}
