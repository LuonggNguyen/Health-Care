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
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import AntDesign from "react-native-vector-icons/AntDesign"

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
            workingTime: t,
            status: 1,
          })

          .then(() => {
            setLoading(false)
            navigation.navigate("user")
            Alert.alert("Booking Successfully !!")
          })
      }
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
        return "17:00h - 19:00h"
      }
      return "--:--"
    }
    const getStatus = () => {
      if (!isInTheFuture(day)) {
        return (
          <Text style={{ fontWeight: "bold", fontSize: moderateScale(20), color: "gray" }}>
            !Future
          </Text>
        )
      } else {
        if (checkBooking) {
          return (
            <Text style={{ fontWeight: "bold", fontSize: moderateScale(20), color: "red" }}>
              Busy
            </Text>
          )
        } else {
          return (
            <Text style={{ fontWeight: "bold", fontSize: moderateScale(20), color: "green" }}>
              Free
            </Text>
          )
        }
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
          <View style={styles.infoDoctor}>
            <Image style={styles.imgDoctor} source={{ uri: doctor.photoUrl }} />
            <View style={{ justifyContent: "space-evenly", height: verticleScale(120) }}>
              <Text style={styles.nameDoctor}>{doctor.name}</Text>
              <Text style={{ fontSize: moderateScale(16) }}>{doctor.department}</Text>
              <Text style={{ fontWeight: "bold", fontSize: moderateScale(16) }}>Poly Hospital</Text>
            </View>
            <View style={{ width: scale(0) }} />
          </View>
          <View style={styles.infoDoctor}>
            <View style={styles.rateAndExp}>
              <View style={styles.icon}>
                <AntDesign name="star" size={24} color="gold" />
              </View>
              <View style={styles.infoRateAndExp}>
                <Text style={styles.soccer}>4.5</Text>
                <Text>Ratings</Text>
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
                <Text style={styles.soccer}>{getYear(doctor.dayStartWork)} years</Text>
                <Text>Experience</Text>
              </View>
            </View>
          </View>
          <View style={styles.timeAndStatus}>
            <View style={styles.statusBooking}>
              <Text>Status</Text>
              {getStatus()}
            </View>
            <View style={styles.timeBooking}>
              <Text style={{ fontSize: moderateScale(19) }}>Time</Text>
              <Text style={{ fontSize: moderateScale(18), color: "#000" }}>
                <AntDesign name="clockcircleo" size={moderateScale(18)} color="#000" />{" "}
                {getWorkShift(shift + 1)}
              </Text>
            </View>
          </View>
          <View style={styles.contact}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="mail" color={"blue"} size={24} />
              <Text
                style={{
                  fontSize: moderateScale(18),
                  color: "#000",
                  marginLeft: scale(20),
                }}
              >
                {doctor.email}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="call" color={"green"} size={24} />
              <Text
                style={{
                  fontSize: moderateScale(18),
                  color: "#000",
                  marginLeft: scale(20),
                }}
              >
                {doctor.phoneNumber}
              </Text>
            </View>
          </View>

          <View style={styles.booking}>
            <Input
              placeholder="DD/MM/YYYY  ex: 05/10/2022"
              value={day}
              onChangeText={(e) => setDay(e)}
              rightIcon={
                <Ionicons name="calendar" size={24} color="#000" onPress={() => setOpen(true)} />
              }
              inputContainerStyle={{
                borderWidth: 1,
                borderRadius: 16,
                paddingHorizontal: 8,
                marginTop: 16,
              }}
            />
            <ButtonGroup
              buttons={["8h-10h", "11h-13h", "14h-16h", "17h-19h"]}
              selectedIndex={shift}
              onPress={(value) => {
                setShift(value)
              }}
              containerStyle={{ borderRadius: 16, borderWidth: 0, marginBottom: 24 }}
              buttonContainerStyle={{
                borderRadius: 8,
                margin: 4,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
              selectedButtonStyle={{
                borderRadius: 8,
              }}
            />
            <CustomButton title={"Book Doctor"} onPress={() => Booking(day, shift + 1)} />
          </View>
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
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  infoDoctor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: scale(16),
  },
  imgDoctor: {
    borderRadius: scale(16),
    width: scale(130),
    height: verticleScale(130),
    resizeMode: "contain",
    marginHorizontal: scale(8),
  },
  nameDoctor: {
    fontWeight: "bold",
    fontSize: moderateScale(22),
    color: "#000",
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
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4,
    elevation: 8,
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
  timeAndStatus: {
    paddingVertical: 16,
    flexDirection: "row",
    height: verticleScale(100),
    borderRadius: scale(16),
    backgroundColor: "#fff",
    marginHorizontal: scale(12),
    marginVertical: scale(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.55,
    shadowRadius: 2,
    elevation: 8,
  },
  statusBooking: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  timeBooking: {
    flex: 3,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  contact: {
    justifyContent: "space-evenly",
    height: verticleScale(100),
    borderRadius: scale(16),
    backgroundColor: "#fff",
    marginHorizontal: scale(12),
    marginVertical: scale(8),
    paddingHorizontal: scale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.55,
    shadowRadius: 2,
    elevation: 8,
  },
  booking: {
    alignItems: "center",
    justifyContent: "space-around",
  },
})
