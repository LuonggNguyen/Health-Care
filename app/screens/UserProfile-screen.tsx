import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, ImageBackground, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Button } from "@rneui/themed"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export const UserProfileScreen: FC<StackScreenProps<NavigatorParamList, "userProfile">> = observer(
  function UserProfileScreen({ navigation }) {
    useEffect(() => {
      GoogleSignin.configure({
        webClientId: "716587017495-gtaa8ofao9l15fofvf68mb0csgplieae.apps.googleusercontent.com",
      })
      return () => {}
    }, [])

    const logout = () => {
      auth().currentUser.providerData[0].providerId == "google.com"
        ? GoogleSignin.signOut().then(() => {
            auth().signOut()
            navigation.navigate("login")
          })
        : auth()
            .signOut()
            .then(() => {
              navigation.navigate("login")
            })
    }

    return (
      <View style={styles.container}>
        <View style={styles.BoxImgBg}>
          <ImageBackground
            style={styles.ImgBackground}
            source={{
              uri: "https://image.shutterstock.com/image-photo/light-bulbs-on-dark-wooden-260nw-354086042.jpg",
            }}
          ></ImageBackground>
        </View>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  BoxImgBg: {
    flex: 1,
  },
  ImgBackground: {
    height: 100,
    width: windowWidth,
  },
})
