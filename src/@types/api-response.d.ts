export interface iUser {
  id: number
  name: string
  email: string
}

export interface iUserResponse {
  user: iUser
  token: string
}

export interface iSignup {
  name: string
  email: string
  password: string
}
