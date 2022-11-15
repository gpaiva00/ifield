import { WEEK_DAYS } from '@common/datesNames'
import { getHoursPerDay } from '@repositories/Dates'
import { TableDetailsProps, TableProps, TableType } from '@typings/Table'
import generateID from '@utils/generateID'
import { CURRENT_MONTH_NAME } from '@utils/getCurrentMonth'

const generateManualTable = async (): Promise<TableProps> => {
  const table: TableProps = {
    id: generateID(),
    month: CURRENT_MONTH_NAME,
    year: new Date().getFullYear().toString(),
    type: TableType.MANUAL,
    details: [],
    createdAt: new Date().toISOString(),
  }

  const details: TableDetailsProps[] = []

  const hoursPerDay = await getHoursPerDay()

  for (const hourPerDay of hoursPerDay) {
    const date = new Date()

    const weekDayIndex = WEEK_DAYS.indexOf(hourPerDay.day) + 1
    date.setDate(date.getDate() + (weekDayIndex - date.getDay()))

    const detail: TableDetailsProps = {
      id: generateID(),
      date: date.toLocaleDateString(),
      user: null,
      hour: hourPerDay.hour,
      weekDay: hourPerDay.day,
    }

    details.push(detail)
  }

  table.details = details

  return table
}

export default generateManualTable
