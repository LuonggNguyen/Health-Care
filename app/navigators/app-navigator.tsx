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
import {
  AdminScreen,
  ArticleScreen,
  DoctorDetailBookingScreen,
  LoginScreen,
  PostArticlesScreen,
  RegisterScreen,
} from "../screens"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { UserProfileScreen } from "../screens/UserProfile-screen"
import { UserBookingScreen } from "../screens/UserBooking-screen"
import { UserHealthScreen } from "../screens/UserHealth-screen"
import { DoctorProfileScreen } from "../screens/DoctorProfile-screen"
import { DoctorBookingScreen } from "../screens/DoctorBooking-screen"
import { DoctorHealthScreen } from "../screens/DoctorHealth-screen"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import auth from "@react-native-firebase/auth"
import { UserUpdateProfileScreen } from "../screens/UserUpdateProfile-screen"
import { DoctorUpdateProfileScreen } from "../screens/DoctorUpdateProfile-screen"
import { ListDoctorsScreen } from "../screens/ListDoctors-screen"
import { DetailsDoctorScreen } from "../screens/DetailsDoctor-screen"
import { DetailsBookingScreen } from "../screens/DetailsBooking-screen"
import { UserCancelScreen } from "../screens/UserCancel-screen"
import { DetailsArticleScreen } from "../screens/DetailsArticle-screen"
import { color } from "../theme"

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
  userUpdateProfile: {
    detailsUser: InfoUser
  }
  doctorUpdateProfile: {
    detailsDoctor
  }

  //booking
  userCancel: undefined
  userBooking: undefined
  doctorBooking: undefined
  listDoctors: undefined
  detailsDoctor: {
    doctor: InfoDoctor
  }
  detailsBooking: {
    booking: Booking
  }

  //post
  postArticle: {
    post: PostArticle
  }
  article: undefined
  detailsArticle: {
    post: PostArticle
  }

  //health news
  userHealth: undefined
  doctorHealth: undefined
  doctorDetailBooking: {
    booking: Booking
  }
  admin: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

const AppStack = () => {
  const user = auth().currentUser

  const Tab = createBottomTabNavigator()

  function UserTabs() {
    return (
      <Tab.Navigator
        initialRouteName="Health"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === "Health") {
              iconName = focused ? "heart-circle" : "heart-circle-outline"
            } else if (route.name === "Booking") {
              iconName = focused ? "list-circle" : "list-circle-outline"
            } else if (route.name === "Profile") {
              iconName = focused ? "account-circle" : "account-circle-outline"
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />
            }
            return <Ionicons name={iconName} size={size} color={color} />

            // You can return any component that you like here!
          },
          tabBarLabelStyle: { fontWeight: "bold" },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "black",
          tabBarStyle: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: "#f1f1f1",
          },
        })}
      >
        <Tab.Screen name="Health" component={UserHealthScreen} />
        <Tab.Screen name="Booking" component={UserBookingScreen} />
        <Tab.Screen name="Profile" component={UserProfileScreen} />
      </Tab.Navigator>
    )
  }

  function DoctorTabs() {
    return (
      <Tab.Navigator
        initialRouteName="Health"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === "Health") {
              iconName = focused ? "heart-circle" : "heart-circle-outline"
            } else if (route.name === "Booking") {
              iconName = focused ? "list-circle" : "list-circle-outline"
            } else if (route.name === "Profile") {
              iconName = focused ? "account-circle" : "account-circle-outline"
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />
            }
            return <Ionicons name={iconName} size={size} color={color} />

            // You can return any component that you like here!
          },
          tabBarLabelStyle: { fontWeight: "bold" },
          tabBarActiveTintColor: color.colorHeader,
          tabBarInactiveTintColor: "black",
          tabBarStyle: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: "#f1f1f1",
          },
        })}
      >
        <Tab.Screen name="Health" component={DoctorHealthScreen} />
        <Tab.Screen name="Booking" component={DoctorBookingScreen} />
        <Tab.Screen name="Profile" component={DoctorProfileScreen} />
      </Tab.Navigator>
    )
  }

  const checkRole = () => {
    if (user.email.search("@doctor") == -1 && user.email.search("@admin") == -1) {
      return "user"
    } else if (user.email.search("@doctor") != -1 && user.email.search("@doctor") == -1) {
      return "doctor"
    } else {
      return "admin"
    }
  }

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
      <Stack.Screen name="userUpdateProfile" component={UserUpdateProfileScreen} />
      <Stack.Screen name="doctorUpdateProfile" component={DoctorUpdateProfileScreen} />
      <Stack.Screen name="listDoctors" component={ListDoctorsScreen} />
      <Stack.Screen name="detailsDoctor" component={DetailsDoctorScreen} />
      <Stack.Screen name="detailsBooking" component={DetailsBookingScreen} />
      <Stack.Screen name="postArticle" component={PostArticlesScreen} />
      <Stack.Screen name="article" component={ArticleScreen} />
      <Stack.Screen name="userCancel" component={UserCancelScreen} />
      <Stack.Screen name="detailsArticle" component={DetailsArticleScreen} />
      <Stack.Screen name="doctorDetailBooking" component={DoctorDetailBookingScreen} />
      <Stack.Screen name="admin" component={AdminScreen} />

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
