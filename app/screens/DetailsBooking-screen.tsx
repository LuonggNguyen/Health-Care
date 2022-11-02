import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { database } from "../../configs/firebase"
import { Dialog, Image } from "@rneui/themed"
import { CustomButton } from "../components/CustomButton"

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
      console.log("cancel ")
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
          <View style={{ flex: 2, backgroundColor: "#000", width: "95%" }}></View>
          <View style={{ flex: 3, backgroundColor: "#ccc", width: "95%" }}></View>
          {/* <View style={{ alignItems: "center" }}>
            <Image style={styles.imgDoctor} source={{ uri: infoDoctor.photoUrl }} />
            <Text style={styles.textInfo}>{infoDoctor.name}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#000" }}>{infoDoctor.department}</Text>
              <Text style={{ color: "#000" }}> - {getAge(infoDoctor.dayStartWork)} YoE+</Text>
            </View>
          </View>

          <View style={{ marginVertical: 30 }}>
            <View style={styles.boxInfo}>
              <Text
                style={[
                  styles.textInfo,
                  { alignSelf: "center", color: "#fff", fontStyle: "normal" },
                ]}
              >
                Infomation
              </Text>
              <Text style={styles.textInfoBig}>Date: {booking.date}</Text>
              <Text style={styles.textInfoBig}>
                Work Shift: {getWorkShift(booking.workingTime)}
              </Text>
            </View>
            <View style={styles.boxContact}>
              <Text
                style={[
                  styles.textInfo,
                  { alignSelf: "center", color: "#fff", fontStyle: "normal" },
                ]}
              >
                Contact
              </Text>
              <Text style={styles.textInfoSmall}>Mail: {infoDoctor.email}</Text>
              <Text style={styles.textInfoSmall}>Phone: {infoDoctor.phoneNumber}</Text>
            </View>
          </View> */}
          <CustomButton title={"Cancel"} onPress={() => handleCancel()} />
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
  },
  imgDoctor: {
    margin: 8,
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  textInfo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    fontStyle: "italic",
  },
  textInfoSmall: {
    color: "#f1f1f1",
    paddingHorizontal: 4,
    fontSize: 16,
  },
  textInfoBig: {
    color: "#f1f1f1",
    paddingHorizontal: 4,
    fontSize: 32,
  },
  boxInfo: {
    alignItems: "center",
    margin: 8,
    paddingVertical: 8,
    backgroundColor: "#4ea9fd",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4.84,
    elevation: 8,
  },
  boxContact: {
    margin: 8,
    alignSelf: "center",
    width: 190,
    marginHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: "#4ea9fd",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4.84,
    elevation: 8,
  },
})
