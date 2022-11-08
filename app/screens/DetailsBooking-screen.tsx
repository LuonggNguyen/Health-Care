import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { database } from "../../configs/firebase"
import { Dialog, Image } from "@rneui/themed"
import { CustomButton } from "../components/CustomButton"
import AntDesign from "react-native-vector-icons/AntDesign"
import { scale } from "../utils/Scale/Scaling"

export const DetailsBookingScreen: FC<StackScreenProps<NavigatorParamList, "detailsBooking">> =
  observer(function DetailsBookingScreen({ navigation, route }) {
    const { booking } = route.params
    const [infoDoctor, setInfoDoctor] = useState<InfoDoctor>()
    useEffect(() => {
      database.ref("/doctors/" + booking.idDoctor).on("value", (snapshot) => {
        setInfoDoctor(snapshot.val())
      })
      return () => {
        setInfoDoctor(undefined)
      }
    }, [])
    const handleCancel = () => {
      database.ref("/books/" + booking.idBook).update({
        idUser: booking.idUser,
        idDoctor: booking.idDoctor,
        nameDoctor: booking.nameDoctor,
        date: booking.date,
        workingTime: booking.workingTime, // have 1, 2, 3, 4
        status: 3,
      })
      navigation.goBack()
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
    const getWorkShift = (w) => {
      if (w == 1) {
        return "08:00h - 10:00h"
      }
      if (w == 2) {
        return "11:00h - 13:00h"
      }
      if (w == 3) {
        return "14:00h - 16:00h"
      }
      if (w == 4) {
        return "15:00h - 17:00h"
      }
      return "--:--"
    }
    const getStatus = (s, d) => {
      if (s == 1 && getAge(d) < 0) {
        return "Unfinished"
      }
      if (s == 2) {
        return "In the past"
      }
      if (s == 3) {
        return "Canceled"
      }
      return "In the past"
    }
    if (!infoDoctor) {
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
        <MyHeader title="Details Booking" onPress={() => navigation.goBack()}></MyHeader>
        <View style={styles.content}>
          <View style={styles.cardDoctor}>
            <View style={styles.infoDoctor}>
              <Image style={styles.imgDoctor} source={{ uri: infoDoctor.photoUrl }} />
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-around",
                  height: 200,
                }}
              >
                <View>
                  <Text style={[styles.textInfo, { marginTop: 16 }]}>{infoDoctor.name}</Text>
                  <Text style={{ color: "#000" }}>{infoDoctor.department}</Text>
                  <Text style={styles.textInfoSmall}>Mail: {infoDoctor.email}</Text>
                  <Text style={styles.textInfoSmall}>Phone: {infoDoctor.phoneNumber}</Text>
                </View>
                <TouchableOpacity>
                  <View
                    style={{
                      height: 66,
                      width: 66,
                      backgroundColor: "#f9f9f9",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 16,
                      flexDirection: "row",
                    }}
                  >
                    <Text style={{ fontSize: 20, color: "#000", fontWeight: "bold" }}>+1 </Text>
                    <AntDesign name="heart" size={24} color="red" />
                  </View>
                </TouchableOpacity>
                <View />
              </View>
            </View>
            <View style={styles.infoDoctor}>
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
                {"       " + getAge(infoDoctor.dayStartWork) + "\n Years exp"}
              </Text>
              <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>
                100 {""} <AntDesign name="heart" size={20} color="#000" />
              </Text>
            </View>
          </View>
          <View style={styles.infoBooking}>
            <View style={styles.boxTime}>
              <Text style={{ fontSize: 32, color: "#333", fontWeight: "bold" }}>
                <AntDesign name="calendar" size={32} color="#333" /> {" " + booking.date}
              </Text>
            </View>
            <View style={styles.boxTime}>
              <Text style={{ fontSize: 32, color: "#333", fontWeight: "bold" }}>
                <AntDesign name="clockcircleo" size={32} color="#333" />
                {" " + getWorkShift(booking.workingTime)}
              </Text>
            </View>
            <View style={styles.boxTime}>
              <Text
                style={
                  getStatus(booking.status, booking.date) === "Unfinished"
                    ? { fontSize: 32, color: "#8fce00", fontWeight: "bold" }
                    : getStatus(booking.status, booking.date) === "In the past"
                    ? { fontSize: 32, color: "#888", fontWeight: "bold" }
                    : { fontSize: 32, color: "red", fontWeight: "bold" }
                }
              >
                <AntDesign
                  name={
                    getStatus(booking.status, booking.date) === "Unfinished"
                      ? "questioncircle"
                      : "closecircle"
                  }
                  size={32}
                  color={
                    getStatus(booking.status, booking.date) === "Unfinished"
                      ? "#8fce00"
                      : getStatus(booking.status, booking.date) === "In the past"
                      ? "#888"
                      : "red"
                  }
                />
                {" " + getStatus(booking.status, booking.date)}
              </Text>
            </View>
          </View>
          {getStatus(booking.status, booking.date) === "In the past" ? (
            <CustomButton
              title={"New Booking"}
              onPress={() => navigation.navigate("listDoctors")}
            />
          ) : getStatus(booking.status, booking.date) === "Unfinished" ? (
            <CustomButton title={"Cancel"} onPress={() => handleCancel()} />
          ) : (
            <View />
          )}
          <View style={{ marginVertical: 8 }} />
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
    alignItems: "center",
    backgroundColor: "#fffbe1",
  },
  cardDoctor: {
    flex: 1,
    width: "95%",
    backgroundColor: "#1cc3",
    borderRadius: 16,
    marginVertical: 8,
    justifyContent: "space-around",
  },
  infoDoctor: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  infoBooking: {
    flex: 1,
    width: "95%",
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  imgDoctor: {
    margin: 8,
    width: 150,
    height: 190,
    resizeMode: "contain",
    borderWidth: 5,
    borderColor: "#f9f9f9",
    borderRadius: 16,
  },
  textInfo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    fontStyle: "italic",
  },
  textInfoSmall: {
    color: "#000",
    paddingHorizontal: 4,
    fontSize: 16,
    fontWeight: "bold",
  },
  boxTime: {
    width: "90%",
    height: scale(90),
    backgroundColor: "#1cc3",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
})
