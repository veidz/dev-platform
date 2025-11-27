const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 15 * 60,
  REFRESH_TOKEN: 7 * 24 * 60 * 60,
  RESET_PASSWORD: 60 * 60,
  EMAIL_VERIFICATION: 24 * 60 * 60,
} as const

const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: false,
} as const

const OAUTH_PROVIDERS = ['google', 'github', 'microsoft', 'gitlab'] as const

const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: 'dev_platform_access_token',
  REFRESH_TOKEN: 'dev_platform_refresh_token',
} as const

export {
  AUTH_COOKIE_NAMES,
  OAUTH_PROVIDERS,
  PASSWORD_REQUIREMENTS,
  TOKEN_EXPIRY,
}

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]
