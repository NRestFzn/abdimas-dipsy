export interface UserDto {
  id: string
  fullname: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserDto {
  fullname: string
  email: string
  password: string
  RoleId: string
  gender: string
  birthDate: string
  RukunWargaId: string
  RukunTetanggaId: string
  MarriageStatusId: string
  EducationId: string
  SalaryRangeId: string
}

export interface UpdateUserDto {
  fullname: string
}

export interface UserQueryFilterDto {
  fullname: string
}

export type UserLoginState = {
  uid: string
}
