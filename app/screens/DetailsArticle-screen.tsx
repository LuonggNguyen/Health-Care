import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Button } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"

export const DetailsArticleScreen: FC<StackScreenProps<NavigatorParamList, "detailsArticle">> =
  observer(function DetailsArticleScreen({ navigation, route }) {
    const { post } = route.params
    const user = firebase.auth().currentUser
    const [cmt, setCmt] = useState<Comment[]>()
    useEffect(() => {
      database.ref("/posts/" + post.idPost + "/comment").on("value", (res) => {
        setCmt(Object.values(res.val()))
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
        <View style={styles.content}>
          {!cmt ? (
            <Text>No comment</Text>
          ) : (
            <FlatList
              data={cmt}
              renderItem={({ item }) => {
                return (
                  <View>
                    <Text>{item.contentComment}</Text>
                  </View>
                )
              }}
            />
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
})
