import { isValid } from 'date-fns'
import { validate as uuidValidate } from 'uuid'
import { ErrorResponse } from './http/ErrorResponse'
import _ from 'lodash'

const emptyValues = [null, undefined, '', 'null', 'undefined']
const invalidValues = [...emptyValues, false, 0, 'false', '0']

export class validate {
  private static isNumeric(value: any): boolean {
    return !_.isNaN(parseFloat(value)) && _.isFinite(value)
  }

  public static number(value: any) {
    if (this.isNumeric(Number(value))) {
      return Number(value)
    }

    return 0
  }

  public static empty(value: any): any {
    if (emptyValues.includes(value)) {
      return null
    }

    return value
  }

  public static boolean(value: any): boolean {
    if (invalidValues.includes(value)) {
      return false
    }

    return true
  }

  public static isDate(value: string | number | Date | null): boolean {
    if (value == null) {
      return false
    }

    const valueDate = value instanceof Date ? value : new Date(value)
    return isValid(valueDate)
  }

  public static uuid(value: string): string {
    if (!uuidValidate(value)) {
      throw new ErrorResponse.BadRequest('Invalid UUID')
    }

    return value
  }

  public static ms(value: string): number {
    const TIME_UNITS = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      w: 7 * 24 * 60 * 60 * 1000,
    }

    const type = value.slice(-1)
    const numericValue = parseInt(value.slice(0, -1), 10)

    if (isNaN(numericValue) || !(type in TIME_UNITS)) {
      throw new Error('Invalid time format')
    }

    // @ts-expect-error
    return numericValue * TIME_UNITS[type]
  }
}
