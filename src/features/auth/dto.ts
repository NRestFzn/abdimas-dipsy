export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  fullname: string
  email: string
  password: string
  profession: string
  nik: string
  birthDate: Date
  RukunWargaId: string
  RukunTetanggaId: string
  MarriageStatusId: string
  EducationId: string
  SalaryRangeId: string
  RoleId: string
}

export interface AuthResponseDto {
  fullname: string
  email: string
  uid: string
  accessToken: string
  expiresAt: Date
  expiresIn: number
}
