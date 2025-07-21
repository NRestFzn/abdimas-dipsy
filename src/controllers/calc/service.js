import calcSchema from './schema'
import model from '../../database/models/index'
import ResponseError from '@modules/response/ResponseError'

const { WhoStandardChildGrow } = model

class CalcService {
  constructor() {}

  static calculateDailyNutrition(formData) {
    const data = calcSchema.dailyNutritionSchema.validateSync(formData)

    const ageInYears = data.ageUnit === 'month' ? data.age / 12 : data.age

    const basalEnergy = this._calculateBasalEnergy(
      data.weight,
      data.height,
      ageInYears,
      data.gender
    )

    const totalCalories = this._calculateTotalCalories(
      basalEnergy,
      data.activityLevel,
      ageInYears,
      data.gender
    )

    const macronutrients = this._calculateMacronutrients(
      totalCalories,
      ageInYears
    )

    const result = {
      kalori: Math.round(totalCalories),
      protein: Math.round(macronutrients.protein),
      karbohidrat: Math.round(macronutrients.karbohidrat),
      lemak: Math.round(macronutrients.lemak),
    }

    return result
  }

  static _calculateBasalEnergy(weight, height, ageInYears, gender) {
    if (ageInYears >= 19) {
      if (gender === 'M') {
        return 10 * weight + 6.25 * height - 5 * ageInYears + 5
      } else {
        return 10 * weight + 6.25 * height - 5 * ageInYears - 161
      }
    } else if (ageInYears >= 10) {
      if (gender === 'M') {
        return 17.5 * weight + 651
      } else {
        return 12.2 * weight + 746
      }
    } else if (ageInYears >= 3) {
      if (gender === 'M') {
        return 22.7 * weight + 495
      } else {
        return 22.5 * weight + 499
      }
    } else {
      if (gender === 'M') {
        return 60.9 * weight - 54
      } else {
        return 61.0 * weight - 51
      }
    }
  }

  static _calculateTotalCalories(
    basalEnergy,
    activityLevel,
    ageInYears,
    gender
  ) {
    let pal
    if (ageInYears >= 19) {
      switch (activityLevel) {
        case 'sedentary':
          pal = 1.2
          break
        case 'light':
          pal = 1.375
          break
        case 'moderate':
          pal = 1.55
          break
        case 'heavy':
          pal = 1.725
          break
        default:
          pal = 1.2
      }
    } else if (ageInYears >= 9) {
      if (gender === 'M') {
        if (activityLevel === 'heavy') pal = 2.1
        else if (activityLevel === 'moderate' || activityLevel === 'light')
          pal = 1.8
        else pal = 1.5
      } else {
        if (activityLevel === 'heavy') pal = 2.0
        else if (activityLevel === 'moderate' || activityLevel === 'light')
          pal = 1.7
        else pal = 1.4
      }
    } else {
      if (activityLevel === 'heavy' || activityLevel === 'moderate') pal = 1.6
      else pal = 1.4
    }
    return basalEnergy * pal
  }

  static _calculateMacronutrients(totalCalories, ageInYears) {
    let proteinPercent, fatPercent, carbPercent

    if (ageInYears >= 19) {
      proteinPercent = 0.2
      fatPercent = 0.3
      carbPercent = 0.5
    } else {
      proteinPercent = 0.15
      fatPercent = 0.3
      carbPercent = 0.55
    }

    const proteinGrams = (totalCalories * proteinPercent) / 4
    const fatGrams = (totalCalories * fatPercent) / 9
    const carbGrams = (totalCalories * carbPercent) / 4

    return {
      protein: proteinGrams,
      lemak: fatGrams,
      karbohidrat: carbGrams,
    }
  }

  static async checkChildGrow(formData) {
    const data = calcSchema.childGrowSchema.validateSync(formData)

    const ageInMonths = data.ageUnit === 'year' ? data.age * 12 : data.age

    const lms_wfa = await this._getLMSParameters(
      'wfa',
      ageInMonths,
      data.gender
    )

    const zScore_wfa = this._calculateZScore(
      data.weight,
      lms_wfa.L,
      lms_wfa.M,
      lms_wfa.S
    )
    const status_wfa = this._getNutritionStatus('wfa', zScore_wfa)

    const lms_hfa = await this._getLMSParameters(
      'hfa',
      ageInMonths,
      data.gender
    )
    const zScore_hfa = this._calculateZScore(
      data.height,
      lms_hfa.L,
      lms_hfa.M,
      lms_hfa.S
    )
    const status_hfa = this._getNutritionStatus('hfa', zScore_hfa)

    return {
      status_berat_badan: status_wfa,
      status_tinggi_badan: status_hfa,
    }
  }

  static async _getLMSParameters(indicator, ageInMonths, gender) {
    const roundedAge = Math.round(ageInMonths)

    const params = await WhoStandardChildGrow.findOne({
      where: {
        type: indicator,
        gender,
        month: roundedAge,
      },
      attributes: ['L', 'M', 'S'],
    })

    if (!params) {
      throw new ResponseError.NotFound('LMS Parameter not found')
    }

    return params
  }

  static _calculateZScore(value, L, M, S) {
    if (L === 0 || L === '0') {
      return Math.log(value / M) / S
    }
    const zScore = (Math.pow(value / M, L) - 1) / (L * S)
    return zScore
  }

  static _getNutritionStatus(indicator, zScore) {
    if (indicator === 'hfa') {
      if (zScore < -3) return 'Stunting Berat (Severely Stunted)'
      if (zScore < -2) return 'Stunting (Stunted)'
      return 'Normal'
    }

    if (indicator === 'wfa') {
      if (zScore < -3) return 'Berat Badan Sangat Kurang (Severely Underweight)'
      if (zScore < -2) return 'Berat Badan Kurang (Underweight)'
      return 'Normal'
    }

    return 'Indikator tidak dikenali'
  }
}

module.exports = CalcService
