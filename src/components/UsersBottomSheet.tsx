import CustomBottomSheet from '@components/BottomSheet'
import Button from '@components/Button'
import Pill from '@components/Pill'
import Title from '@components/Title'
import tw from '@lib/twrnc'
import { User } from '@typings/User'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

interface UsersBottomSheetProps {
  onClose: (userID: string) => void
  users: User[]
  currentSelectedUserID: string
  currentDetailID: string
}

export default function UsersBottomSheet({
  onClose,
  users,
  currentSelectedUserID,
  currentDetailID,
}: UsersBottomSheetProps) {
  const [selectedUserID, setSelectedUserID] = useState(currentSelectedUserID)

  const handleSave = () => {
    onClose(selectedUserID)
  }

  return (
    <CustomBottomSheet
      customSnapPoints={['30%', '80%']}
      content={
        <View>
          <Title>Selecione o dirigente</Title>
          <ScrollView
            style={tw`mt-4 mb-12`}
            contentContainerStyle={tw`flex-row flex-wrap items-center `}
            showsVerticalScrollIndicator={false}>
            {users.map((user, index) => (
              <Pill
                key={index}
                text={user.name}
                onPress={() => setSelectedUserID(user.id)}
                variant={selectedUserID === user.id ? 'primary' : 'secondary'}
                disabled={user.detailID && user.detailID !== currentDetailID}
              />
            ))}
          </ScrollView>
          <Button
            text="Pronto"
            onPress={handleSave}
          />
        </View>
      }
    />
  )
}
