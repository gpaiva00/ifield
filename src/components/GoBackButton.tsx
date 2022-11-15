import { MEDIUM_ICON_SIZE } from '@common/sizes'
import tw from '@lib/twrnc'
import { CaretLeft } from 'phosphor-react-native'
import { TouchableOpacity } from 'react-native'

interface GoBackButtonProps {
  navigation: any
  style?: string
}

export default function GoBackButton({ navigation, style }: GoBackButtonProps) {
  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <TouchableOpacity
      onPress={handleGoBack}
      style={tw.style('mb-4', style)}>
      <CaretLeft
        size={MEDIUM_ICON_SIZE}
        color="#52525b"
        weight="bold"
      />
    </TouchableOpacity>
  )
}
