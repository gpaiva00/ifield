import { MONTHS } from '@common/datesNames'
import CustomBottomSheet from '@components/BottomSheet'
import Button from '@components/Button'
import Pill from '@components/Pill'
import Title from '@components/Title'
import tw from '@lib/twrnc'
import React, { useState } from 'react'
import { View } from 'react-native'

interface MonthsBottomSheetProps {
  onClose: (month: string) => void
  tableMonth: string
}

export default function MonthsBottomSheet({
  onClose,
  tableMonth,
}: MonthsBottomSheetProps) {
  const [selectedMonth, setSelectedMonth] = useState(tableMonth)

  const handleSave = () => {
    onClose(selectedMonth)
  }

  return (
    <CustomBottomSheet
      customSnapPoints={['30%', '70%']}
      content={
        <View>
          <Title>Selecione o mês</Title>
          <View style={tw`flex-row flex-wrap items-center mt-4 mb-12`}>
            {MONTHS.map((month, key) => (
              <Pill
                key={key}
                onPress={() => setSelectedMonth(month)}
                variant={selectedMonth === month ? 'primary' : 'secondary'}
                text={month}
              />
            ))}
          </View>
          <Button
            text="Pronto"
            onPress={handleSave}
          />
        </View>
      }
    />
  )
}
