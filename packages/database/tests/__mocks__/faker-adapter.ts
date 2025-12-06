import {
  rand,
  randAlphaNumeric,
  randBoolean,
  randCompanyName,
  randEmail,
  randFullName,
  randFutureDate,
  randNumber,
  randPastDate,
  randPhrase,
  randRecentDate,
  randUrl,
  randUuid,
  randWord,
} from '@ngneat/falso'

const faker = {
  string: {
    uuid: () => randUuid(),
    alphanumeric: (length: number) => randAlphaNumeric({ length }).join(''),
    nanoid: () => randAlphaNumeric({ length: 21 }).join(''),
  },
  internet: {
    email: () => randEmail(),
    url: () => randUrl(),
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
    text: () => randPhrase(),
    paragraph: () => [randPhrase(), randPhrase(), randPhrase()].join(' '),
  },
  date: {
    past: () => randPastDate(),
    recent: () => randRecentDate(),
    future: () => randFutureDate(),
  },
  number: {
    int: (options?: { min?: number; max?: number }) =>
      randNumber({ min: options?.min ?? 0, max: options?.max ?? 1000 }),
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
    arrayElement: <T>(array: T[]): T => rand(array),
  },
  datatype: {
    boolean: () => randBoolean(),
  },
}

export { faker }
