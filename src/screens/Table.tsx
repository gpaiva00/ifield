import routesNames from '@common/routesNames'
import { DEFAULT_ICON_SIZE, SMALL_ICON_SIZE } from '@common/sizes'
import Button from '@components/Button'
import DateBottomSheet from '@components/DateBottomSheet'
import Description from '@components/Description'
import { Divider } from '@components/Divider'
import GoBackButton from '@components/GoBackButton'
import MonthsBottomSheet from '@components/MonthsBottomSheet'
import Title from '@components/Title'
import UsersBottomSheet from '@components/UsersBottomSheet'
import tw from '@lib/twrnc'
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { saveTable } from '@repositories/Tables'
import { getUsers as getUsersFromDB } from '@repositories/Users'
import { TableDetailsProps, TableProps, TableType } from '@typings/Table'
import { User } from '@typings/User'
import { defaultDateFormat, stringToDate } from '@utils/dateParser'
import { getMonthNumber } from '@utils/getCurrentMonth'
import { CalendarBlank, Clock, Export } from 'phosphor-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Platform, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-root-toast'
import ViewShot from 'react-native-view-shot'

interface ParamsProps {
  tableData: TableProps
}

export default function Table({ navigation, route }) {
  const { tableData: table }: ParamsProps = route.params

  const [showMonthsBottomSheet, setShowMonthsBottomSheet] = useState(false)
  const [showUsersBottomSheet, setShowUsersBottomSheet] = useState(false)
  const [showDateBottomSheet, setShowDateBottomSheet] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const [newTable, setNewTable] = useState(table)
  const [users, setUsers] = useState([] as User[])

  const [selectedDetailID, setSelectedDetailID] = useState(null)
  const [selectedUserID, setSelectedUserID] = useState(null)
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateFormat(new Date()))

  const [isLoading, setIsLoading] = useState(false)

  const viewShotRef = useRef(null)

  const handleOnSelectMonth = (month: string) => {
    const monthNumber = getMonthNumber(month)

    const newDetails = newTable.details.map(detail => {
      const date = stringToDate(detail.date)
      date.setMonth(monthNumber)
      
      return {
        ...detail,
        date: defaultDateFormat(date)
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

  const updateUsersWithTableDetails = (users: User[]) => {
    const newUsers = users.map(user => {
      const detail = newTable.details.find(detail => detail?.user?.id === user.id)

      if (detail) {
        user.detailID = detail.id
      }

      return user
    })        

    setUsers(newUsers)
  }


  const handleOnMonthPress = () => {
    closeAllBottomSheets()
    setShowMonthsBottomSheet(true)
  }

  const handleOnUserPress = ({
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
    setSelectedDate(detail.date)
    setSelectedDetailID(detail.id)
    
    if (Platform.OS === 'android') {
      return DateTimePickerAndroid.open({
        value: stringToDate(selectedDate),
        onChange: (_: DateTimePickerEvent, date: Date) =>
          handleOnChooseDate(null, defaultDateFormat(date)),
        mode: 'date',
        is24Hour: true,
      })
    }

    setShowDateBottomSheet(true)
  }

  const handleOnChooseDate = (_, date: string) => {
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
    try {
      const users = await getUsersFromDB()
      setUsers(users)
      
      if (newTable.type === TableType.MANUAL) updateUsersWithTableDetails(users)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSaveTable = async () => {
    try {
      setIsLoading(true)
      await saveTable(newTable)
      navigation.navigate(routesNames.HOME, { reload: true })
    } catch (error) {
      Toast.show('Não foi possível salvar. Tente novamente')
      console.log(error)
    }

    setIsLoading(false)
  }
  // TODO: empty when try to share on Android (doesn't show "save image" option)
  const handleShareTable = async () => {
    try {
      setShowControls(false)
      const url = await viewShotRef.current.capture()
      setShowControls(true)
      const shareResult = await Share.share({ url })
      
      if (shareResult.action === Share.sharedAction) {
        if (shareResult.activityType) {
          Toast.show('Compartilhado com sucesso')
        }
      }
       
    } catch (error) {
      setShowControls(true)
      Toast.show('Não foi possível compartilhar. Tente novamente')
      console.log(error)
    }
  }

  const closeAllBottomSheets = () => {
    setShowMonthsBottomSheet(false)
    setShowUsersBottomSheet(false)
    setShowDateBottomSheet(false)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <>
      <ViewShot
        ref={viewShotRef}
        style={tw`flex-1 bg-background`}>
        <View style={tw`flex-1 mt-10 p-6`}>
          <GoBackButton style={tw.style(!showControls && 'hidden')} navigation={navigation} />
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <View style={tw`items-start justify-center`}>
              <Description>
                Programação de campo
                {newTable.type === TableType.RANDOM && ' (aleatória)'}
              </Description>
              {newTable.type === TableType.RANDOM ? (
                <Title style={tw`text-primary`}>{table.month}</Title>
              ) : (
                <TouchableOpacity onPress={handleOnMonthPress}>
                  <Title style={tw`text-primary`}>{newTable.month}</Title>
                </TouchableOpacity>
              )}
            </View>

            <Button
              icon={
                <Export
                  color="#9B6F9B"
                  size={DEFAULT_ICON_SIZE}
                />
              }
              onPress={handleShareTable}
              variant="transparent"
              style={tw.style(!showControls && 'hidden')}
            />
          </View>
          <ScrollView
            style={tw`flex-1`}
            showsVerticalScrollIndicator={false}>
            <View style={tw`pb-8`}>
              {newTable?.details?.map(detail => (
                <View
                  key={detail.id}
                  style={tw`mb-2`}>
                  <Divider />

                  <View style={tw`flex-row items-center justify-between my-2`}>
                    <View style={tw`flex-row items-center`}>
                      <CalendarBlank
                        size={SMALL_ICON_SIZE}
                        color="#9B6F9B"
                        style={tw`mr-1`}
                        weight="bold"
                      />
                      <Description style={tw`text-base mr-1`}>
                        {detail.weekDay}
                      </Description>

                      {newTable.type === TableType.RANDOM ? (
                        <Description style={tw`text-base text-primary font-semibold`}>
                          {detail.date}
                        </Description>
                      ) : (
                        <TouchableOpacity onPress={() => handleOnDatePress(detail)}>
                          <Description style={tw`text-base text-primary font-semibold`}>
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
                      <Description style={tw`text-base`}>{detail.hour}</Description>
                    </View>
                  </View>

                  {newTable.type === TableType.RANDOM ? (
                    <Text style={tw`text-2xl font-extrabold`}>{detail.user.name}</Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        handleOnUserPress({
                          detailID: detail.id,
                          userID: detail?.user?.id,
                        })
                      }>
                      {detail?.user?.name ? (
                        <Text style={tw`text-2xl font-extrabold`}>
                          {detail.user.name}
                        </Text>
                      ) : (
                        <Text style={tw`text-2xl font-bold text-zinc-400`}>
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
            text="Salvar"
            onPress={handleSaveTable}
            isLoading={isLoading}
            style={tw.style(!showControls && 'hidden')}
          />
        </View>
      </ViewShot>

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
          onClose={handleOnChooseDate}
          currentSelectedDate={selectedDate}
        />
      )}
    </>
  )
}
