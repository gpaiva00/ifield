import { Text } from 'react-native'

import tw from '@lib/twrnc'

interface TitleProps {
  style?: string
  children: string
}

export default function Title({ style, children }: TitleProps) {
  return (
    <Text style={tw.style('text-4xl font-extrabold', style)}>{children}</Text>
  )
}
