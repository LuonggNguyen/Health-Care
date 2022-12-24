import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { StyleSheet, Text, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { database } from "../../configs/firebase"
import { Dialog, Image } from "@rneui/themed"
import { CustomButton } from "../components/CustomButton"
import AntDesign from "react-native-vector-icons/AntDesign"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"

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

    const getYear = (dateString) => {
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
    const getStatus = (s, d) => {
      if (s == 1 && getYear(d) < 0) {
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
              <View>
                <Text style={[styles.textInfo]}>{infoDoctor.name}</Text>
                <Text style={{ color: "#000", paddingBottom: 4 }}>{infoDoctor.department}</Text>
                <Text style={{ fontWeight: "bold", fontSize: moderateScale(16) }}>
                  Poly Hospital
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.infoBooking}>
            <View style={styles.infoDoctor}>
              <View style={styles.rateAndExp}>
                <View style={styles.icon}>
                  <AntDesign name="star" size={24} color="gold" />
                </View>
                <View style={styles.infoRateAndExp}>
                  <Text>Ratings</Text>
                  <Text style={styles.soccer}>3.5</Text>
                </View>
              </View>
              <View style={styles.rateAndExp}>
                <View style={styles.icon}>
                  <Image
                    style={{ width: 30, height: 30, resizeMode: "contain" }}
                    source={{
                      uri: "https://cdn.pixabay.com/photo/2020/05/01/18/59/stethoscope-5118688_960_720.png",
                    }}
                  />
                </View>
                <View style={styles.infoRateAndExp}>
                  <Text>Experience</Text>
                  <Text style={styles.soccer}>{getYear(infoDoctor.dayStartWork) + " Year"}</Text>
                </View>
              </View>
            </View>
            <View style={styles.boxTime}>
              <View>
                <Text
                  style={{ fontSize: moderateScale(20), alignSelf: "center", paddingBottom: 8 }}
                >
                  Status
                </Text>
                <Text
                  style={
                    getStatus(booking.status, booking.date) === "Unfinished"
                      ? { fontSize: moderateScale(18), color: "#8fce00", fontWeight: "bold" }
                      : getStatus(booking.status, booking.date) === "In the past"
                      ? { fontSize: moderateScale(18), color: "#888", fontWeight: "bold" }
                      : { fontSize: moderateScale(18), color: "red", fontWeight: "bold" }
                  }
                >
                  <AntDesign
                    name={
                      getStatus(booking.status, booking.date) === "Unfinished"
                        ? "questioncircle"
                        : "closecircle"
                    }
                    size={18}
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
              <View>
                <Text
                  style={{ fontSize: moderateScale(18), alignSelf: "center", paddingBottom: 8 }}
                >
                  Date
                </Text>
                <Text style={{ fontSize: moderateScale(16), color: "#333", fontWeight: "bold" }}>
                  <AntDesign name="calendar" size={16} color="#333" /> {" " + booking.date}
                </Text>
              </View>
            </View>
            <View style={styles.boxTime}>
              {/* <View></View> */}
              <View>
                <Text
                  style={{ fontSize: moderateScale(18), alignSelf: "center", paddingBottom: 8 }}
                >
                  Time
                </Text>
                <Text style={{ fontSize: 18, color: "#333", fontWeight: "bold" }}>
                  <AntDesign name="clockcircleo" size={moderateScale(18)} color="#333" />
                  {" " + getWorkShift(booking.workingTime)}
                </Text>
              </View>
            </View>
            <View style={styles.boxTime}>
              {/* <View></View> */}
              <View>
                <Text style={styles.textInfoSmall}>Mail: {infoDoctor.email}</Text>
                <Text style={styles.textInfoSmall}>Phone: {infoDoctor.phoneNumber}</Text>
              </View>
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
    // backgroundColor: "#fffbe1",
  },
  cardDoctor: {
    // flex: 1,
    width: "95%",
    justifyContent: "space-around",
  },
  infoDoctor: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  infoBooking: {
    flex: 1,
    width: "95%",
    marginBottom: 8,
    alignItems: "center",
    // justifyContent: "space-around",
  },
  imgDoctor: {
    // margin: 8,
    width: scale(110),
    height: scale(110),
    resizeMode: "contain",
    borderWidth: 5,
    borderColor: "#f9f9f9",
    borderRadius: 16,
  },
  textInfo: {
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: "#000",
    paddingBottom: 4,
  },
  textInfoSmall: {
    color: "#000",
    fontSize: moderateScale(18),
    paddingVertical: 5,
    // fontWeight: "bold",
  },
  boxTime: {
    marginTop: 20,
    width: "90%",
    height: scale(90),
    // backgroundColor: "#1cc3",
    borderColor: "#cccc",
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  rateAndExp: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: scale(50),
    width: scale(50),
    borderRadius: scale(16),
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoRateAndExp: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scale(16),
    height: verticleScale(60),
  },
  soccer: {
    color: "#000",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
})
