export interface UserDto {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserDto {
  name: string
}

export interface UpdateUserDto {
  name: string
}

export interface UserQueryFilterDto {
  name: string
}

export type UserLoginState = {
  uid: string
}
