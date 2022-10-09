import BottomSheet from '@gorhom/bottom-sheet'
import tw from '@lib/twrnc'
import { useMemo, useRef } from 'react'
import { View } from 'react-native'

interface BottomSheetProps {
  content: React.ReactNode
  customSnapPoints?: string[]
}

export default function CustomBottomSheet({
  content,
  customSnapPoints,
}: BottomSheetProps) {
  const snapPoints = useMemo(() => customSnapPoints || ['25%', '50%'], [])

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.warn('handleSheetChanges', index)
  // }, [])

  const ref = useRef<BottomSheet>(null)

  return (
    <BottomSheet
      ref={ref}
      index={1}
      snapPoints={snapPoints}>
      <View style={tw`px-4`}>{content}</View>
    </BottomSheet>
  )
}
