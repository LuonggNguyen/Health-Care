import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, View, Text, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { MyHeader } from "../../components/MyHeader"
import { moderateScale, scale, verticleScale } from "../../utils/Scale/Scaling"
import { database } from "../../../configs/firebase"
import { Dialog, Image } from "@rneui/themed"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import AntDesign from "react-native-vector-icons/AntDesign"
const windowWidth = Dimensions.get("window").width
export const DoctorDetailBookingScreen: FC<
  StackScreenProps<NavigatorParamList, "doctorDetailBooking">
> = observer(function DoctorDetailBookingScreen({ navigation, route }) {
  const { booking } = route.params
  const [infoUser, setInfoUser] = useState<InfoUser>()
  useEffect(() => {
    database.ref("/users/" + booking.idUser).on("value", (snapshot) => {
      setInfoUser(snapshot.val())
    })
    return () => {
      setInfoUser(undefined)
    }
  }, [])

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
  if (!infoUser) {
    return (
      <View style={styles.container}>
        <MyHeader title="Details Patient" onPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Dialog.Loading />
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <MyHeader title="Details Patient" onPress={() => navigation.goBack()}></MyHeader>
      <View style={styles.content}>
        <View style={styles.cardUser}>
          <View style={styles.infoUser}>
            <Image style={styles.imgUser} source={{ uri: infoUser.photoUrl }} />
            <View style={{ justifyContent: "space-around" }}>
              <Text style={[styles.textInfo]}>{infoUser.name}</Text>
              <Text style={{ color: "#000", paddingBottom: 4 }}>{infoUser.phoneNumber}</Text>
              <Text style={{ fontWeight: "bold", fontSize: moderateScale(16) }}>
                {infoUser?.gender ? "Male" : "Female"} - {getAge(infoUser.birthday).toString()}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.boxHealth}>
            <View style={styles.blood}>
              <Text style={styles.titleBlood}>Blood Pressure</Text>
              <Text style={styles.textBlood}>{infoUser?.bloodPressure}</Text>
            </View>
            <View style={styles.heart}>
              <Text style={styles.titleBlood}>Heart Beat</Text>
              <View style={styles.rowHeartbeat}>
                <FontAwesome name="heartbeat" color={"white"} size={scale(20)}></FontAwesome>
                <Text style={styles.textBlood}>{infoUser?.heartbeat}</Text>
              </View>
              <Text style={{ color: "white", fontSize: moderateScale(12), marginTop: 10 }}>
                Normal Heart Rate
              </Text>
            </View>
          </View>
          <View style={styles.boxHealth}>
            <View style={styles.blood}>
              <Text style={styles.titleBlood}>Weight</Text>
              <Text style={styles.textBlood}>
                {infoUser?.weight}
                {" Kg"}
              </Text>
              <Text style={{ color: "white", fontSize: moderateScale(12), marginTop: 10 }}>
                {infoUser?.weight > 40 ? "Weight Normal" : "Weight Too Low"}
              </Text>
            </View>
            <View style={styles.heart}>
              <Text style={styles.titleBlood}>Height</Text>
              <View style={styles.rowHeartbeat}>
                <FontAwesome name="male" color={"white"} size={scale(20)}></FontAwesome>
                <Text style={styles.textBlood}>{infoUser?.height}</Text>
              </View>
              <Text style={{ color: "white", fontSize: moderateScale(12), marginTop: 10 }}>
                Normal Heart Rate
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.boxTime}>
          <View>
            <Text style={{ fontSize: moderateScale(20), alignSelf: "center", paddingBottom: 8 }}>
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
            <Text style={{ fontSize: moderateScale(18), alignSelf: "center", paddingBottom: 8 }}>
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
            <Text style={{ fontSize: moderateScale(18), alignSelf: "center", paddingBottom: 8 }}>
              Time
            </Text>
            <Text style={{ fontSize: 18, color: "#333", fontWeight: "bold" }}>
              <AntDesign name="clockcircleo" size={moderateScale(18)} color="#333" />
              {" " + getWorkShift(booking.workingTime)}
            </Text>
          </View>
        </View>
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
    justifyContent: "space-evenly",
  },
  cardUser: {
    width: "95%",
    justifyContent: "space-around",
  },
  infoUser: {
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
  },
  imgUser: {
    width: scale(110),
    height: scale(110),
    resizeMode: "contain",
    borderWidth: 5,
    borderColor: "#f9f9f9",
    borderRadius: 16,
  },
  textInfo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    paddingBottom: 4,
  },
  textInfoSmall: {
    color: "#000",
    fontSize: moderateScale(18),
    paddingVertical: 5,
  },
  boxTime: {
    marginTop: 20,
    width: "90%",
    height: scale(90),
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
  boxHealth: {
    flexDirection: "row",
    height: 180,
    width: windowWidth,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  blood: {
    width: scale(130),
    height: scale(130),
    backgroundColor: "#4ea9fd",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  heart: {
    width: scale(130),
    height: scale(130),
    backgroundColor: "#4ea9fd",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlood: {
    fontSize: moderateScale(16),
    color: "#ffff",
    marginBottom: 10,
    fontWeight: "600",
  },
  textBlood: {
    fontSize: moderateScale(20),
    color: "#ffff",
    fontWeight: "900",
    marginLeft: scale(5),
  },
  rowHeartbeat: {
    flexDirection: "row",
    alignItems: "center",
  },
})
