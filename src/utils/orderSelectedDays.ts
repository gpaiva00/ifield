import { WEEK_DAYS } from '@common/datesNames'

const orderSelectedDays = (days: string[]) =>
  WEEK_DAYS.filter(day => days.includes(day))

export default orderSelectedDays
