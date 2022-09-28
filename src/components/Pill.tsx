import { TouchableOpacity, Text } from 'react-native'
import { X } from 'phosphor-react-native'
import { SMALL_ICON_SIZE } from '@common/sizes'

import tw from '@lib/twrnc'

interface PillProps {
  text: string
  onPress: () => void
}

export default function Pill({ text, onPress, ...props }: PillProps) {
  return (
    <TouchableOpacity
      style={tw`bg-primary flex-row items-center justify-between rounded-lg p-2 mr-1 mb-1`}
      onPress={onPress}>
      <Text style={tw`mr-2 text-white text-sm`}>{text}</Text>
      <X
        size={SMALL_ICON_SIZE}
        color="#581c87"
      />
    </TouchableOpacity>
  )
}
