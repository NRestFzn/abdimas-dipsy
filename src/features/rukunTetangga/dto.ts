import { RukunWargaDto } from '../rukunWarga/dto'

export interface RukunTetanggaDto {
  id: string
  name: number
  RukunWargaId: string
  createdAt: Date
  updatedAt: Date
}

export interface RukunTetanggaDetailDto extends RukunTetanggaDto {
  rukunWarga: RukunWargaDto
}

export interface CreateRukunTetanggaDto {
  name: number
}

export interface UpdateRukunTetanggaDto {
  name: number
}

export interface RukunTetanggaQueryFilterDto {
  name: number
}
