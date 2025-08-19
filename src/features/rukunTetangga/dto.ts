import { RukunWargaDto } from '../rukunWarga/dto'

export interface RukunTetanggaDto {
  id: string
  name: string
  RukunWargaId: string
  createdAt: Date
  updatedAt: Date
}

export interface RukunTetanggaDetailDto extends RukunTetanggaDto {
  rukunWarga: RukunWargaDto
}

export interface CreateRukunTetanggaDto {
  name: string
}

export interface UpdateRukunTetanggaDto {
  name: string
}

export interface RukunTetanggaQueryFilterDto {
  name: string
}
