import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Header } from "@rneui/themed"
import { color } from "../theme"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"
import AntDesign from "react-native-vector-icons/AntDesign"
import Fontisto from "react-native-vector-icons/Fontisto"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"

export const DoctorHealthScreen: FC<StackScreenProps<NavigatorParamList, "doctorHealth">> =
  observer(function DoctorHealthScreen({ navigation }) {
    const [listPost, setListPost] = useState([])
    const user = firebase.auth().currentUser
    useEffect(() => {
      database.ref("/posts").on("value", (response) => {
        try {
          const listkey = Object.keys(response.val())
          listkey.map((key) => {
            database.ref("/posts/" + key).update({
              idPost: key,
            })
          })
          const myList = Object.values(response.val()).filter(
            (item: PostArticle) => item.idDoctor === user.uid,
          )
          setListPost(myList)
        } catch (error) {}
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
                color: color.colorTextHeader,
              }}
            >
              Articles Health
            </Text>
          }
          rightComponent={
            <MaterialIcons
              name="add-circle-outline"
              size={28}
              color={color.colorTextHeader}
              onPress={() => navigation.navigate("postArticle")}
            />
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
                    <Image
                      resizeMode="contain"
                      style={styles.imagePost}
                      source={{ uri: item.imagePost }}
                    ></Image>
                  </View>
                  <View style={styles.boxLike}>
                    <View
                      style={{
                        marginLeft: scale(60),
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AntDesign name="like2" size={scale(24)} color={"gray"} />

                      <Text style={styles.count}>
                        {Object?.values(item?.like).filter((item: Like) => item.status === true)
                          .length + 50}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <View
                      style={{
                        marginRight: scale(60),
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Fontisto
                        name="comment"
                        size={scale(22)}
                        color="gray"
                        onPress={() => navigation.navigate("detailsArticle", { post: item })}
                      />
                      <Text style={styles.count}>
                        {!Object?.values(item?.comment)
                          ? 0
                          : Object?.values(item?.comment).filter(
                              (item: Comment) => item.contentComment.length > 0,
                            ).length}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            }}
          />
        </View>
      </View>
    )
  })
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
    borderRadius: 18,
    margin: scale(8),
    backgroundColor: "#ffff",
  },
  boxAvatar: {
    alignItems: "center",
    flexDirection: "row",
  },
  avatar: {
    width: verticleScale(50),
    height: verticleScale(50),
    borderRadius: 70,
    marginLeft: 12,
    marginTop: 12,
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  boxContent: {},
  title: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    marginLeft: 12,
    marginRight: 12,
    color: "#000",
    marginTop: 16,
  },
  contentPost: {
    marginTop: scale(12),
    marginLeft: scale(12),
    marginBottom: scale(12),
    color: "#000",
    marginRight: 6,
  },
  imagePost: {
    width: "95%",
    height: scale(200),
    alignSelf: "center",
    marginBottom: scale(10),
    borderRadius: 8,
    resizeMode: "contain",
  },
  boxLike: {
    alignItems: "center",
    flexDirection: "row",
    height: verticleScale(50),
    // backgroundColor: color.line,
    borderTopWidth: 1,
    borderColor: "gray",
  },
  count: {
    color: "#000",
    fontSize: scale(18),
    padding: 8,
  },
})
