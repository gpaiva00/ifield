import AsyncStorage from '@react-native-async-storage/async-storage'
import { USERS_STORAGE_KEY } from '@common/storage'
import { User } from '@typings/User'

export const saveUsers = async (users: User[]) => {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    return true
  } catch (error) {
    throw new Error("Couldn't save users", error)
  }
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await AsyncStorage.getItem(USERS_STORAGE_KEY)
    return users ? JSON.parse(users) : []
  } catch (error) {
    throw new Error("Couldn't get users", error)
  }
}
