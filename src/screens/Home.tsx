import routesNames from '@common/routesNames'
import { LARGE_ICON_SIZE } from '@common/sizes'
import Description from '@components/Description'
import { Divider } from '@components/Divider'
import TabBar from '@components/TabBar'
import TextPlaceholder from '@components/TextPlaceholder'
import Title from '@components/Title'
import tw from '@lib/twrnc'
import { getHoursPerDay, getWeekDays } from '@repositories/Dates'
import { deleteTable, getTables as getTablesFromDB } from '@repositories/Tables'
import { getUsers } from '@repositories/Users'
import { TableProps, TableType } from '@typings/Table'
import { wait } from '@utils/wait'
import { PlusCircle } from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native'

export default function Home({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tables, setTables] = useState([] as TableProps[])

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

  const getTables = async () => {
    try {
      setIsRefreshing(true)
      wait()
      .then(async () => {
        const tables = await getTablesFromDB()

        setTables(tables)
        setIsRefreshing(false)
      })
      .catch((error) => {
        setIsRefreshing(false)
        console.error(error);
        
      })
    } catch (error) {
      setIsRefreshing(false)
    }

  }
  
  const handleOnPressItem = (tableData: TableProps) => {
    navigation.navigate(routesNames.TABLE, {
      tableData,
    })
  }

  const handleOnLongPressItem = (tableData: TableProps) => {
    Alert.alert(
      'Remover tabela',
      'Tem certeza que deseja remover esta tabela?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Remover',
          onPress: async () => {
            try {
              setIsLoading(true)
              await deleteTable(tableData.id)
              await getTables()
            } catch (error) {
              console.error(error);
            }

            setIsLoading(false)
          }
        }
      ]
    )
 
  }

  useEffect(() => {
    getTables()
  }, [])

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
          <ScrollView
            style={tw`w-full flex-1 pt-6`}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={getTables}
              />
            }>
            {!tables.length && (
              <View style={tw`h-[15rem] flex-1 justify-end`}>
                <TextPlaceholder text="A programação de campo aparecerá aqui." />
                <TextPlaceholder text="(Puxe para baixo para atualizar.)" />
              </View>
            )}
            {tables.map(table => (
              <View
                key={table.id}
                style={tw`mb-2`}>
                <Divider />
                <TouchableOpacity
                  onPress={() => handleOnPressItem(table)}
                  onLongPress={() => handleOnLongPressItem(table)}
                  style={tw`w-full mt-2`}>
                  <Description>
                    Programação de campo
                    {table.type === TableType.RANDOM && ' (aleatória)'}
                  </Description>
                  <Title style={tw`text-primary`}>{table.month}</Title>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <TabBar navigation={navigation} />
    </>
  )
}
