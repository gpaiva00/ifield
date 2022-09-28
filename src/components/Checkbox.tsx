import { View, TouchableOpacity, Text } from 'react-native'
import { Check } from 'phosphor-react-native'
import { SMALL_ICON_SIZE } from '@common/sizes'

import tw from '@lib/twrnc'

interface CheckboxProps {
  checked: boolean
  onPress: (text: string) => void
  label: string
}

export default function Checkbox({ label, checked, onPress }: CheckboxProps) {
  return (
    <View style={tw`flex-row items-center mb-2`}>
      <TouchableOpacity
        onPress={() => onPress(label)}
        style={tw`flex-row items-center`}>
        <View
          style={tw.style(
            'items-center justify-center rounded-sm border-[1px] border-primary p-2 w-5 h-5',
            checked ? 'bg-primary' : 'bg-white'
          )}>
          {checked && (
            <Check
              size={SMALL_ICON_SIZE}
              color="white"
              weight="bold"
            />
          )}
        </View>
        <Text style={tw`text-2xl ml-3`}>{label}</Text>
      </TouchableOpacity>
    </View>
  )
}
