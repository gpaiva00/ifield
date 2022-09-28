import { User } from '@typings/User'
import { WeekDays } from '@typings/WeekDays'

export enum TableType {
  RANDOM = 'random',
  MANUAL = 'manual',
}

export interface TableProps {
  id: string
  month: string
  year: string
  type?: TableType
  createdAt?: string
  details: TableDetailsProps[]
}

export interface TableDetailsProps {
  id: string
  weekDay: WeekDays
  hour: string
  date: string
  user: User
}
