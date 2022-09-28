import { MONTHS } from '@common/datesNames'
import { getHoursPerDay } from '@repositories/Dates'
import { getUsers } from '@repositories/Users'
import { TableDetailsProps, TableProps, TableType } from '@typings/Table'
import generateID from '@utils/generateID'

const generateRandomTable = async (): Promise<TableProps> => {
  const currentMonth = MONTHS[new Date().getMonth()]

  const table: TableProps = {
    id: generateID(),
    month: currentMonth,
    year: new Date().getFullYear().toString(),
    type: TableType.RANDOM,
    details: [],
  }

  const details: TableDetailsProps[] = []

  const users = await getUsers()
  const hoursPerDay = await getHoursPerDay()

  for (const hourPerDay of hoursPerDay) {
    const user = users[details.length % users.length]
    const date = new Date()

    date.setDate(date.getDate() + details.length)

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
