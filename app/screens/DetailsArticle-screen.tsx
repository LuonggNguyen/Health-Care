import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Button } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import { verticleScale, scale, moderateScale } from "../utils/Scale/Scaling"

export const DetailsArticleScreen: FC<StackScreenProps<NavigatorParamList, "detailsArticle">> =
  observer(function DetailsArticleScreen({ navigation, route }) {
    const { post } = route.params
    const user = firebase.auth().currentUser
    const [cmt, setCmt] = useState<Comment[]>()
    useEffect(() => {
      database.ref("/posts/" + post.idPost + "/comment").on("value", (res) => {
        setCmt(Object.values(res.val()))
        console.log(cmt)
      })
      return () => setCmt(undefined)
    }, [])
    if (cmt) {
      cmt.shift()
    }

    return (
      <View style={styles.container}>
        <MyHeader
          title="Details Post"
          onPress={async () => {
            await navigation.goBack()
          }}
        />
        <ScrollView>
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
              <View style={{ height: verticleScale(400) }}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={cmt}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        <Image style={styles.avatar} source={{ uri: item.img }}></Image>

                        <Text>{item.contentComment}</Text>
                      </View>
                    )
                  }}
                />
              </View>
            )}
            <Button
              title={"Comment"}
              onPress={() => {
                database
                  .ref("/posts/" + post.idPost + "/comment")
                  .push()
                  .set({
                    idUser: user.uid,
                    contentComment: "Kha lam con zai",
                    nameUser: user.displayName,
                    img: user.photoURL,
                  })
                  .then(() => {
                    console.log("cmt")
                  })
              }}
            />
          </View>
        </ScrollView>
      </View>
    )
  })

const styles = StyleSheet.create({
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
  contentPost: {
    color: "#000",
    marginBottom: scale(12),
    marginLeft: scale(12),
    marginRight: 6,
    marginTop: scale(12),
  },
})
