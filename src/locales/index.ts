import en from './en'
import id from './id'

export const locales = {
  en,
  id,
}

export type SupportedLanguage = keyof typeof locales

export type Translation = typeof en

export const defaultLang: SupportedLanguage = 'en'
