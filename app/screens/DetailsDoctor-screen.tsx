import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Alert, StyleSheet, Text, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { ButtonGroup, Dialog, Image, Input } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import Ionicons from "react-native-vector-icons/Ionicons"
import DatePicker from "react-native-date-picker"
import moment from "moment"
import { CustomButton } from "../components/CustomButton"

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
        Alert.alert("Please book in the future !")
      } else if (checkBooking) {
        Alert.alert("Doctor has a schedule, please orther booking !")
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
            navigation.navigate("user")
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
          <View style={{ alignItems: "center" }}>
            <Image style={styles.imgDoctor} source={{ uri: doctor?.photoUrl }} />
            <Text style={styles.textInfo}>Doctor: {doctor.name}</Text>
            <Text style={styles.textInfo}>Mail: {doctor.email}</Text>
            <Text style={styles.textInfo}>Phone: {doctor.phoneNumber}</Text>
            <Text style={styles.textInfo}>Department: {doctor.department}</Text>
            <Text style={styles.textInfo}>Years of experience : {getAge(doctor.dayStartWork)}</Text>
          </View>
          {!isInTheFuture(day) ? (
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#f1c232" }}>
                Please book in the future
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Text style={checkBooking ? styles.notBooking : styles.isBooking}>
                {checkBooking ? "Doctor has a schedule" : "You can booking doctor"}
              </Text>
            </View>
          )}

          <Input
            placeholder="DD/MM/YYYY  ex: 05/10/2022"
            value={day}
            onChangeText={(e) => setDay(e)}
            rightIcon={
              <Ionicons name="calendar" size={24} color="#000" onPress={() => setOpen(true)} />
            }
            inputContainerStyle={{ borderWidth: 1, borderRadius: 16, paddingHorizontal: 8 }}
          />
          <ButtonGroup
            buttons={["8h-10h", "11h-13h", "14h-16h", "17h-19h"]}
            selectedIndex={shift}
            onPress={(value) => {
              setShift(value)
            }}
            containerStyle={{ marginBottom: 20 }}
          />
          <CustomButton title={"Book Doctor"} onPress={() => Booking(day, shift + 1)} />
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
          <View />
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
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  imgDoctor: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  textInfo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  isBooking: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  notBooking: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
  },
})
