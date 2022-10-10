import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Button, Header } from "@rneui/themed"
import { color } from "../theme"
export const UserBookingScreen: FC<StackScreenProps<NavigatorParamList, "userBooking">> = observer(
  function UserBookingScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>Booking</Text>}
        />
        <View style={styles.content}>
          <Button title={"booking"} onPress={() => navigation.navigate("listDoctors")} />
        </View>
      </View>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
})
