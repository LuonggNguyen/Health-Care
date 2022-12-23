import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Header } from "@rneui/themed"
import { color } from "../theme"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { moderateScale, scale } from "../utils/Scale/Scaling"
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu"

export const UserBookingScreen: FC<StackScreenProps<NavigatorParamList, "userBooking">> = observer(
  function UserBookingScreen({ navigation }) {
    const [listBook, setListBook] = useState<Booking[]>([])
    const [visible, setVisible] = useState(false)
    const hideMenu = () => setVisible(false)
    const showMenu = () => setVisible(true)
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
          setListBook(sortList.filter((it) => it.idUser === user.uid && it.status === 1))
        } catch (error) {
          console.log(error)
        }
      })
      return () => {
        setListBook(undefined)
      }
    }, [])
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

    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>Booking</Text>}
          rightComponent={
            <Menu
              visible={visible}
              anchor={
                // <Text onPress={showMenu}>Show menu</Text>
                <MaterialIcons name="more-vert" size={28} color="#fff" onPress={showMenu} />
              }
              onRequestClose={hideMenu}
            >
              <MenuItem
                onPress={() => {
                  setVisible(false)
                  navigation.navigate("listDoctors")
                }}
              >
                New Book
              </MenuItem>
              <MenuItem
                onPress={() => {
                  setVisible(false)
                  navigation.navigate("userCancel")
                }}
              >
                List Cancel
              </MenuItem>
              <MenuItem onPress={() => {}}>List Successful</MenuItem>
              <MenuDivider />
            </Menu>
          }
          // leftComponent={
          //   <MaterialCommunityIcons
          //     name="playlist-remove"
          //     size={36}
          //     color="#000"
          //     onPress={() => navigation.navigate("userCancel")}
          //   />
          // }
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
                    <MaterialIcons
                      name="list-alt"
                      size={scale(50)}
                      color="#000"
                      style={{ paddingLeft: 10 }}
                    />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.name}>Doctor: {item.nameDoctor}</Text>
                      <Text style={styles.time}>Date: {item.date}</Text>
                      <Text style={styles.time}>Time: {getWorkShift(item.workingTime)}</Text>
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
    color: color.colorTextHeader,
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
