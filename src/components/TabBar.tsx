import { View, Text, TouchableOpacity } from 'react-native'
import { House, Users, CalendarBlank } from 'phosphor-react-native'
import { DEFAULT_ICON_SIZE } from '@common/sizes'

import routeNames from '@common/routesNames'

import tw from '@lib/twrnc'

export default function TabBar({ navigation }) {
  const tabs = [
    {
      route: routeNames.HOME,
      icon: (
        <House
          size={DEFAULT_ICON_SIZE}
          weight="fill"
          color="#9B6F9B"
        />
      ),
      label: 'Início',
    },
    {
      route: routeNames.USERS,
      icon: (
        <Users
          size={DEFAULT_ICON_SIZE}
          weight="light"
        />
      ),
      label: 'Dirigentes',
    },
    {
      route: routeNames.WEEK_DAYS,
      icon: (
        <CalendarBlank
          size={DEFAULT_ICON_SIZE}
          weight="light"
        />
      ),
      label: 'Dias',
    },
  ]

  const handleOnPress = (route: string) => navigation.navigate(route)

  return (
    <View
      style={tw`flex-row items-center justify-between absolute bottom-0 border-t-[0.5px] border-t-zinc-300 bg-zinc-100 w-full py-2 px-8`}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.route}
          onPress={() => handleOnPress(tab.route)}
          style={tw`flex-col items-center justify-center`}>
          {tab.icon}

          <Text
            style={tw.style(
              'text-xs',
              tab.route === routeNames.HOME && 'text-primary'
            )}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
