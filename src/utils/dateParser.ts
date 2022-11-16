import { format } from 'date-fns'

/**
 * 
 * @param dateString
 * @example 11/11/2020
 */
export const stringToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/')
  const date = new Date(`${year}-${month}-${day}`)
  date.setDate(date.getDate() + 1)
  return date
}

export const defaultDateFormat = (date: Date): string => format(date, 'dd/MM/yyyy')
