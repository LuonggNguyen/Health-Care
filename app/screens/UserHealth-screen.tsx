import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { database } from "../../configs/firebase"
import { Header } from "@rneui/themed"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import { color } from "../theme"
import AntDesign from "react-native-vector-icons/AntDesign"
import { firebase } from "@react-native-firebase/database"
import Fontisto from "react-native-vector-icons/Fontisto"

export const UserHealthScreen: FC<StackScreenProps<NavigatorParamList, "userHealth">> = observer(
  function UserHealthScreen({ navigation }) {
    const [listPost, setListPost] = useState([])
    const user = firebase.auth().currentUser

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
              const checkLike = Object.values(item?.like).find(
                (item: Like) => item.status === true,
                item.idUser === user.uid,
              ) as Like
              // console.log(checkLike?.status)

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
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text>
                        {
                          Object.values(item?.like).filter((item: any) => item.status === true)
                            .length
                        }
                      </Text>
                      {checkLike?.status ? (
                        <AntDesign
                          name="like2"
                          size={28}
                          color={color.colorApp}
                          onPress={() => {
                            database
                              .ref("/posts/" + item.idPost + "/like/" + user.uid)
                              .update({ status: false, idUser: user.uid })
                              .then(() => {
                                console.log("unlike")
                              })
                          }}
                        />
                      ) : (
                        <AntDesign
                          name="like1"
                          size={28}
                          color={color.colorApp}
                          onPress={() => {
                            database
                              .ref("/posts/" + item.idPost + "/like/" + user.uid)
                              .update({ status: true, idUser: user.uid })
                              .then(() => {
                                console.log("like")
                              })
                          }}
                        />
                      )}
                    </View>
                    <Fontisto
                      name="comment"
                      size={28}
                      color="gray"
                      onPress={() => navigation.navigate("detailsArticle")}
                    />
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
    justifyContent: "space-around",
    height: verticleScale(40),
    backgroundColor: color.line,
  },
  iconLike: {
    marginLeft: 16,
  },
})
