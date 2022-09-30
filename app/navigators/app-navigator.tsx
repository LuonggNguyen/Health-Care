/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from "react"
import { useColorScheme } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { navigationRef, useBackButtonHandler } from "./navigation-utilities"
import { LoginScreen, RegisterScreen } from "../screens"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { UserProfileScreen } from "../screens/UserProfile-screen"
import { UserBookingScreen } from "../screens/UserBooking-screen"
import { UserHealthScreen } from "../screens/UserHealth-screen"
import { DoctorProfileScreen } from "../screens/DoctorProfile-screen"
import { DoctorBookingScreen } from "../screens/DoctorBooking-screen"
import { DoctorHealthScreen } from "../screens/DoctorHealth-screen"
import auth from "@react-native-firebase/auth"

export type NavigatorParamList = {
  // 🔥 Your screens go here
  login: undefined
  register: undefined

  //role
  user: undefined
  doctor: undefined

  //profile
  userProfile: undefined
  doctorProfile: undefined

  //updateProfile
  userUpdateProfile: undefined
  doctorUpdateProfile: undefined

  //booking
  userBooking: undefined
  doctorBooking: undefined

  //health news
  userHealth: undefined
  doctorHealth: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

const AppStack = () => {
  const user = auth().currentUser

  const Tab = createBottomTabNavigator()

  function UserTabs() {
    return (
      <Tab.Navigator initialRouteName="userHealth">
        <Tab.Screen name="userHealth" component={UserHealthScreen} />
        <Tab.Screen name="userBooking" component={UserBookingScreen} />
        <Tab.Screen name="userProfile" component={UserProfileScreen} />
      </Tab.Navigator>
    )
  }

  function DoctorTabs() {
    return (
      <Tab.Navigator initialRouteName="doctorHealth">
        <Tab.Screen name="doctorHealth" component={DoctorHealthScreen} />
        <Tab.Screen name="doctorBooking" component={DoctorBookingScreen} />
        <Tab.Screen name="doctorProfile" component={DoctorProfileScreen} />
      </Tab.Navigator>
    )
  }
  const checkRole = () => {
    if (user.email.search("@doctor") == -1) {
      console.log("nav role user")
      return "user"
    } else {
      console.log("nav role doctor")
      return "doctor"
    }
  }
  console.log("user: ", user)

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={!user ? "login" : checkRole()}
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="user" component={UserTabs} />
      <Stack.Screen name="doctor" component={DoctorTabs} />
      {/** 🔥 Your screens go here */}
    </Stack.Navigator>
  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()
  useBackButtonHandler(canExit)
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
