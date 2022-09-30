import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"

export const DoctorBookingScreen: FC<StackScreenProps<NavigatorParamList, "doctorBooking">> =
  observer(function DoctorBookingScreen() {
    return <View></View>
  })
