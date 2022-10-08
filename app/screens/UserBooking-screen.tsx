import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import { verticleScale } from "../utils/Scale/Scaling"
import { format } from "validate.js"
import moment from "moment"

const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height
export const UserBookingScreen: FC<StackScreenProps<NavigatorParamList, "userBooking">> = observer(
  function UserBookingScreen() {
    var date = moment().utcOffset("+05:30").format("DD/MM/yyyy")
    console.log(date)

    var array
    const [list, setList] = useState([])
    var listDoctor

    useEffect(() => {
      database
        .ref("/doctors")
        .once("value")
        .then((snapshot) => {
          // Object.keys(snapshot.val()).forEach((key) => {
          //   array.push({ [key]: snapshot.val()[key] })
          // })
          setList(snapshot.val())
        })
      return () => {
        setList([])
      }
    }, [])
    array = Object.values(list)
    const Item = ({ name, phoneNumber, gender, email, dayStartWork }) => (
      <View style={styles.item}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phone}>{phoneNumber}</Text>
        <Text style={styles.phone}>{(gender = true ? "Nam" : "Nữ")}</Text>
        <Text style={styles.phone}>{email}</Text>
        <Text style={styles.phone}>{dayStartWork}</Text>
      </View>
    )
    const renderItem = ({ item }) => (
      <Item
        name={item.name}
        phoneNumber={item.phoneNumber}
        gender={item.gender}
        email={item.email}
        dayStartWork={item.dayStartWork}
      />
    )

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>List</Text>
        <FlatList style={styles.flatList} data={array} renderItem={renderItem} />
      </SafeAreaView>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: verticleScale(50),
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "red",
    fontWeight: "bold",
  },
  flatList: {
    width: Width,
    height: Height,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  phone: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
})
