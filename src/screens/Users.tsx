import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

import Button from '@components/Button'
import GoBackButton from '@components/GoBackButton'
import Pill from '@components/Pill'
import TextInput from '@components/TextInput'
import TextPlaceholder from '@components/TextPlaceholder'
import Title from '@components/Title'

import routesNames from '@common/routesNames'

import { getUsers as getUsersFromDB, saveUsers } from '@repositories/Users'
import { User } from '@typings/User'

import tw from '@lib/twrnc'

export default function Users({ navigation }) {
  const [user, setUser] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUserChange = (text: string) => {
    setUser(text)

    if (text.slice(-1) === ',') {
      handleAddUser(text)
    }
  }

  const handleAddUser = (text: string) => {
    const name = text.at(-1) === ',' ? text.slice(0, -1) : text
    setUsers([...users, { name }])
    setUser('')
  }

  const handleRemoveUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index))
  }

  const handleSaveUsers = async () => {
    try {
      setIsLoading(true)
      await saveUsers(users)
      navigation.navigate(routesNames.HOME)
    } catch (e) {}

    setIsLoading(false)
  }

  const getUsers = async () => {
    try {
      setIsLoading(true)
      const users = await getUsersFromDB()
      setUsers(users)
    } catch (e) {}

    setIsLoading(false)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <View style={tw`ios:mt-10 p-6`}>
      <View style={tw`items-start justify-center`}>
        <GoBackButton navigation={navigation} />
        <Title>Quem são os dirigentes?</Title>
      </View>

      <View style={tw`w-full mt-10 h-96`}>
        <TextInput
          placeholder="Nome do dirigente"
          value={user}
          onChangeText={handleUserChange}
          clearButtonMode="while-editing"
          autoCapitalize="words"
          autoFocus
          autoCorrect={false}
          onSubmitEditing={() => handleAddUser(user)}
        />

        {users.length > 0 && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={tw`items-end`}>
              <Text style={tw`mt-2 text-zinc-500`}>
                {`${users.length} dirigente${users.length > 1 ? 's' : ''}`}
              </Text>
            </View>
            <View style={tw`flex-row flex-wrap w-full h-full py-5`}>
              {users.map((user, index) => (
                <Pill
                  key={index}
                  text={user.name}
                  onPress={() => handleRemoveUser(index)}
                />
              ))}
            </View>
          </ScrollView>
        )}

        {users.length === 0 && (
          <View style={tw`items-center justify-center mt-20`}>
            <TextPlaceholder
              text={
                'Para adicionar, digite o nome do dirigente e pressione vírgula.'
              }
            />
          </View>
        )}
      </View>
      <Button
        text="Salvar"
        onPress={handleSaveUsers}
        isLoading={isLoading}
        // style={tw`bottom-6`}
      />
    </View>
  )
}
