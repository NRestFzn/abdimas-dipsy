import { EducationDto } from '../education/dto'
import { MarriageStatusDto } from '../marriageStatus/dto'
import { RukunTetanggaDto } from '../rukunTetangga/dto'
import { RukunWargaDto } from '../rukunWarga/dto'
import { SalaryRangeDto } from '../salaryRange/dto'

export interface ResidentDto {
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

export interface ResidentDetailDto extends ResidentDto {
  userDetail: {
    profession: string
    nik: string
    phoneNumber: string
    UserId: string
    RukunWargaId: string
    RukunTetanggaId: string
    MarriageStatusId: string
    EducationId: string
    SalaryRangeId: string
    rukunWarga: RukunWargaDto
    rukunTetangga: RukunTetanggaDto
    marriageStatus: MarriageStatusDto
    education: EducationDto
    salaryRange: SalaryRangeDto
  }
}

export interface CreateResidentDto {
  fullname: string
  nik: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  gender: string
  profession: string
  RukunWargaId: string
  RukunTetanggaId: string
  MarriageStatusId: string
  EducationId: string
  SalaryRangeId: string
}

export interface UpdateResidentDto {
  fullname: string
  nik: string
  email: string
  phoneNumber: string
  password?: string | null
  confirmPassword?: string | null
  gender: string
  profession: string
  RukunWargaId: string
  RukunTetanggaId: string
  MarriageStatusId: string
  EducationId: string
  SalaryRangeId: string
}

export interface ResidentQueryFilterDto {
  RoleId: string
  fullname: string
}

export interface ResidentDetailQueryFilterDto {
  RukunWargaId: string
  RukunTetanggaId: string
  nik: string
}

export interface UpdateProfileDto {
  phoneNumber: string
  newPassword?: string
  confirmNewPassword?: string
  profession: string
  EducationId: string
  SalaryRangeId: string
}
