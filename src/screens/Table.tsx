import { MONTHS } from '@common/datesNames'
import { SMALL_ICON_SIZE } from '@common/sizes'
import Button from '@components/Button'
import Description from '@components/Description'
import GoBackButton from '@components/GoBackButton'
import Title from '@components/Title'
import tw from '@lib/twrnc'
import { Picker } from '@react-native-community/picker'
import { TableProps, TableType } from '@typings/Table'
import { CalendarBlank, Clock } from 'phosphor-react-native'
import React, { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

interface ParamsProps {
  tableData: TableProps
  tableType: TableType
}

export default function Table({ navigation, route }) {
  const { tableData: table, tableType }: ParamsProps = route.params
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0])

  const handleShareTable = () => {}

  return (
    <View style={tw`ios:mt-10 p-6`}>
      <View style={tw`items-start justify-center`}>
        <GoBackButton navigation={navigation} />
        <Description>Programação de campo</Description>
        {tableType === TableType.RANDOM ? (
          <Title style={tw`text-primary`}>{table.month}</Title>
        ) : (
          <Picker
            selectedValue={selectedMonth}
            onValueChange={itemValue => setSelectedMonth(itemValue)}>
            <Picker.Item
              label="Janeiro"
              value="Janeiro"
            />
          </Picker>
        )}
      </View>

      <ScrollView
        style={tw`w-full h-[426px] mt-4`}
        showsVerticalScrollIndicator={false}>
        <View style={tw`pb-6`}>
          {table.details.map(detail => (
            <View
              key={detail.id}
              style={tw`mb-2`}>
              <View style={tw`bg-zinc-300 h-[1px]`} />

              <View style={tw`flex-row justify-between mt-2`}>
                <Description style={tw`text-base`}>
                  <CalendarBlank
                    size={SMALL_ICON_SIZE}
                    color="#9B6F9B"
                    style={tw`mr-1`}
                    weight="fill"
                  />
                  {detail.weekDay}
                  {'・'}
                  {detail.date}
                </Description>

                <Description style={tw`text-base`}>
                  <Clock
                    size={SMALL_ICON_SIZE}
                    color="#9B6F9B"
                    style={tw`mr-1`}
                    weight="fill"
                  />
                  {detail.hour}
                </Description>
              </View>

              <Text style={tw`text-2xl font-extrabold`}>
                {detail?.user?.name || 'Sem nome'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Button
        text="Compartilhar"
        onPress={handleShareTable}
      />
    </View>
  )
}
