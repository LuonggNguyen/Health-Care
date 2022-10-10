import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import moment from "moment"
import { database } from "../../configs/firebase"
import { MyHeader } from "../components/MyHeader"
const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height

export const ListDoctorsScreen: FC<StackScreenProps<NavigatorParamList, "listDoctors">> = observer(
  function ListDoctorsScreen({ navigation }) {
    var date = moment().utcOffset("+05:30").format("DD/MM/yyyy")
    console.log(date)

    const [list, setList] = useState([])
    useEffect(() => {
      database
        .ref("/doctors")
        .once("value")
        .then((snapshot) => {
          setList(snapshot.val())
        })
      return () => {
        setList([])
      }
    }, [])
    const array = Object.values(list)
    return (
      <SafeAreaView style={styles.container}>
        <MyHeader title="List Doctor" onPress={() => navigation.goBack()} />
        <FlatList
          style={styles.flatList}
          data={array}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate("detailsDoctor", { idDoctor: item.uid })}
              >
                <View style={styles.item}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.phone}>{item.phoneNumber}</Text>
                  <Text style={styles.phone}>{item.gender ? "Nam" : "Nữ"}</Text>
                  <Text style={styles.phone}>{item.email}</Text>
                  <Text style={styles.phone}>{item.dayStartWork}</Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </SafeAreaView>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
