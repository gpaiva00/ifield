import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { RootSiblingParent } from 'react-native-root-siblings'
import Routes from './src/Routes'

export default function App() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootSiblingParent>
          <Routes />
        </RootSiblingParent>
      </GestureHandlerRootView>
    </>
  )
}
