import { TextInput as NativeTextInput, TextInputProps } from 'react-native'

import tw from '@lib/twrnc'

interface CustomTextInputProps extends TextInputProps {
  placeholder: string
  value?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full'
  style?: string
}

export default function TextInput({
  placeholder,
  value,
  onChangeText,
  size = 'full',
  style,
  ...props
}: CustomTextInputProps) {
  return (
    <NativeTextInput
      style={tw.style(
        'border border-zinc-500 rounded-lg px-2 w-full h-11',
        {
          'w-[65px]': size === 'xs',
          'w-1/2': size === 'sm',
          'w-1/3': size === 'md',
          'w-1/4': size === 'lg',
          'w-full': size === 'full',
        },
        style
      )}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  )
}
