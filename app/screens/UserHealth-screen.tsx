import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { database } from "../../configs/firebase"
import { Header, Input } from "@rneui/themed"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import { color } from "../theme"
import AntDesign from "react-native-vector-icons/AntDesign"
import Fontisto from "react-native-vector-icons/Fontisto"
import { firebase } from "@react-native-firebase/database"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Modal from "react-native-modal"

export const UserHealthScreen: FC<StackScreenProps<NavigatorParamList, "userHealth">> = observer(
  function UserHealthScreen({ navigation }) {
    const [listPost, setListPost] = useState([])
    const user = firebase.auth().currentUser
    const [comment, setComment] = useState("")
    const [imgUser, setImgUser] = useState("")
    const [idPost, setIdPost] = useState("")
    const [cmt, setCmt] = useState<Comment[]>([])
    const [showModal, setShowModal] = useState(false)

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
      database
        .ref("/users/" + firebase.auth().currentUser.uid + "/photoUrl")
        .on("value", (snapshot) => setImgUser(snapshot.val()))

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
                fontSize: moderateScale(20),
                fontWeight: "bold",
                color: color.colorTextHeader,
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
              data={listPost.sort((a, b) => {
                return Date.parse(b.timePost) - Date.parse(a.timePost)
              })}
              renderItem={({ item }) => {
                const checkLike = Object?.values(item?.like).find(
                  (item: Like) => item.idUser === user?.uid,
                ) as Like

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
                        <Text numberOfLines={3} style={styles.contentPost}>
                          {item.content}
                        </Text>

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
                            setIdPost(item?.idPost)
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
                  </View>
                )
              }}
            />
          )}
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
                        .ref("/posts/" + idPost + "/comment")
                        .push()
                        .set({
                          idUser: user.uid,
                          contentComment: comment,
                          nameUser: user.displayName + "  (author)",
                          img: imgUser,
                          timeComment: new Date().toString(),
                        })
                        .then(() => {
                          // getData()
                          // setCmt(Object?.values(item?.comment))
                        })
                      setComment("")
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
  avatar: {
    borderRadius: 70,
    height: verticleScale(50),
    marginLeft: 12,
    marginTop: 12,
    width: verticleScale(50),
  },
  boxAvatar: {
    alignItems: "center",
    flexDirection: "row",
  },
  boxContent: {},
  boxItem: {
    backgroundColor: "#ffff",
    borderRadius: 18,
    margin: scale(8),
  },
  boxLike: {
    alignItems: "center",
    flexDirection: "row",
    height: verticleScale(50),
    borderTopWidth: 1,
    borderColor: "#cccc",
  },
  contentPost: {
    color: "#000",
    marginBottom: scale(12),
    marginLeft: scale(12),
    marginRight: 6,
    marginTop: scale(12),
  },
  count: {
    color: "#000",
    fontSize: moderateScale(18),
    padding: 8,
    // fontWeight: "bold",
  },
  imagePost: {
    alignSelf: "center",
    borderRadius: 8,
    height: scale(200),
    marginBottom: scale(10),
    resizeMode: "contain",
    width: "95%",
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
  titleHeader: {
    color: "#000",
    fontSize: moderateScale(24),
    fontWeight: "bold",
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
  avatarComment: {
    borderRadius: 70,
    height: verticleScale(40),
    marginLeft: 12,
    marginRight: 22,
    width: verticleScale(40),
  },
})
