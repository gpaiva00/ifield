import Title from '@components/Title'
import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import Button from '@components/Button'
import GoBackButton from '@components/GoBackButton'

import { WEEK_DAYS } from '@common/datesNames'
import routesNames from '@common/routesNames'
import Checkbox from '@components/Checkbox'
import tw from '@lib/twrnc'
import {
  getWeekDays as getWeekDaysFromDB,
  saveWeekDays
} from '@repositories/Dates'
import orderSelectedDays from '@utils/orderSelectedDays'
import Toast from 'react-native-root-toast'


export default function Dates({ navigation }) {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    setIsLoading(true)
    if (!selectedDays.length) {
      setIsLoading(false)
      Toast.show('Selecione pelo menos um dia da semana')
      return
    }

    try {
      const orderedDays = orderSelectedDays(selectedDays)

      await saveWeekDays(orderedDays)
      navigation.navigate(routesNames.HOURS_PER_DAY, {
        selectedDays: orderedDays,
      })
    } catch (e) {}

    setIsLoading(false)
  }

  const handleItemPress = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day))
      return
    }

    setSelectedDays([...selectedDays, day])
  }

  const handleSelectAll = () => {
    if (selectedDays.length === WEEK_DAYS.length) {
      setSelectedDays([])
      return
    }

    setSelectedDays(WEEK_DAYS)
  }

  const getWeekDays = async () => {
    try {
      setIsLoading(true)
      const weekDays = await getWeekDaysFromDB()
      setSelectedDays(weekDays)
    } catch (error) {}

    setIsLoading(false)
  }

  useEffect(() => {
    getWeekDays()
  }, [])

  return (
    <View style={tw`flex-1 mt-10 p-6`}>
      <View style={tw`items-start justify-center`}>
        <GoBackButton navigation={navigation} />
        <Title>Quais dias terão consideração de campo?</Title>
      </View>

      <View style={tw`flex-1 justify-center`}>
        <View style={tw`items-end justify-center`}>
          <TouchableOpacity
            onPress={handleSelectAll}
            style={tw`items-center justify-center`}>
            <Text style={tw`text-base text-primary`}>
              {selectedDays.length === WEEK_DAYS.length
                ? 'Desmarcar todos'
                : 'Marcar todos'}
            </Text>
          </TouchableOpacity>
        </View>

        {WEEK_DAYS.map((day, index) => {
          const isSelected = selectedDays.includes(day)

          return (
            <Checkbox
              key={index}
              label={day}
              checked={isSelected}
              onPress={handleItemPress}
            />
          )
        })}
      </View>

      <Button
        text="Próximo"
        onPress={handleNext}
        isLoading={isLoading}
      />
    </View>
  )
}
