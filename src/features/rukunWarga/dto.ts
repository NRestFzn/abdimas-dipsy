import { RukunTetanggaDto } from '../rukunTetangga/dto'

export interface RukunWargaDto {
  id: string
  name: number
  createdAt: Date
  updatedAt: Date
}

export interface RukunWargaDetailDto extends RukunWargaDto {
  rukunTetangga: Array<RukunTetanggaDto>
}

export interface CreateRukunWargaDto {
  name: number
}

export interface UpdateRukunWargaDto {
  name: number
}

export interface RukunWargaQueryFilterDto {
  name: number
}
