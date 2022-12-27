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
          const source = { uri: response.assets }
          ImgToBase64.getBase64String(
            source?.uri[0]?.uri ??
              "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",
          )
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
            <View style={{ position: "absolute", top: "40%", left: "49%", zIndex: 999 }}>
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
    paddingBottom: verticleScale(100),
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
