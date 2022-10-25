import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet, Text, Image, FlatList, Dimensions, TouchableOpacity } from "react-native"
// import { StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { database } from "../../configs/firebase"
import { Header } from "@rneui/themed"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import { color } from "../theme"
import AntDesign from "react-native-vector-icons/AntDesign"

// import { CustomText } from "../components/CustomText"

// @ts-ignore
const windowWidth = Dimensions.get("window").width
// const windowHeight = Dimensions.get("window").height
export const UserHealthScreen: FC<StackScreenProps<NavigatorParamList, "userHealth">> = observer(
  function UserHealthScreen() {
    const [listPost, setListPost] = useState([])

    useEffect(() => {
      database.ref("/posts").on("value", (response) => {
        const listkey = Object.keys(response.val())
        listkey.map((key) => {
          database.ref("/posts/" + key).update({
            idPost: key,
          })
        })
        const myList = Object.values(response.val())
        setListPost(myList)
      })

      return () => {
        setListPost(null)
      }
    }, [])
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#000",
              }}
            >
              Articles Health
            </Text>
          }
        />
        <View style={styles.content}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={listPost}
            renderItem={({ item }) => {
              return (
                <View style={styles.boxItem}>
                  <View style={styles.boxAvatar}>
                    <Image style={styles.avatar} source={{ uri: item.avtDoctor }}></Image>
                    <Text style={styles.name}>{item.nameDoctor}</Text>
                  </View>
                  <View style={styles.boxContent}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.contentPost}>{item.content}</Text>
                    <Image style={styles.imagePost} source={{ uri: item.imagePost }}></Image>
                  </View>
                  <View style={styles.boxLike}>
                    <TouchableOpacity style={styles.iconLike}>
                      <AntDesign name="like2" size={28} color="gray" />
                    </TouchableOpacity>
                  </View>
                </View>
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
  },
  content: {
    flex: 1,
  },
  titleHeader: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#000",
  },
  boxItem: {
    borderRadius: 10,
    backgroundColor: color.colorApp,
    margin: scale(8),
  },
  boxAvatar: {
    alignItems: "center",
    flexDirection: "row",
  },
  avatar: {
    width: verticleScale(60),
    height: verticleScale(60),
    borderRadius: 90,
    marginLeft: 12,
    marginTop: 12,
  },
  name: {
    fontSize: moderateScale(18),
    // fontFamily: "Roboto",
    fontWeight: "600",
    marginLeft: 12,
  },
  boxContent: {},
  title: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    marginLeft: 12,
    marginRight: 12,
    marginTop: 10,
  },
  contentPost: {
    marginTop: 12,
    marginLeft: 12,
    marginRight: 6,
  },
  imagePost: {
    width: scale(100),
    height: verticleScale(150),
  },
  boxLike: {
    alignItems: "center",
    flexDirection: "row",
    height: verticleScale(40),
    backgroundColor: color.line,
  },
  iconLike: {
    marginLeft: 16,
  },
})
