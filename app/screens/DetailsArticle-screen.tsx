import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Dialog, Input } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import { verticleScale, scale, moderateScale } from "../utils/Scale/Scaling"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Iconicons from "react-native-vector-icons/Ionicons"
import { Header } from "@rneui/base"
import { color } from "../theme"
import { Menu, MenuDivider, MenuItem } from "react-native-material-menu"

export const DetailsArticleScreen: FC<StackScreenProps<NavigatorParamList, "detailsArticle">> =
  observer(function DetailsArticleScreen({ navigation, route }) {
    const { post } = route.params
    const user = firebase.auth().currentUser
    const [cmt, setCmt] = useState<Comment[]>()
    const [comment, setComment] = useState("")
    const [imgUser, setImgUser] = useState()
    const [imgDoctor, setImgDoctor] = useState()
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const hideMenu = () => setVisible(false)
    const showMenu = () => setVisible(true)
    const updatePost: UpdatePost = {
      idPost: post.idPost,
      img: post.imagePost,
      title: post.title,
      content: post.content,
    }

    useEffect(() => {
      setLoading(true)
      database.ref("/posts/" + post.idPost + "/comment").on("value", (res) => {
        try {
          setCmt(Object?.values(res.val()))
        } catch (error) {}
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

    const checkRole = () => {
      if (user.email.search("@doctor") != -1) {
        return "doctor"
      } else if (user.email.search("@admin") != -1) {
        return "admin"
      } else {
        return "user"
      }
    }

    if (loading) {
      return (
        <View style={styles.container}>
          <Header
            backgroundColor={color.colorHeader}
            leftComponent={
              <Iconicons
                name="arrow-back"
                color={color.colorTextHeader}
                size={scale(24)}
                onPress={() => navigation.goBack()}
              />
            }
            centerComponent={
              <Text
                style={{
                  fontSize: moderateScale(20),
                  fontWeight: "bold",
                  color: color.colorTextHeader,
                }}
              >
                Details Post
              </Text>
            }
          />
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Dialog.Loading />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          leftComponent={
            <Iconicons
              name="arrow-back"
              color={color.colorTextHeader}
              size={scale(24)}
              onPress={() => navigation.goBack()}
            />
          }
          centerComponent={
            <Text
              style={{
                fontSize: moderateScale(20),
                fontWeight: "bold",
                color: color.colorTextHeader,
              }}
            >
              Details Post
            </Text>
          }
          rightComponent={
            checkRole() === "doctor" ? (
              <>
                <Menu
                  visible={visible}
                  anchor={
                    <MaterialIcons
                      name="more-vert"
                      size={scale(24)}
                      color="#fff"
                      onPress={showMenu}
                    />
                  }
                  onRequestClose={hideMenu}
                >
                  <MenuItem
                    onPress={() => {
                      setVisible(false)
                      navigation.navigate("postArticle", { postUpdate: updatePost })
                    }}
                  >
                    Edit Post
                  </MenuItem>
                  <MenuItem
                    onPress={() => {
                      setVisible(false)
                      database
                        .ref("/posts/" + post.idPost)
                        .remove()
                        .then(() => {
                          alert("Delete successful !!")
                          navigation.goBack()
                        })
                    }}
                  >
                    Delete Post
                  </MenuItem>
                  <MenuDivider />
                </Menu>
              </>
            ) : (
              <></>
            )
          }
        />

        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          <View style={styles.boxItem}>
            <View style={styles.boxAvatar}>
              <Image style={styles.avatar} source={{ uri: post?.avtDoctor }}></Image>
              <Text style={styles.name}>{post?.nameDoctor}</Text>
            </View>
            <View style={styles.boxContent}>
              <Text style={styles.title}>{post?.title}</Text>
              <Text style={styles.contentPost}>{post?.content}</Text>

              <Image
                resizeMode="contain"
                style={styles.imagePost}
                source={{ uri: post?.imagePost }}
              ></Image>
            </View>
          </View>
          <View style={styles.content}>
            {!cmt ? (
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: moderateScale(16),
                  paddingTop: verticleScale(12),
                }}
              >
                No comment
              </Text>
            ) : (
              <View
                style={{
                  marginBottom: scale(50),
                  paddingTop: verticleScale(12),
                  backgroundColor: "#ffff",
                }}
              >
                <View style={{ paddingBottom: verticleScale(12) }}>
                  <Text
                    style={{
                      fontSize: moderateScale(18),
                      textAlign: "center",
                    }}
                  >
                    Comment
                  </Text>
                </View>
                {cmt
                  .filter((item) => item.contentComment.length > 0)
                  .sort((a, b) => {
                    return Date.parse(b.timeComment) - Date.parse(a.timeComment)
                  })
                  .map((a) => {
                    return (
                      <View style={styles.listComment}>
                        <Image style={styles.avatarComment} source={{ uri: a?.img }}></Image>
                        <View>
                          <Text
                            style={{
                              fontSize: moderateScale(16),
                              fontWeight: "600",
                              paddingBottom: 8,
                            }}
                          >
                            {a?.nameUser}
                          </Text>
                          <Text>{a?.contentComment}</Text>
                        </View>
                      </View>
                    )
                  })}
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
                    .then(() => {})
                  setComment("")
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
    backgroundColor: "#fff",
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: verticleScale(40),
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
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
})
