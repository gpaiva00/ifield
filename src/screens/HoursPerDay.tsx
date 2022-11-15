import { Plus } from 'phosphor-react-native'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInputChangeEventData,
  View
} from 'react-native'

import Button from '@components/Button'
import GoBackButton from '@components/GoBackButton'
import TextInput from '@components/TextInput'
import Title from '@components/Title'

import { MEDIUM_ICON_SIZE } from '@common/sizes'

import {
  getHoursPerDay as getHoursPerDayFromDB,
  saveHoursPerDay
} from '@repositories/Dates'
import { HoursPerDayProps } from '@typings/HoursPerDay'
import { WeekDays } from '@typings/WeekDays'
import { debounce } from '@utils/debounce'

import routesNames from '@common/routesNames'
import tw from '@lib/twrnc'
import { timeMask } from '@utils/timeMask'

interface HourChangeProps {
  day: string
  event: NativeSyntheticEvent<TextInputChangeEventData>
  hourPerDayIndex: number
}

export default function HoursPerDay({ navigation, route }) {
  const { selectedDays }: { selectedDays: WeekDays[] } = route.params

  const [hoursPerDay, setHoursPerDay] = useState<HoursPerDayProps[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddHourField = ({ day }: { day: WeekDays }) => {
    const lastHourIndex = hoursPerDay
      .map(hourPerDay => hourPerDay.day)
      .lastIndexOf(day)

    const newHoursPerDay = [...hoursPerDay]

    newHoursPerDay.splice(lastHourIndex + 1, 0, {
      day,
      hour: '',
    })

    setHoursPerDay(newHoursPerDay)
  }

  const handleHourChange = ({
    day,
    event,
    hourPerDayIndex,
  }: HourChangeProps) => {
    let newHour = event.nativeEvent.text

    if (!newHour && hourPerDayIndex > 0) {
      setHoursPerDay(
        hoursPerDay.filter((_, index) => index !== hourPerDayIndex)
      )
      return
    }

    newHour = timeMask(newHour)

    const newHoursPerDay = hoursPerDay.map((hourPerDay, index) => {
      if (hourPerDay.day === day && hourPerDayIndex === index) {
        return {
          ...hourPerDay,
          hour: newHour,
        }
      }

      return hourPerDay
    })

    setHoursPerDay(newHoursPerDay)
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const hasEmptyHour = hoursPerDay.find(
        hoursPerDay => hoursPerDay.hour === ''
      )

      if (hasEmptyHour) {
        Alert.alert(
          'Salvar horários',
          'Há campos de horário vazios. Preencha-os antes de salvar.'
        )
        setIsLoading(false)

        return
      }

      await saveHoursPerDay(hoursPerDay)
      navigation.navigate(routesNames.HOME)
    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)
  }

  const getHoursPerDay = async () => {
    try {
      setIsLoading(true)
      const hoursPerDay = await getHoursPerDayFromDB()

      setInitialHoursPerDay(hoursPerDay)
    } catch (error) {}

    setIsLoading(false)
  }

  const setInitialHoursPerDay = (hoursPerDay: HoursPerDayProps[]) => {
    const newHoursPerDay = selectedDays.map(day => {
      const hoursPerDayForThisDay = hoursPerDay.filter(
        hourPerDay => hourPerDay.day === day
      )

      if (!hoursPerDayForThisDay.length) {
        return {
          day,
          hour: '',
        }
      }

      return hoursPerDayForThisDay
    })

    setHoursPerDay(newHoursPerDay.flat())
  }

  useEffect(() => {
    getHoursPerDay()
  }, [])

  return (
    <View style={tw`flex-1 ios:mt-10 p-6`}>
      <View style={tw`items-start justify-center mb-10`}>
        <GoBackButton navigation={navigation} />
        <Title>Quais os horários?</Title>
      </View>

      <ScrollView
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}>
        {selectedDays.map((day: WeekDays, index: number) => {
          return (
            <View
              key={index}
              style={tw.style('justify-between mb-4', {
                'pb-10': index === selectedDays.length - 1,
              })}>
              <Text style={tw`text-base font-bold mb-1`}>{day}</Text>

              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal>
                {isLoading && (
                  <ActivityIndicator
                    size="small"
                    color="#71717a"
                  />
                )}
                {!isLoading &&
                  hoursPerDay.map((hourPerDay, hourPerDayIndex) => {
                    if (hourPerDay.day === day) {
                      return (
                        <TextInput
                          key={hourPerDayIndex}
                          placeholder="00:00"
                          keyboardType="numeric"
                          size="xs"
                          returnKeyLabel="Pronto"
                          onChange={event =>
                            debounce(
                              handleHourChange({
                                day,
                                hourPerDayIndex,
                                event,
                              })
                            )
                          }
                          autoFocus
                          value={hourPerDay.hour}
                          style={tw`mr-4`}
                        />
                      )
                    }
                  })}

                {!isLoading && (
                  <Button
                    icon={
                      <Plus
                        size={MEDIUM_ICON_SIZE}
                        color="white"
                      />
                    }
                    onPress={() => handleAddHourField({ day })}
                    key={index}
                  />
                )}
              </ScrollView>
            </View>
          )
        })}
      </ScrollView>
      <Button
        text="Salvar"
        isLoading={isLoading}
        onPress={handleSave}
      />
    </View>
  )
}
