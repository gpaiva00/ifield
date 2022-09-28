import { Text } from 'react-native'

import tw from '@lib/twrnc'

export default function TextPlaceholder({ text }) {
  return <Text style={tw`text-zinc-500 text-center`}>{text}</Text>
}
