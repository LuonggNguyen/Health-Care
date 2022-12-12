import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Dialog, Input } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import { verticleScale, scale, moderateScale } from "../utils/Scale/Scaling"
import FontAwesome from "react-native-vector-icons/FontAwesome"

export const DetailsArticleScreen: FC<StackScreenProps<NavigatorParamList, "detailsArticle">> =
  observer(function DetailsArticleScreen({ navigation, route }) {
    const { post } = route.params
    const user = firebase.auth().currentUser
    const [cmt, setCmt] = useState<Comment[]>()
    const [comment, setComment] = useState("")
    const [imgUser, setImgUser] = useState()
    const [imgDoctor, setImgDoctor] = useState()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
      setLoading(true)
      database.ref("/posts/" + post.idPost + "/comment").on("value", (res) => {
        setCmt(Object.values(res.val()))
      })
      database
        .ref("/users/" + firebase.auth().currentUser.uid + "/photoUrl")
        .on("value", (snapshot) => setImgUser(snapshot.val()))
      database
        .ref("/doctors/" + firebase.auth().currentUser.uid + "/photoUrl")
        .on("value", (snapshot) => setImgDoctor(snapshot.val()))
      setLoading(false)
      return () => {
        setCmt(null)
        setImgUser(null)
      }
    }, [])

    if (loading) {
      return (
        <View style={styles.container}>
          <MyHeader
            title="Details Post"
            onPress={async () => {
              await navigation.goBack()
            }}
          />
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Dialog.Loading />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <MyHeader
          title="Details Post"
          onPress={async () => {
            await navigation.goBack()
          }}
        />

        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          <View style={styles.boxItem}>
            <View style={styles.boxAvatar}>
              <Image style={styles.avatar} source={{ uri: post.avtDoctor }}></Image>
              <Text style={styles.name}>{post.nameDoctor}</Text>
            </View>
            <View style={styles.boxContent}>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.contentPost}>{post.content}</Text>

              <Image
                resizeMode="contain"
                style={styles.imagePost}
                source={{ uri: post.imagePost }}
              ></Image>
            </View>
          </View>
          <View style={styles.content}>
            {!cmt ? (
              <Text>No comment</Text>
            ) : (
              <View
                style={{
                  height: verticleScale(450),
                  marginBottom: scale(50),
                  // marginTop: verticleScale(8),
                  paddingTop: verticleScale(20),
                  backgroundColor: "#ffff",
                }}
              >
                <View style={{ paddingBottom: verticleScale(12) }}>
                  <Text
                    style={{
                      fontSize: moderateScale(18),
                      textAlign: "center",
                      // fontFamily: "Roboto",
                    }}
                  >
                    Comment
                  </Text>
                </View>
                <FlatList
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  data={cmt
                    .filter((item) => item.contentComment.length > 0)
                    .sort((a, b) => {
                      return Date.parse(b.timeComment) - Date.parse(a.timeComment)
                    })}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.listComment}>
                        <Image style={styles.avatarComment} source={{ uri: item.img }}></Image>
                        <View>
                          <Text
                            style={{
                              fontSize: moderateScale(16),
                              fontWeight: "600",
                              paddingBottom: 8,
                            }}
                          >
                            {item.nameUser}
                          </Text>

                          <Text>{item.contentComment}</Text>
                        </View>
                      </View>
                    )
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
        <View style={styles.boxComment}>
          <View style={{ width: "85%" }}>
            <Input
              value={comment}
              onChangeText={(text) => {
                setComment(text)
              }}
            ></Input>
          </View>
          <View style={{ justifyContent: "center", paddingHorizontal: 20 }}>
            <FontAwesome
              name="send"
              size={scale(22)}
              onPress={() => {
                if (comment) {
                  database
                    .ref("/posts/" + post.idPost + "/comment")
                    .push()
                    .set({
                      idUser: user.uid,
                      contentComment: comment,
                      nameUser:
                        post.idDoctor == user.uid
                          ? user.displayName + "  (author)"
                          : user.displayName,
                      img: imgUser || imgDoctor,
                      timeComment: new Date().toString(),
                    })
                    .then(() => {
                      setComment("")
                    })
                } else {
                  console.log("no commet")
                }
              }}
            ></FontAwesome>
          </View>
        </View>
      </View>
    )
  })

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 70,
    height: verticleScale(50),
    marginLeft: 12,
    marginRight: 22,
    width: verticleScale(50),
  },
  avatarComment: {
    borderRadius: 70,
    height: verticleScale(40),
    marginLeft: 12,
    marginRight: 22,
    width: verticleScale(40),
  },
  boxAvatar: {
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 8,
  },
  boxContent: {},
  boxItem: {
    backgroundColor: "#ffff",
    borderRadius: scale(6),
    paddingBottom: verticleScale(30),
    // margin: scale(8),
  },
  boxLike: {
    alignItems: "center",
    flexDirection: "row",
    height: verticleScale(50),
    // backgroundColor: color.line,
    borderTopWidth: 1,
    borderColor: "#cccc",
  },
  container: {
    backgroundColor: "#dfdfdf",
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imagePost: {
    alignSelf: "center",
    borderRadius: 8,
    height: scale(230),
    marginBottom: scale(5),
    resizeMode: "contain",
    width: "100%",
  },
  name: {
    fontSize: moderateScale(18),
    // fontFamily: "Roboto",
    fontWeight: "600",
    color: "#000",
    marginLeft: 12,
  },
  title: {
    color: "#000",
    fontSize: moderateScale(16),
    fontWeight: "700",
    marginLeft: 12,
    marginRight: 12,
    marginTop: 16,
  },
  contentPost: {
    color: "#000",
    marginBottom: scale(12),
    marginLeft: scale(12),
    marginRight: 6,
    marginTop: scale(12),
  },
  boxComment: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 8,
    paddingBottom: 4,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#ffff",
    // marginHorizontal: 20,
  },
  listComment: {
    padding: 18,
    backgroundColor: "#ffff",
    borderColor: "#ccc",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
})
