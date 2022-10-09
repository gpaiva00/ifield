import { TABLE_STORAGE_KEY } from '@common/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TableProps } from '@typings/Table'

export const saveTable = async (table: TableProps) => {
  try {
    await AsyncStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify(table))
  } catch (error) {
    throw new Error('Error saving table', error)
  }
}