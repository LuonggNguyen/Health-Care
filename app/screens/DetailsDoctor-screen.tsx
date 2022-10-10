import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { StyleSheet, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { Button } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import moment from "moment"

export const DetailsDoctorScreen: FC<StackScreenProps<NavigatorParamList, "detailsDoctor">> =
  observer(function DetailsDoctorScreen({ route, navigation }) {
    const { idDoctor } = route.params
    const user = firebase.auth().currentUser
    var date = moment().utcOffset("+05:30").format("DD/MM/yyyy")
    const Booking = () => {
      database
        .ref("/books/")
        .push()
        .set({
          idUser: user.uid,
          idDoctor: idDoctor,
          date: date,
          workingTime: 1, // have 1, 2, 3, 4
        })
        .then(() => console.log("Successfully !!"))
    }

    return (
      <View style={styles.container}>
        <MyHeader title="Details Doctor" onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <Button title={"Book Doctor"} onPress={Booking} />
        </View>
      </View>
    )
  })
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
})
