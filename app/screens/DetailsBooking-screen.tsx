import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { StyleSheet, Text, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { database } from "../../configs/firebase"
import { Button } from "@rneui/themed"

export const DetailsBookingScreen: FC<StackScreenProps<NavigatorParamList, "detailsBooking">> =
  observer(function DetailsBookingScreen({ navigation, route }) {
    const { booking } = route.params

    const handleCancel = () => {
      database.ref("/books/" + booking.idBook).update({
        idUser: booking.idUser,
        idDoctor: booking.idDoctor,
        nameDoctor: booking.nameDoctor,
        date: booking.date,
        workingTime: booking.workingTime, // have 1, 2, 3, 4
        status: 3,
      })
      console.log("cancel ")
    }

    return (
      <View style={styles.container}>
        <MyHeader title="Details Booking" onPress={() => navigation.goBack()}></MyHeader>
        <View style={styles.content}>
          <Text>{booking.idDoctor}</Text>
          <Text>{booking.idUser}</Text>
          <Text>{booking.date}</Text>
          <Text>{booking.workingTime}</Text>
          <Button title={"Cancel"} onPress={() => handleCancel()} />
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
