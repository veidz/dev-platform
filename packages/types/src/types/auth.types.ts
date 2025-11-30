export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  name: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface JwtPayload {
  sub: string
  email: string
  name: string
  iat: number
  exp: number
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  password: string
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}
