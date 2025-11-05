export interface UserDto {
  id: string
  fullname: string
  email: string
  RoleId: string
  gender: string
  birthDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserDetailDto extends UserDto {
  userDetail: {
    RukunWargaId: string
    RukunTetanggaId: string
    MarriageStatusId: string
    EducationId: string
    SalaryRangeId: string
    profession: string
    nik: string
  }
}

export interface CreateUserDto {
  fullname: string
  email: string
  password: string
  RoleId: string
  gender: string
  birthDate: Date
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
