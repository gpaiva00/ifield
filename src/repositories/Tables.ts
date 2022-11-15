import { TABLE_STORAGE_KEY } from '@common/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TableProps } from '@typings/Table'

interface GetTablesProps { field: keyof TableProps, direction: 'asc'| 'desc' }

export const saveTable = async (table: TableProps) => {
  try {
    const tables = await getTables()
    const tableID = table.id
    let newTables = [...tables]

    const tableExists = tables.findIndex(table => table.id === tableID) > -1
    
    if (tableExists) {
      newTables = tables.map(originalTable => {
        if (originalTable.id === tableID) {
          return table
        }

        return originalTable
      })
    } else {
      newTables.push(table)
    }
    
    await AsyncStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify(newTables))
  } catch (error) {
    throw new Error('Error saving table', error)
  }
}

export const getTables = async (sort: GetTablesProps = { direction: 'desc', field: 'createdAt' }): Promise<TableProps[]> => {
  try {
    const tables = await AsyncStorage.getItem(TABLE_STORAGE_KEY)

    if (tables) {
      const sortedTables = JSON.parse(tables).sort((a: TableProps, b: TableProps) => {
        if (a[sort.field] > b[sort.field]) {
          return sort.direction === 'asc' ? 1 : -1
        }

        if (a[sort.field] < b[sort.field]) {
          return sort.direction === 'asc' ? -1 : 1
        }

        return 0
      })

      return sortedTables
    }

    return []
  } catch (error) {
    throw new Error('Error getting tables', error)
  }
}

export const deleteTable = async (id: string) => {
  try {
    const tables = await getTables()
    const newTables = tables.filter((table: TableProps) => table.id !== id)
    await AsyncStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify(newTables))
  } catch (error) {
    throw new Error('Error deleting table', error)
  }
}
