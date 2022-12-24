import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Header, Input } from "@rneui/themed"
import { color } from "../theme"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"
import AntDesign from "react-native-vector-icons/AntDesign"
import Fontisto from "react-native-vector-icons/Fontisto"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import Modal from "react-native-modal"
import FontAwesome from "react-native-vector-icons/FontAwesome"

export const DoctorHealthScreen: FC<StackScreenProps<NavigatorParamList, "doctorHealth">> =
  observer(function DoctorHealthScreen({ navigation }) {
    const [listPost, setListPost] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [cmt, setCmt] = useState<Comment[]>([])
    const [comment, setComment] = useState("")
    const [imgUser, setImgUser] = useState()
    const [imgDoctor, setImgDoctor] = useState()
    const user = firebase.auth().currentUser

    useEffect(() => {
      getData()
      database
        .ref("/users/" + firebase.auth().currentUser.uid + "/photoUrl")
        .on("value", (snapshot) => setImgUser(snapshot.val()))
      database
        .ref("/doctors/" + firebase.auth().currentUser.uid + "/photoUrl")
        .on("value", (snapshot) => setImgDoctor(snapshot.val()))

      return () => {
        setListPost(null)
      }
    }, [])
    const getData = () => {
      database.ref("/posts").on("value", (response) => {
        try {
          const listkey = Object.keys(response.val())
          listkey.map((key) => {
            database.ref("/posts/" + key).update({
              idPost: key,
            })
          })
          const myList = Object?.values(response.val()).filter(
            (item: PostArticle) => item.idDoctor === user.uid,
          )
          setListPost(myList)
        } catch (error) {
          console.log(error)
        }
      })
    }
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={
            <Text
              style={{
                fontSize: moderateScale(20),
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
              size={scale(24)}
              color={color.colorTextHeader}
              onPress={() => navigation.navigate("postArticle", {})}
            />
          }
        />
        <View style={styles.content}>
          {!listPost ? (
            <Text>No Artical Health</Text>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={listPost.sort((a, b) => {
                return Date.parse(b.timePost) - Date.parse(a.timePost)
              })}
              renderItem={({ item }) => {
                return (
                  <View style={styles.boxItem}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("detailsArticle", { post: item })
                      }}
                    >
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
                    </TouchableOpacity>
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
                          onPress={() => {
                            // navigation.navigate("detailsArticle", { post: item })
                            setCmt(Object?.values(item?.comment))
                            setShowModal(true)
                          }}
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
                    <Modal
                      style={{
                        // backgroundColor: '#fff',
                        padding: 0,
                        margin: 0,
                        justifyContent: "flex-end",
                      }}
                      isVisible={showModal}
                      onBackdropPress={() => {
                        setShowModal(false)
                      }}
                      backdropTransitionOutTiming={0}
                      backdropColor="#ccc"
                      backdropOpacity={0.2}
                    >
                      <View
                        style={{
                          backgroundColor: "#fff",
                          height: "80%",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            paddingHorizontal: scale(12),
                            paddingVertical: scale(14),
                          }}
                        >
                          <Text
                            style={{
                              fontSize: moderateScale(18),
                              textAlign: "center",
                              flex: 1,
                            }}
                          >
                            Comment
                          </Text>
                        </View>
                        <View style={{ paddingBottom: verticleScale(110) }}>
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
                                  <Image
                                    style={styles.avatarComment}
                                    source={{ uri: item.img }}
                                  ></Image>
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
                                    .ref("/posts/" + item.idPost + "/comment")
                                    .push()
                                    .set({
                                      idUser: user.uid,
                                      contentComment: comment,
                                      nameUser:
                                        item.idDoctor == user.uid
                                          ? user.displayName + "  (author)"
                                          : user.displayName,
                                      img: imgUser || imgDoctor,
                                      timeComment: new Date().toString(),
                                    })
                                    .then(() => {
                                      getData()
                                      // setCmt(Object?.values(item?.comment))
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
                    </Modal>
                  </View>
                )
              }}
            />
          )}
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
    minWidth: "95%",
    // height: scale(200),
    minHeight: verticleScale(200),
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
  listComment: {
    padding: 18,
    backgroundColor: "#ffff",
    borderColor: "#ccc",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarComment: {
    borderRadius: 70,
    height: verticleScale(40),
    marginLeft: 12,
    marginRight: 22,
    width: verticleScale(40),
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
})
