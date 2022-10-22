import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Alert, StyleSheet, Text, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { Button, ButtonGroup, Dialog, Image, Input } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import Ionicons from "react-native-vector-icons/Ionicons"
import DatePicker from "react-native-date-picker"
import moment from "moment"

export const DetailsDoctorScreen: FC<StackScreenProps<NavigatorParamList, "detailsDoctor">> =
  observer(function DetailsDoctorScreen({ route, navigation }) {
    const { doctor } = route.params
    const [checkBooking, setCheckBooking] = useState<Booking>()
    const [loading, setLoading] = useState(false)
    const user = firebase.auth().currentUser
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [day, setDay] = useState(moment(date).format("DD/MM/yyyy"))
    const [shift, setShift] = useState(0)

    useEffect(() => {
      database.ref("/books").on("value", (snapshot) => {
        try {
          const myList: Booking[] = Object.values(snapshot.val())
          setCheckBooking(
            myList.find(
              (it) =>
                it.idDoctor === doctor.uid &&
                it.date === day &&
                it.workingTime === shift + 1 &&
                it.status === 1,
            ),
          )
        } catch (error) {
          console.log(error)
        }
      })
      return () => {
        setCheckBooking(null)
      }
    }, [day, shift])
    const isInTheFuture = (date) => {
      const today = new Date()
      const [day, month, year] = date.split("/")
      const time = new Date(+year, +month - 1, +day + 1)
      today.setHours(23, 59, 59, 998)
      today.setDate(today.getDate() + 1)
      return time > today
    }
    const Booking = (d, t) => {
      if (!isInTheFuture(d)) {
        Alert.alert("Vui long dat lich o tuong lai")
      } else if (checkBooking) {
        Alert.alert("Ca nay bac si da co lich vui long cho ca khac")
      } else {
        setLoading(true)
        database
          .ref("/books")
          .push()
          .set({
            idUser: user.uid,
            idDoctor: doctor.uid,
            nameDoctor: doctor.name,
            date: d,
            workingTime: t, // have 1, 2, 3, 4
            status: 1,
            // da kham + lich kham da huy => false
          })

          .then(() => {
            setLoading(false)
            Alert.alert("Booking Successfully !!")
          })
      }
    }

    const getAge = (dateString) => {
      if (!dateString) {
        return 0
      } else {
        var today = new Date()
        const [day, month, year] = dateString.split("/")
        const time = new Date(+year, +month - 1, +day)
        var birthDate = new Date(time)
        var age = today.getFullYear() - birthDate.getFullYear()
        var m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        return age
      }
    }
    if (loading) {
      return (
        <View style={styles.container}>
          <MyHeader title="Details Doctor" onPress={() => navigation.goBack()} />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Dialog.Loading />
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <MyHeader title="Details Doctor" onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <View style={{ flex: 1, backgroundColor: "#ccc" }}>
            <Image style={{ width: 150, height: 150 }} source={{ uri: doctor?.photoUrl }} />
            <Text>Name: {doctor.name}</Text>
            <Text>Mail: {doctor.email}</Text>
            <Text>Phone: {doctor.phoneNumber}</Text>
            <Text>Department: {doctor.department}</Text>
            <Text>Years of experience : {getAge(doctor.dayStartWork)}</Text>
          </View>
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
              setShift(value)
            }}
            containerStyle={{ marginBottom: 20 }}
          />
          <Button title={"Book Doctor"} onPress={() => Booking(day, shift + 1)} />
          <DatePicker
            // minimumDate={}
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
