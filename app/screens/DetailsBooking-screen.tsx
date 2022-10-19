import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { StyleSheet, Text, View } from "react-native"
import { MyHeader } from "../components/MyHeader"

export const DetailsBookingScreen: FC<StackScreenProps<NavigatorParamList, "detailsBooking">> =
  observer(function DetailsBookingScreen({ navigation, route }) {
    const { booking } = route.params
    return (
      <View style={styles.container}>
        <MyHeader title="Details Booking" onPress={() => navigation.goBack()}></MyHeader>
        <View style={styles.content}>
          <Text>{booking.idDoctor}</Text>
          <Text>{booking.idUser}</Text>
          <Text>{booking.date}</Text>
          <Text>{booking.workingTime}</Text>
        </View>
      </View>
    )
  })

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})
