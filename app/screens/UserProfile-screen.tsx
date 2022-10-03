import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, ImageBackground, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Button, Header, Image } from "@rneui/themed"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../firebase"
import { color } from "../theme"
import { scale, verticleScale } from "../utils/Scale/Scaling"

interface InfoUser {
  age: number
  birthday: string
  bloodPressure: string
  email: string
  gender: boolean
  heartbeat: number
  height: number
  name: string
  phoneNumber: string
  weight: number
  photoUrl: string
}
const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

export const UserProfileScreen: FC<StackScreenProps<NavigatorParamList, "userProfile">> = observer(
  function UserProfileScreen({ navigation }) {
    const [infoUser, setInfoUser] = useState<InfoUser>()
    useEffect(() => {
      GoogleSignin.configure({
        webClientId: "716587017495-gtaa8ofao9l15fofvf68mb0csgplieae.apps.googleusercontent.com",
      })
      database
        .ref("/users/" + firebase.auth().currentUser.uid)
        .once("value")
        .then((snapshot) => {
          setInfoUser(snapshot.val())
        })
      return () => {
        setInfoUser(null)
      }
    }, [])

    const user = auth().currentUser
    console.log(user)

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
    console.log("infoUser ", infoUser?.photoUrl)

    return (
      <View style={styles.container}>
        <Header
          // style={{ height: 100 }}
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>User</Text>}
          rightComponent={<MaterialIcons name="logout" size={28} color="#000" onPress={logout} />}
        />
        <View style={styles.content}>
          <View style={styles.boxAvt}>
            <Image
              style={styles.avt}
              source={{
                uri: user.photoURL,
              }}
            ></Image>
            <Text>{user.displayName}</Text>
          </View>
        </View>
        <Button title={"Update Proflie"} onPress={() => navigation.navigate("userUpdateProfile")} />
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  avt: {
    width: 100,
    height: 100,
    borderRadius: 80,
  },

  content: {
    flex: 1,
  },
  boxAvt: {
    flexDirection: "column",
    alignItems: "center",
  },
})
