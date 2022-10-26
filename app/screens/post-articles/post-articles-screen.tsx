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
      database.ref("/doctors/" + firebase.auth().currentUser.uid).on("value", (snapshot) => {
        setInfoDoctor(snapshot.val())
      })
      return () => {}
    }, [])

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const postArticles = (title, content) => {
      database
        .ref("/posts")
        .push()
        .set({
          title: title,
          content: content,
          nameDoctor: infoDoctor.name,
          avtDoctor: infoDoctor.photoUrl,
          imagePost: "https://toigingiuvedep.vn/wp-content/uploads/2022/05/hinh-anh-vintage.jpg",
          idDoctor: infoDoctor.uid,
          like: [
            { uid: "111", status: true },
            { uid: "222", status: true },
            { uid: "333", status: true },
            { uid: "444", status: true },
            { uid: "555", status: false },
            { uid: "666", status: true },
          ],
          comment: [
            {
              idUser: 1,
              nameUser: "Ngan",
              contentConment: "Tuyet voi",
            },
            {
              idUser: 1,
              nameUser: "Ngan",
              contentConment: "Tuyet voi",
            },
          ],
        })
        .then(() => {
          console.log("Post Successful")
        })
    }
    return (
      <View style={styles.container}>
        <MyHeader title="New Post" onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <Text style={styles.txtTitle}>Title</Text>
          <View style={styles.boxTitle}>
            <TextInput
              style={{ height: verticleScale(100) }}
              onChangeText={(text) => setTitle(text)}
            ></TextInput>
          </View>
          <Text style={styles.txtTitle}>Content</Text>

          <View style={styles.boxTitle}>
            <TextInput
              style={{ height: verticleScale(250) }}
              onChangeText={(text) => setContent(text)}
            ></TextInput>
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.boxButton}>
            <CustomButton title={"Handle"} onPress={() => postArticles(title, content)} />
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

    fontSize: moderateScale(20),
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
