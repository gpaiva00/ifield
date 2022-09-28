import { Text } from 'react-native'

import tw from '@lib/twrnc'

interface DescriptionProps {
  style?: string
  children: string | React.ReactNode
}

export default function Description({ style, children }: DescriptionProps) {
  return (
    <Text style={tw.style('text-sm text-zinc-500 items-center', style)}>
      {children}
    </Text>
  )
}
