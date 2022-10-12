import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, ImageBackground, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Button, Header, Icon, Image } from "@rneui/themed"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"
import { color } from "../theme"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import { CustomText } from "../commons/CustomText"

const windowWidth = Dimensions.get("window").width
// const windowHeight = Dimensions.get("window").height

export const UserProfileScreen: FC<StackScreenProps<NavigatorParamList, "userProfile">> = observer(
  function UserProfileScreen({ navigation }) {
    const [infoUser, setInfoUser] = useState<InfoUser>()
    useEffect(() => {
      GoogleSignin.configure({
        webClientId: "716587017495-gtaa8ofao9l15fofvf68mb0csgplieae.apps.googleusercontent.com",
      })
      database
        .ref("/users/" + firebase.auth().currentUser.uid)
        .on("value", (snapshot) => setInfoUser(snapshot.val()))
      return () => {
        setInfoUser(null)
      }
    }, [])

    const user = auth().currentUser
    // console.log(user)
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
    // console.log("infoUser ", infoUser?.photoUrl)
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>User</Text>}
          rightComponent={<MaterialIcons name="logout" size={28} color="#000" onPress={logout} />}
        />
        <View style={styles.content}>
          <View style={styles.boxBackground}>
            <ImageBackground
              style={styles.bgImg}
              source={{
                uri: "https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=2000",
              }}
            ></ImageBackground>
          </View>
          <View style={styles.boxAvt}>
            <Image
              style={styles.avt}
              source={{
                uri: infoUser?.photoUrl,
              }}
            ></Image>
            <CustomText title={infoUser?.name} size={moderateScale(20)} />
          </View>
          <View style={styles.boxInfor}>
            <CustomText textAlign={"left"} title={infoUser?.birthday} />
            <CustomText textAlign={"left"} title={infoUser?.gender == true ? "Nam" : "Nữ"} />
            <CustomText textAlign={"left"} title={infoUser?.email} />
            <CustomText textAlign={"left"} title={infoUser?.phoneNumber} />
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
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#000",
  },
  boxInfor: {
    flex: 1,
    marginLeft: scale(50),
    marginTop: verticleScale(20),
  },
  avt: {
    width: scale(110),
    height: scale(110),
    borderRadius: 80,
    marginTop: verticleScale(90),
    borderColor: "#6AD2FD",
    borderWidth: 2,
  },

  content: {
    flex: 1,
  },

  boxAvt: {
    flexDirection: "column",
    alignItems: "center",
  },
  boxBackground: {},
  bgImg: {
    borderRadius: 100,
    width: windowWidth,
    height: verticleScale(150),
    position: "absolute",
  },
})
