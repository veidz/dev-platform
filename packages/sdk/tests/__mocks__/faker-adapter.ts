import {
  rand,
  randAlphaNumeric,
  randCompanyName,
  randEmail,
  randFullName,
  randNumber,
  randPassword,
  randPastDate,
  randPhrase,
  randProductName,
  randRecentDate,
  randUrl,
  randUuid,
  randWord,
} from '@ngneat/falso'

const faker = {
  string: {
    uuid: () => randUuid(),
    alphanumeric: (length: number) => randAlphaNumeric({ length }).join(''),
  },
  internet: {
    email: () => randEmail(),
    url: () => randUrl(),
    password: () => randPassword(),
    httpStatusCode: ({ types }: { types?: string[] } = {}) => {
      if (types?.includes('clientError')) {
        return rand([400, 401, 403, 404, 422, 429])
      }
      if (types?.includes('serverError')) {
        return rand([500, 502, 503, 504])
      }
      return randNumber({ min: 200, max: 599 })
    },
  },
  person: {
    fullName: () => randFullName(),
  },
  lorem: {
    sentence: () => randPhrase(),
    word: () => randWord(),
  },
  date: {
    past: () => randPastDate(),
    recent: () => randRecentDate(),
  },
  number: {
    int: ({ min, max }: { min: number; max: number }) =>
      randNumber({ min, max }),
  },
  company: {
    name: () => randCompanyName(),
  },
  helpers: {
    slugify: (text: string) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    },
  },
  commerce: {
    productName: () => randProductName(),
  },
  system: {
    semver: () => {
      const major = randNumber({ min: 0, max: 9 })
      const minor = randNumber({ min: 0, max: 99 })
      const patch = randNumber({ min: 0, max: 99 })
      return `${major}.${minor}.${patch}`
    },
  },
}

export { faker }
