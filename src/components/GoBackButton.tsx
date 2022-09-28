import { MEDIUM_ICON_SIZE } from '@common/sizes'
import tw from '@lib/twrnc'
import { CaretLeft } from 'phosphor-react-native'
import { TouchableOpacity } from 'react-native'

export default function GoBackButton({ navigation }) {
  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <TouchableOpacity
      onPress={handleGoBack}
      style={tw`mb-4`}>
      <CaretLeft
        size={MEDIUM_ICON_SIZE}
        color="#52525b"
        weight="bold"
      />
    </TouchableOpacity>
  )
}
