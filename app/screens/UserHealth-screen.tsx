import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet, Text, Image, FlatList } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { database } from "../../configs/firebase"
import { Header } from "@rneui/themed"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import { color } from "../theme"
import AntDesign from "react-native-vector-icons/AntDesign"
import Fontisto from "react-native-vector-icons/Fontisto"
import { firebase } from "@react-native-firebase/database"

export const UserHealthScreen: FC<StackScreenProps<NavigatorParamList, "userHealth">> = observer(
  function UserHealthScreen({ navigation }) {
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
          const myList = Object.values(response.val())
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
                color: "#000",
              }}
            >
              Articles Health
            </Text>
          }
        />
        <View style={styles.content}>
          {!listPost ? (
            <Text>No Artical Health</Text>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={listPost}
              renderItem={({ item }) => {
                const checkLike = Object?.values(item?.like).find(
                  (item: Like) => item.idUser === user?.uid,
                ) as Like
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
                        {checkLike?.status ? (
                          <AntDesign
                            name="like1"
                            size={scale(24)}
                            color={color.colorApp}
                            onPress={() => {
                              database
                                .ref("/posts/" + item.idPost + "/like/" + user.uid)
                                .update({ status: false, idUser: user.uid })
                                .then(() => {})
                            }}
                          />
                        ) : (
                          <AntDesign
                            name="like2"
                            size={scale(24)}
                            color={"gray"}
                            onPress={() => {
                              database
                                .ref("/posts/" + item.idPost + "/like/" + user.uid)
                                .update({ status: true, idUser: user.uid })
                                .then(() => {})
                            }}
                          />
                        )}
                        <Text style={styles.count}>
                          {
                            Object?.values(item?.like).filter((item: Like) => item.status === true)
                              .length
                          }
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
          )}
        </View>
      </View>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dfdfdf",
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
    // fontFamily: "Roboto",
    fontWeight: "600",
    color: "#000",
    marginLeft: 12,
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
    // fontWeight: "bold",
  },
})
