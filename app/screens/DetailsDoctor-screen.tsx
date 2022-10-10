import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Alert, StyleSheet, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { Button, Input } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import moment from "moment"

export const DetailsDoctorScreen: FC<StackScreenProps<NavigatorParamList, "detailsDoctor">> =
  observer(function DetailsDoctorScreen({ route, navigation }) {
    const { idDoctor } = route.params
    const [listBook, setListBook] = useState<Booking[]>([])
    const [checkBooking, setCheckBooking] = useState<Booking>()
    const user = firebase.auth().currentUser
    var date = moment().utcOffset("+05:30").format("DD/MM/yyyy")
    const [ca, setCa] = useState("")
    const [ngay, setNgay] = useState(date)

    useEffect(() => {
      database.ref("/books").on("value", (snapshot) => {
        try {
          const myList: Booking[] = Object.values(snapshot.val())
          setCheckBooking(myList.find((it) => it.idDoctor === idDoctor))
          setListBook(myList.filter((it) => it.idUser === user.uid))
        } catch (error) {
          console.log(error)
        }
      })
      console.log(listBook)
      return () => {
        setListBook([])
      }
    }, [])
    const Booking = (date, workingTime) => {
      if (checkBooking?.date == "10/10/2022" && checkBooking?.workingTime == 1) {
        Alert.alert("Ca nay bac si da co lich vui long cho ca khac")
      } else {
        database
          .ref("/books")
          .push()
          .set({
            idUser: user.uid,
            idDoctor: idDoctor,
            date: date,
            workingTime: workingTime, // have 1, 2, 3, 4
          })
          .then(() => console.log("Successfully !!"))
      }
    }
    return (
      <View style={styles.container}>
        <MyHeader title="Details Doctor" onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <Input placeholder="nhap ngay" value={ngay} onChangeText={(e) => setNgay(e)} />
          <Input placeholder="nhap ca" value={ca} onChangeText={(e) => setCa(e)} />
          <Button title={"Book Doctor"} onPress={() => Booking(ngay, ca)} />
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
    width: "100%",
  },
})
