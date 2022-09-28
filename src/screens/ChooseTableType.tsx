import routesNames from '@common/routesNames'
import { DEFAULT_ICON_SIZE } from '@common/sizes'
import Button from '@components/Button'
import GoBackButton from '@components/GoBackButton'
import Title from '@components/Title'
import tw from '@lib/twrnc'
import { TableProps, TableType } from '@typings/Table'
import generateManualTable from '@utils/generateManualTable'
import generateRandomTable from '@utils/generateRandomTable'
import { CheckCircle } from 'phosphor-react-native'
import React, { useState } from 'react'
import { View } from 'react-native'

export default function ChooseTableType({ navigation }) {
  const [selectedType, setSelectedType] = useState(TableType.MANUAL)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateTable = async () => {
    try {
      setIsLoading(true)
      const tableData: TableProps | {} =
        selectedType === TableType.RANDOM
          ? await generateRandomTable()
          : await generateManualTable()

      navigation.navigate(routesNames.TABLE, {
        tableData,
        tableType: selectedType,
      })
    } catch (error) {}

    setIsLoading(false)
  }

  return (
    <View style={tw`ios:mt-10 p-6`}>
      <View style={tw`items-start justify-center`}>
        <GoBackButton navigation={navigation} />
        <Title>Como gostaria de gerar a tabela?</Title>
      </View>

      <View style={tw`w-full justify-center mt-10 h-96`}>
        <Button
          text="Manualmente"
          onPress={() => setSelectedType(TableType.MANUAL)}
          variant="secondary"
          icon={
            selectedType === TableType.MANUAL && (
              <CheckCircle
                weight="fill"
                size={DEFAULT_ICON_SIZE}
                color="#9B6F9B"
              />
            )
          }
          style={tw`mb-6`}
        />
        <Button
          text="Aleatoriamente"
          icon={
            selectedType === TableType.RANDOM && (
              <CheckCircle
                weight="fill"
                size={DEFAULT_ICON_SIZE}
                color="#9B6F9B"
              />
            )
          }
          onPress={() => setSelectedType(TableType.RANDOM)}
          variant="secondary"
        />
      </View>
      <Button
        text="Gerar"
        isLoading={isLoading}
        onPress={handleGenerateTable}
      />
    </View>
  )
}
