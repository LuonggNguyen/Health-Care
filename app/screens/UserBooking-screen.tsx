import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Button, Header } from "@rneui/themed"
import { color } from "../theme"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
export const UserBookingScreen: FC<StackScreenProps<NavigatorParamList, "userBooking">> = observer(
  function UserBookingScreen({ navigation }) {
    const [listBook, setListBook] = useState<Booking[]>([])
    const user = firebase.auth().currentUser
    useEffect(() => {
      database.ref("/books").on("value", (snapshot) => {
        try {
          const myList: Booking[] = Object.values(snapshot.val())
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
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>Booking</Text>}
        />
        <View style={styles.content}>
          <FlatList
            data={listBook}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onPress={() => console.log("Phieu Kham")}>
                  <View style={styles.item}>
                    <Text style={styles.name}>{item.date}</Text>
                    <Text style={styles.phone}>{item.idDoctor}</Text>
                    <Text style={styles.phone}>{item.workingTime}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
          <Button title={"booking"} onPress={() => navigation.navigate("listDoctors")} />
        </View>
      </View>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
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
