export interface UserDto {
  id: string
  fullname: string
  email: string
  RoleId: string
  gender: string
  profilePicture?: string | null
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
  gender: string
  birthDate: Date
  newPassword?: string | null
  confirmNewPassword?: string | null
}

export interface UserQueryFilterDto {
  fullname: string
}

export type UserLoginState = {
  uid: string
}
