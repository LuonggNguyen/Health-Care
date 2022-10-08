import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { database } from "../../configs/firebase"

export const UserBookingScreen: FC<StackScreenProps<NavigatorParamList, "userBooking">> = observer(
  function UserBookingScreen() {
    const array = []
    const [list, setList] = useState([])

    useEffect(() => {
      database
        .ref("/doctors")
        .once("value")
        .then((snapshot) => {
          Object.keys(snapshot.val()).forEach((key) => {
            array.push({ [key]: snapshot.val()[key] })
          })
          setList(array)
        })
      return () => {
        setList([])
      }
    }, [])

    let result = list.map(({ foo }) => foo)
    console.log(result)

    return (
      <View style={styles.container}>
        <Text style={styles.title}>List</Text>
        <FlatList
          style={{ backgroundColor: "#ccc" }}
          data={list}
          renderItem={({ index }) => {
            console.log("render", list[index]?.name)
            return <Text style={styles.title}>{list[index]?.age}</Text>
          }}
        />
      </View>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    padding: 8,
    color: "red",
    fontWeight: "bold",
  },
})
