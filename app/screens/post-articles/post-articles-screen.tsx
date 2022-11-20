import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native"
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
import { launchImageLibrary } from "react-native-image-picker"
import ImgToBase64 from "react-native-image-base64"

// @ts-ignore
export const PostArticlesScreen: FC<StackScreenProps<NavigatorParamList, "postArticles">> =
  observer(function PostArticlesScreen({ navigation }) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [image, setImage] = useState("")

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

    const postArticles = (title, content, image) => {
      database
        .ref("/posts")
        .push()
        .set({
          idDoctor: infoDoctor.uid,
          nameDoctor: infoDoctor.name,
          avtDoctor: infoDoctor.photoUrl,
          timePost: new Date().toString(),
          title: title,
          content: content,
          imagePost: image,
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
    const selectImage = () => {
      try {
        const options: any = {
          maxWidth: 2000,
          maxHeight: 2000,
          mediaType: "photo",
        }
        launchImageLibrary(options, (response) => {
          if (response.didCancel) {
            console.log("User cancelled image picker")
          } else if (response.didCancel) {
            console.log("ImagePicker Error: ", response.didCancel)
          }
          const source = { uri: response.assets }
          ImgToBase64.getBase64String(source?.uri[0]?.uri)
            .then((base64String) => {
              setImage("data:image/png;base64," + base64String)
            })
            .catch((err) => console.log(err))
        })
      } catch (error) {
        console.log("no bug")
      }
    }
    return (
      <View style={styles.container}>
        <MyHeader title="New Post" onPress={() => navigation.goBack()} />
        <ScrollView>
          <View style={styles.content}>
            <View>
              <TouchableOpacity onPress={selectImage}>
                {image == "" ? (
                  <View
                    style={{
                      width: "90%",
                      paddingVertical: scale(50),
                      backgroundColor: "#dadada",
                      alignSelf: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: moderateScale(16) }}>Please select image</Text>
                  </View>
                ) : (
                  <Image
                    style={[styles.image]}
                    source={{
                      uri: image,
                      // "https://www.seekpng.com/png/detail/115-1150053_avatar-png-transparent-png-royalty-free-default-user.png",
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
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

            <View style={styles.boxButton}>
              <CustomButton title={"Post"} onPress={() => postArticles(title, content, image)} />
            </View>
          </View>
        </ScrollView>
      </View>
    )
  })
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: verticleScale(10),
  },
  txtTitle: {
    marginTop: 12,
    marginLeft: 12,
    color: "#000",
    fontWeight: "bold",
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

    marginTop: verticleScale(40),
  },
  button: {
    backgroundColor: color.colorApp,
  },
  image: {
    width: "90%",
    height: verticleScale(300),
    alignSelf: "center",
    borderRadius: 8,
  },
})
