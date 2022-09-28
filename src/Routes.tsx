import routesNames from '@common/routesNames'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChooseTableType from '@screens/ChooseTableType'
import Home from '@screens/Home'
import HoursPerDay from '@screens/HoursPerDay'
import Table from '@screens/Table'
import Users from '@screens/Users'
import WeekDays from '@screens/WeekDays'
import React from 'react'

const Stack = createNativeStackNavigator()

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={routesNames.HOME}
        defaultScreenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name={routesNames.HOME}
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={routesNames.USERS}
          component={Users}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={routesNames.WEEK_DAYS}
          component={WeekDays}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={routesNames.HOURS_PER_DAY}
          component={HoursPerDay}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={routesNames.CHOOSE_TABLE_TYPE}
          component={ChooseTableType}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={routesNames.TABLE}
          component={Table}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
