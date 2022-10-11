import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Alert, StyleSheet, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { Button, ButtonGroup, Input } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import Ionicons from "react-native-vector-icons/Ionicons"
import DatePicker from "react-native-date-picker"
import moment from "moment"

export const DetailsDoctorScreen: FC<StackScreenProps<NavigatorParamList, "detailsDoctor">> =
  observer(function DetailsDoctorScreen({ route, navigation }) {
    const { idDoctor } = route.params
    const [listBook, setListBook] = useState<Booking[]>([])
    const [checkBooking, setCheckBooking] = useState<Booking>()
    const user = firebase.auth().currentUser
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [day, setDay] = useState(moment(date).format("DD/MM/yyyy"))
    const [shift, setShift] = useState(0)

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

    const isInTheFuture = (date) => {
      const today = new Date()
      today.setHours(23, 59, 59, 998)
      return date > today
    }
    const Booking = (date, workingTime) => {
      if (!isInTheFuture(new Date(date))) {
        Alert.alert("Vui long dat lich o tuong lai")
      } else if (checkBooking?.date == date && checkBooking?.workingTime == workingTime) {
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
          <Input
            placeholder="DD/MM/YYYY  ex: 05/10/2022"
            value={day}
            onChangeText={(e) => setDay(e)}
            rightIcon={
              <Ionicons name="calendar" size={24} color="#000" onPress={() => setOpen(true)} />
            }
          />
          <ButtonGroup
            buttons={["Sang", "Trua", "Chieu", "Toi"]}
            selectedIndex={shift}
            onPress={(value) => {
              console.log(value + 1)
              setShift(value)
            }}
            containerStyle={{ marginBottom: 20 }}
          />
          <Button title={"Book Doctor"} onPress={() => Booking(day, shift + 1)} />
          <DatePicker
            title="Select Day"
            mode="date"
            modal
            open={open}
            date={date}
            onConfirm={(date) => {
              setOpen(false)
              setDate(date)
              setDay(moment(date).format("DD/MM/yyyy"))
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
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
