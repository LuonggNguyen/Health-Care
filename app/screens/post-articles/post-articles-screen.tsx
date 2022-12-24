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
import { color } from "../../theme"
import { database } from "../../../configs/firebase"
import { moderateScale, scale, verticleScale } from "../../utils/Scale/Scaling"
import { CustomButton } from "../../components/CustomButton"
import { firebase } from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { MyHeader } from "../../components/MyHeader"
import { launchImageLibrary } from "react-native-image-picker"
import ImgToBase64 from "react-native-image-base64"
import { Dialog } from "@rneui/themed"

// @ts-ignore
export const PostArticlesScreen: FC<StackScreenProps<NavigatorParamList, "postArticle">> = observer(
  function PostArticlesScreen({ navigation, route }) {
    const { postUpdate } = route.params

    const [title, setTitle] = useState(postUpdate?.title ?? "")
    const [content, setContent] = useState(postUpdate?.content ?? "")
    const [image, setImage] = useState(postUpdate?.img ?? "")
    const [loading, setLoading] = useState(false)
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
      if (!title || !content || !image) {
        alert("Content cannot be left blank")
      } else {
        setLoading(true)
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
            setLoading(false)
            navigation.goBack()
          })
          .catch(() => {
            setLoading(false)
          })
      }
    }

    const updateArticles = (title, content, image) => {
      if (!title || !content || !image) {
        alert("Content cannot be left blank")
      } else {
        setLoading(true)
        database
          .ref("/posts/" + postUpdate.idPost)
          .update({
            title: title,
            content: content,
            imagePost: image,
            timePost: new Date().toString(),
          })
          .then(() => {
            setLoading(false)
            navigation.navigate("doctor")
          })
          .catch(() => {
            setLoading(false)
          })
      }
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
                  fontSize: moderateScale(18),
                  color: "#000",
                  fontWeight: "bold",
                }}
                value={title}
                onChangeText={(text) => setTitle(text)}
              ></TextInput>
            </View>
            <View style={{ position: "absolute", top: "49%", left: "49%", zIndex: 999 }}>
              {loading && <Dialog.Loading />}
            </View>
            <Text style={styles.txtTitle}>Content</Text>

            <View style={styles.boxTitle}>
              <TextInput
                multiline
                style={{
                  height: verticleScale(250),
                  textAlignVertical: "top",
                  fontSize: moderateScale(18),
                  color: "#000",
                  fontWeight: "bold",
                }}
                value={content}
                onChangeText={(text) => setContent(text)}
              ></TextInput>
            </View>
          </View>
        </ScrollView>
        <View style={styles.boxButton}>
          <CustomButton
            title={postUpdate ? "Update Post" : "Post"}
            onPress={() => {
              if (postUpdate) {
                updateArticles(title, content, image)
              } else {
                postArticles(title, content, image)
              }
            }}
          />
        </View>
      </View>
    )
  },
)
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
    fontSize: moderateScale(18),
  },
  boxTitle: {
    borderColor: color.colorApp,
    borderWidth: 1,
    margin: scale(12),
    borderRadius: 8,
    backgroundColor: color.line,
  },
  boxButton: {
    alignSelf: "center",
    position: "absolute",
    bottom: scale(10),
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
