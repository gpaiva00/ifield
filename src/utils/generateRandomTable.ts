import { WEEK_DAYS } from '@common/datesNames'
import { getHoursPerDay } from '@repositories/Dates'
import { getUsers } from '@repositories/Users'
import { TableDetailsProps, TableProps, TableType } from '@typings/Table'
import generateID from '@utils/generateID'
import { CURRENT_MONTH_NAME } from '@utils/getCurrentMonth'

const generateRandomTable = async (): Promise<TableProps> => {
  const table: TableProps = {
    id: generateID(),
    month: CURRENT_MONTH_NAME,
    year: new Date().getFullYear().toString(),
    type: TableType.RANDOM,
    details: [],
    createdAt: new Date().toISOString(),
  }

  const details: TableDetailsProps[] = []

  const users = await getUsers()
  const hoursPerDay = await getHoursPerDay()

  for (const hourPerDay of hoursPerDay) {
    const user = users[details.length % users.length]
    const date = new Date()

    const weekDayIndex = WEEK_DAYS.indexOf(hourPerDay.day) + 1
    date.setDate(date.getDate() + (weekDayIndex - date.getDay()))

    const detail: TableDetailsProps = {
      id: generateID(),
      date: date.toLocaleDateString(),
      user,
      hour: hourPerDay.hour,
      weekDay: hourPerDay.day,
    }

    details.push(detail)
  }

  table.details = details

  return table
}

export default generateRandomTable
