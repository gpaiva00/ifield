import { MONTHS } from '@common/datesNames'

export const CURRENT_MONTH_NAME = MONTHS[new Date().getMonth()]

export const CURRENT_MONTH_NUMBER = new Date().getMonth() + 1

export const getMonthNumber = (month: string): number => MONTHS.indexOf(month)
