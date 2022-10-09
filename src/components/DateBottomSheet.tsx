import CustomBottomSheet from '@components/BottomSheet'
import Button from '@components/Button'
import Description from '@components/Description'
import Title from '@components/Title'
import tw from '@lib/twrnc'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import { View } from 'react-native'

interface DateBottomSheetProps {
  onClose: (event: DateTimePickerEvent, date: string) => void
  currentDetailID: string
  currentSelectedDate: string
}

export default function DateBottomSheet({
  onClose,
  currentDetailID,
  currentSelectedDate,
}: DateBottomSheetProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date(currentSelectedDate).toLocaleDateString())
  )

  const handleOnClose = (event: DateTimePickerEvent, date: Date) => {
    setSelectedDate(date)
    onClose(event, date.toLocaleDateString())
  }

  return (
    <CustomBottomSheet
      customSnapPoints={['30%', '70%']}
      content={
        <View>
          <Title>Selecione a data</Title>
          <View style={tw`mt-4 mb-12`}>
            <DateTimePicker
              value={selectedDate}
              onChange={handleOnClose}
              mode="date"
            />
          </View>
          <Description style={tw`text-base text-center mt-6 mb-40`}>
            Clique na data acima para alterá-la
          </Description>
          <Button
            text="Cancelar"
            onPress={() => onClose(null, null)}
          />
        </View>
      }
    />
  )
}
