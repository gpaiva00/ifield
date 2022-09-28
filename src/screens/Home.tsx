import routesNames from '@common/routesNames'
import { LARGE_ICON_SIZE } from '@common/sizes'
import TabBar from '@components/TabBar'
import TextPlaceholder from '@components/TextPlaceholder'
import Title from '@components/Title'
import tw from '@lib/twrnc'
import { getHoursPerDay, getWeekDays } from '@repositories/Dates'
import { getUsers } from '@repositories/Users'
import { PlusCircle } from 'phosphor-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native'

export default function Home({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTable = async () => {
    try {
      setIsLoading(true)
      const users = await getUsers()
      const weekDays = await getWeekDays()
      const hoursPerDay = await getHoursPerDay()

      if (!users.length) {
        setIsLoading(false)

        return Alert.alert(
          'Não há dirigentes cadastrados',
          'Adicione dirigentes para continuar'
        )
      }

      if (!weekDays.length || !hoursPerDay.length) {
        setIsLoading(false)

        return Alert.alert(
          'Não há dias ou horários cadastrados',
          'Adicione dias e horários para continuar'
        )
      }

      navigation.navigate(routesNames.CHOOSE_TABLE_TYPE)
    } catch (error) {}

    setIsLoading(false)
  }

  return (
    <>
      <View style={tw`ios:mt-10 p-6`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Title>Início</Title>
          <TouchableOpacity onPress={handleAddTable}>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#9B6F9B"
              />
            ) : (
              <PlusCircle
                size={LARGE_ICON_SIZE}
                weight="fill"
                color="#9B6F9B"
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={tw`items-center justify-center h-[90%]`}>
          <TextPlaceholder text="A programação de campo aparecerá aqui." />
        </View>
      </View>
      <TabBar navigation={navigation} />
    </>
  )
}
