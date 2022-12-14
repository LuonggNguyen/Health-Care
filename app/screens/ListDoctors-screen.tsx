import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { database } from "../../configs/firebase"
import { MyHeader } from "../components/MyHeader"
import { moderateScale, scale } from "../utils/Scale/Scaling"
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

    const getExp = (dateString) => {
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
                    doctor: item,
                  })
                }
              >
                <View style={styles.item}>
                  <Image
                    style={{
                      width: scale(70),
                      height: scale(70),
                      borderRadius: 75,
                      resizeMode: "cover",
                      marginHorizontal: 15,
                    }}
                    source={{
                      uri: item.photoUrl,
                    }}
                  />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.info}>{item.department}</Text>
                    <Text style={styles.info1}>Gender: {item.gender ? "Male" : "Female"}</Text>
                    <Text style={styles.info1}>
                      Years of experience: {getExp(item.dayStartWork)}
                    </Text>
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
    fontSize: moderateScale(20),
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
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  name: {
    fontSize: moderateScale(20),
    color: "black",
    fontWeight: "bold",
    padding: 4,
  },
  info: {
    fontSize: moderateScale(16),
    color: "black",
    fontWeight: "bold",
    padding: 4,
  },
  info1: {
    fontSize: moderateScale(16),
    color: "black",
    padding: 4,
  },
})
