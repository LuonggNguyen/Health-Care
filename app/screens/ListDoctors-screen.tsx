import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { database } from "../../configs/firebase"
import { MyHeader } from "../components/MyHeader"
const Width = Dimensions.get("window").width
const Height = Dimensions.get("window").height

export const ListDoctorsScreen: FC<StackScreenProps<NavigatorParamList, "listDoctors">> = observer(
  function ListDoctorsScreen({ navigation }) {
    const [list, setList] = useState<InfoDoctor[]>([])
    useEffect(() => {
      database.ref("/doctors").on("value", (snapshot) => {
        setList(Object.values(snapshot.val()))
      })
      return () => {
        setList([])
      }
    }, [])
    return (
      <View style={styles.container}>
        <MyHeader title="List Doctor" onPress={() => navigation.goBack()} />
        <FlatList
          style={styles.flatList}
          data={list}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("detailsDoctor", {
                    idDoctor: item.uid,
                    nameDoctor: item.name,
                  })
                }
              >
                <View style={styles.item}>
                  <Image
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 75,
                      resizeMode: "cover",
                    }}
                    source={{
                      uri: item.photoUrl,
                    }}
                  />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.info}>{item.department}</Text>
                    <Text style={styles.info}>Gender: {item.gender ? "Male" : "Female"}</Text>
                    <Text style={styles.info}>Year exp: {item.dayStartWork}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
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
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  name: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
})
