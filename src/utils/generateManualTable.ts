import { MONTHS } from '@common/datesNames'
import { getHoursPerDay } from '@repositories/Dates'
import { TableDetailsProps, TableProps, TableType } from '@typings/Table'
import generateID from '@utils/generateID'

const generateManualTable = async (): Promise<TableProps> => {
  const currentMonth = MONTHS[new Date().getMonth()]

  const table: TableProps = {
    id: generateID(),
    month: currentMonth,
    year: new Date().getFullYear().toString(),
    type: TableType.MANUAL,
    details: [],
  }

  const details: TableDetailsProps[] = []

  const hoursPerDay = await getHoursPerDay()

  for (const hourPerDay of hoursPerDay) {
    const detail: TableDetailsProps = {
      id: generateID(),
      date: '',
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
