import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { moderateScale, scale } from "../utils/Scale/Scaling"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import { MyHeader } from "../components/MyHeader"
import { Text } from "@rneui/themed"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

export const UserCancelScreen: FC<StackScreenProps<NavigatorParamList, "userCancel">> = observer(
  function UserCancelScreen({ navigation }) {
    const [listBook, setListBook] = useState<Booking[]>([])
    const user = firebase.auth().currentUser
    useEffect(() => {
      database.ref("/books").on("value", (snapshot) => {
        // console.log(snapshot.val())
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
          setListBook(sortList.filter((it) => it.idUser === user.uid && it.status === 3))
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
        <MyHeader title="Cancel" onPress={() => navigation.goBack()} />
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
                    <MaterialIcons name="list-alt" size={scale(50)} color="#000" />

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
    padding: 4,
  },
  time: {
    fontSize: 16,
    color: "black",
    padding: 4,
    // fontWeight: "bold",
  },
})
