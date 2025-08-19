import { RukunTetanggaDto } from '../rukunTetangga/dto'

export interface RukunWargaDto {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface RukunWargaDetailDto extends RukunWargaDto {
  rukunTetangga: Array<RukunTetanggaDto>
}

export interface CreateRukunWargaDto {
  name: string
}

export interface UpdateRukunWargaDto {
  name: string
}

export interface RukunWargaQueryFilterDto {
  name: string
}
