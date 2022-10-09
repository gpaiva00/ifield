import { SMALL_ICON_SIZE } from '@common/sizes'
import Button from '@components/Button'
import DateBottomSheet from '@components/DateBottomSheet'
import Description from '@components/Description'
import GoBackButton from '@components/GoBackButton'
import MonthsBottomSheet from '@components/MonthsBottomSheet'
import Title from '@components/Title'
import UsersBottomSheet from '@components/UsersBottomSheet'
import tw from '@lib/twrnc'
import { getUsers as getUsersFromDB } from '@repositories/Users'
import { TableDetailsProps, TableProps, TableType } from '@typings/Table'
import { User } from '@typings/User'
import { getMonthNumber } from '@utils/getCurrentMonth'
import * as Linking from 'expo-linking'
import { CalendarBlank, Clock } from 'phosphor-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface ParamsProps {
  tableData: TableProps
  tableType: TableType
}

export default function Table({ navigation, route }) {
  const { tableData: table, tableType }: ParamsProps = route.params

  const [showMonthsBottomSheet, setShowMonthsBottomSheet] = useState(false)
  const [showUsersBottomSheet, setShowUsersBottomSheet] = useState(false)
  const [showDateBottomSheet, setShowDateBottomSheet] = useState(false)

  const [newTable, setNewTable] = useState({} as TableProps)
  const [users, setUsers] = useState([] as User[])

  const [selectedDetailID, setSelectedDetailID] = useState(null)
  const [selectedUserID, setSelectedUserID] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  const handleOnSelectMonth = (month: string) => {
    const monthNumber = getMonthNumber(month)

    const newDetails = newTable.details.map(detail => {
      const date = new Date(detail.date)
      date.setMonth(monthNumber)

      return {
        ...detail,
        date: date.toLocaleDateString(),
      }
    })

    setNewTable({
      ...newTable,
      month,
      details: newDetails,
    })
    setShowMonthsBottomSheet(false)
  }

  const handleOnSelectUser = (userID: string) => {
    setShowUsersBottomSheet(false)

    if (!userID) return

    const selectedUser = users.find(user => user.id === userID)

    const newDetails = newTable.details.map(detail => {
      if (detail.id === selectedDetailID) {
        detail.user = selectedUser
      }

      return detail
    })

    const newUsers = users.map(user => {
      if (user.detailID === selectedDetailID) {
        user.detailID = null
      }

      if (user.id === userID) {
        user.detailID = selectedDetailID
      }

      return user
    })

    setUsers(newUsers)
    setNewTable({ ...newTable, details: newDetails })
  }

  const handleOnMonthPress = () => {
    closeAllBottomSheets()
    setShowMonthsBottomSheet(true)
  }

  const handleOnPressUser = ({
    detailID,
    userID,
  }: {
    detailID: string
    userID: string
  }) => {
    closeAllBottomSheets()
    setSelectedDetailID(detailID)
    setSelectedUserID(userID)
    setShowUsersBottomSheet(true)
  }

  const handleOnDatePress = (detail: TableDetailsProps) => {
    closeAllBottomSheets()
    setSelectedDetailID(detail.id)
    setSelectedDate(detail.date)
    setShowDateBottomSheet(true)
  }

  const handleOnSelectDate = (_, date: string) => {
    setShowDateBottomSheet(false)

    if (!date) return

    const newDetails = newTable.details.map(detail => {
      if (detail.id === selectedDetailID) {
        detail.date = date
      }

      return detail
    })

    setNewTable({ ...newTable, details: newDetails })
  }

  const getUsers = async () => {
    const users = await getUsersFromDB()
    setUsers(users)
  }

  const generateTextFromTable = () => {
    const { month, details } = newTable

    let text = `Mês: ${month} \n`

    text += `${details
      .map(
        detail =>
          `🗓️ ${detail.weekDay} ・ ${detail.date}
          🙋‍♂️ ${detail.user.name}
          ⏰ ${detail.hour}
        `
      )
      .join('')}`

    return text
  }

  const handleShareTable = async () => {
    try {
      const text = generateTextFromTable()

      const whatsAppLink = `whatsapp://send?text=${text}`

      const isSupported = await Linking.canOpenURL(whatsAppLink)

      if (!isSupported) {
        Alert.alert('Compartilhar tabela', 'Compartilhamento não disponível')
        return
      }

      return Linking.openURL(whatsAppLink)
    } catch (error) {
      Alert.alert('Compartilhar tabela', 'Não foi possível compartilhar')
      console.log(error)
    }
  }

  const closeAllBottomSheets = () => {
    setShowMonthsBottomSheet(false)
    setShowUsersBottomSheet(false)
    setShowDateBottomSheet(false)
  }

  useEffect(() => {
    setNewTable(table)

    if (tableType === TableType.MANUAL) {
      getUsers()
    }
  }, [table])

  return (
    <>
      <View style={tw`flex-1 ios:mt-10 p-6`}>
        <View style={tw`items-start justify-center mb-4`}>
          <GoBackButton navigation={navigation} />
          <Description>Programação de campo</Description>
          {tableType === TableType.RANDOM ? (
            <Title style={tw`text-primary`}>{table.month}</Title>
          ) : (
            <TouchableOpacity onPress={handleOnMonthPress}>
              <Title style={tw`text-primary`}>{newTable.month}</Title>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={tw`flex-1`}
          showsVerticalScrollIndicator={false}>
          <View style={tw`pb-8`}>
            {newTable?.details?.map(detail => (
              <View
                key={detail.id}
                style={tw`mb-2`}>
                <View style={tw`bg-zinc-300 h-[1px]`} />

                <View style={tw`flex-row items-center justify-between my-2`}>
                  <View style={tw`flex-row items-center`}>
                    <CalendarBlank
                      size={SMALL_ICON_SIZE}
                      color="#9B6F9B"
                      style={tw`mr-1`}
                      weight="bold"
                    />
                    <Description style={tw`text-base mr-1 font-semibold`}>
                      {detail.weekDay}
                    </Description>

                    {tableType === TableType.RANDOM ? (
                      <Description
                        style={tw`text-base text-primary font-semibold`}>
                        {detail.date}
                      </Description>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleOnDatePress(detail)}>
                        <Description
                          style={tw`text-base text-primary font-semibold`}>
                          {detail.date}
                        </Description>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={tw`flex-row items-center`}>
                    <Clock
                      size={SMALL_ICON_SIZE}
                      color="#9B6F9B"
                      style={tw`mr-1`}
                      weight="bold"
                    />
                    <Description style={tw`text-base font-semibold`}>
                      {detail.hour}
                    </Description>
                  </View>
                </View>

                {tableType === TableType.RANDOM ? (
                  <Text style={tw`text-2xl font-extrabold`}>
                    {detail.user.name}
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      handleOnPressUser({
                        detailID: detail.id,
                        userID: detail?.user?.id,
                      })
                    }>
                    {detail?.user?.name ? (
                      <Text style={tw`text-2xl font-extrabold`}>
                        {detail.user.name}
                      </Text>
                    ) : (
                      <Text style={tw`text-2xl font-bold text-zinc-300`}>
                        Adicionar dirigente
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <Button
          text="Enviar por WhatsApp"
          onPress={handleShareTable}
        />
      </View>
      {showMonthsBottomSheet && (
        <MonthsBottomSheet
          onClose={handleOnSelectMonth}
          tableMonth={newTable.month}
        />
      )}

      {showUsersBottomSheet && (
        <UsersBottomSheet
          onClose={handleOnSelectUser}
          users={users}
          currentSelectedUserID={selectedUserID}
          currentDetailID={selectedDetailID}
        />
      )}

      {showDateBottomSheet && (
        <DateBottomSheet
          onClose={handleOnSelectDate}
          currentDetailID={selectedDetailID}
          currentSelectedDate={selectedDate}
        />
      )}
    </>
  )
}
