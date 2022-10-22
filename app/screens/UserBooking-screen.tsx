import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Header } from "@rneui/themed"
import { color } from "../theme"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { moderateScale } from "../utils/Scale/Scaling"

export const UserBookingScreen: FC<StackScreenProps<NavigatorParamList, "userBooking">> = observer(
  function UserBookingScreen({ navigation }) {
    const [listBook, setListBook] = useState<Booking[]>([])
    const user = firebase.auth().currentUser
    useEffect(() => {
      database.ref("/books").on("value", (snapshot) => {
        try {
          const listkey = Object.keys(snapshot.val())
          listkey.map((item) => {
            database.ref("/books/" + item).update({
              idBook: item,
            })
          })
          const myList: Booking[] = Object.values(snapshot.val())
          const newlist = myList.sort(function (a, b) {
            return b.workingTime - a.workingTime
          })
          const sortList = newlist.sort(function (a, b) {
            const [d1, m1, y1] = a.date.split("/")
            const [d2, m2, y2] = b.date.split("/")
            const date1 = new Date(+y1, +m1 - 1, +d1)
            const date2 = new Date(+y2, +m2 - 1, +d2)
            b.workingTime - a.workingTime
            return date2.getTime() - date1.getTime()
          })
          setListBook(sortList.filter((it) => it.idUser === user.uid))
        } catch (error) {
          console.log(error)
        }
      })
      return () => {
        setListBook([])
      }
    }, [])

    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>Booking</Text>}
          rightComponent={
            <MaterialIcons
              name="note-add"
              size={28}
              color="#000"
              onPress={() => navigation.navigate("listDoctors")}
            />
          }
        />
        <View style={styles.content}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={listBook}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("detailsBooking", { booking: item })}
                >
                  <View style={styles.item}>
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                      }}
                      source={{
                        uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Icons8_flat_todo_list.svg/768px-Icons8_flat_todo_list.svg.png",
                      }}
                    />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.name}>Doctor: {item.nameDoctor}</Text>
                      <Text style={styles.time}>Date: {item.date}</Text>
                      <Text style={styles.time}>Work shift: {item.workingTime}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
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
    width: "100%",
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  item: {
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: moderateScale(18),
    color: "black",
    fontWeight: "bold",
  },
  time: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
})
