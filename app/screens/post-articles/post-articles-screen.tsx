import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Text, View, StyleSheet, TextInput } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
// import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { database } from "../../../configs/firebase"
import { moderateScale, scale, verticleScale } from "../../utils/Scale/Scaling"
import { CustomButton } from "../../components/CustomButton"
import { firebase } from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { MyHeader } from "../../components/MyHeader"

// @ts-ignore
export const PostArticlesScreen: FC<StackScreenProps<NavigatorParamList, "postArticles">> =
  observer(function PostArticlesScreen({ navigation }) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [infoDoctor, setInfoDoctor] = useState<InfoDoctor>()
    useEffect(() => {
      GoogleSignin.configure({
        webClientId: "716587017495-gtaa8ofao9l15fofvf68mb0csgplieae.apps.googleusercontent.com",
      })
      const getUser = database
        .ref("/doctors/" + firebase.auth().currentUser.uid)
        .on("value", (snapshot) => {
          setInfoDoctor(snapshot.val())
        })
      return () => {
        database.ref("/doctors/" + firebase.auth().currentUser.uid).off("child_added", getUser)
      }
    }, [])
    const postArticles = (title, content) => {
      database
        .ref("/posts")
        .push()
        .set({
          title: title,
          content: content,
          nameDoctor: infoDoctor.name,
          avtDoctor: infoDoctor.photoUrl,
          imagePost: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg",
          idPost: "",
          like: [
            {
              idUser: infoDoctor.uid,
              status: false,
            },
          ],
          comment: [
            {
              idUser: infoDoctor.uid,
              nameUser: "",
              img: "",
              contentComment: "",
            },
          ],
        })
        .then(() => {
          console.log("Post Successful")
          navigation.goBack()
        })
    }
    return (
      <View style={styles.container}>
        <MyHeader title="New Post" onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.txtTitle}>Title</Text>
          <View style={styles.boxTitle}>
            <TextInput
              multiline
              style={{
                height: verticleScale(80),
                textAlignVertical: "top",
                fontSize: 20,
                color: "#000",
                fontWeight: "bold",
              }}
              onChangeText={(text) => setTitle(text)}
            ></TextInput>
          </View>
          <Text style={styles.txtTitle}>Content</Text>

          <View style={styles.boxTitle}>
            <TextInput
              multiline
              style={{
                height: verticleScale(250),
                textAlignVertical: "top",
                fontSize: 20,
                color: "#000",
                fontWeight: "bold",
              }}
              onChangeText={(text) => setContent(text)}
            ></TextInput>
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.boxButton}>
            <CustomButton title={"Post"} onPress={() => postArticles(title, content)} />
          </View>
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
    marginTop: verticleScale(50),
  },
  txtTitle: {
    marginTop: 12,
    marginLeft: 12,
    color: "#000",
    fontWeight: "bold",
    fontSize: moderateScale(24),
  },
  boxTitle: {
    borderColor: color.colorApp,
    borderWidth: 1,
    margin: scale(12),
    borderRadius: 8,
    backgroundColor: color.line,
  },
  boxButton: {
    alignItems: "center",
    marginBottom: verticleScale(50),
  },
  button: {
    backgroundColor: color.colorApp,
  },
})
