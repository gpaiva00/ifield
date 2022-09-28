import AsyncStorage from '@react-native-async-storage/async-storage'

import { DAYS_STORAGE_KEY, HOURS_STORAGE_KEY } from '@common/storage'
import { HoursPerDayProps } from '@typings/HoursPerDay'
import { WeekDays } from '@typings/WeekDays'

export const saveWeekDays = async (weekDays: string[]) => {
  try {
    await AsyncStorage.setItem(DAYS_STORAGE_KEY, JSON.stringify(weekDays))
  } catch (error) {
    throw new Error('Error saving week days', error)
  }
}

export const getWeekDays = async (): Promise<WeekDays[]> => {
  try {
    const weekDays = await AsyncStorage.getItem(DAYS_STORAGE_KEY)
    return weekDays ? JSON.parse(weekDays) : []
  } catch (error) {
    throw new Error('Error getting week days', error)
  }
}

export const saveHoursPerDay = async (hoursPerDay: HoursPerDayProps[]) => {
  try {
    await AsyncStorage.setItem(HOURS_STORAGE_KEY, JSON.stringify(hoursPerDay))
  } catch (error) {
    throw new Error('Error saving hours per day', error)
  }
}

export const getHoursPerDay = async (): Promise<HoursPerDayProps[]> => {
  try {
    const hoursPerDay = await AsyncStorage.getItem(HOURS_STORAGE_KEY)
    return hoursPerDay ? JSON.parse(hoursPerDay) : []
  } catch (error) {
    throw new Error('Error getting hours per day', error)
  }
}

export const clearDatesFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(DAYS_STORAGE_KEY)
    await AsyncStorage.removeItem(HOURS_STORAGE_KEY)
  } catch (error) {
    throw new Error('Error clearing dates from storage', error)
  }
}
