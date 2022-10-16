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
import { database } from "../../configs/firebase"
import { color } from "../theme"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import { CustomText } from "../components/CustomText"

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

    // const user = auth().currentUser
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
            <View>
              <Text style={styles.name}>{infoUser?.name}</Text>
              <Text style={styles.email}>{infoUser?.email}</Text>
            </View>
          </View>
          <View style={styles.boxHealth}>
            <View style={styles.blood}>
              <Text style={styles.titleBlood}>Blood Pressure</Text>
              <Text style={styles.textBlood}>{infoUser?.bloodPressure}</Text>
            </View>
            <View style={styles.heart}>
              <Text style={styles.titleBlood}>Heart Beat</Text>
              <Text style={styles.textBlood}>{infoUser?.heartbeat}</Text>
              <Text style={{}}>Nhịp Tim Bình Thuờng</Text>
            </View>
          </View>
          <View style={styles.boxInfor}>
            <CustomText textAlign={"left"} title={infoUser?.birthday} />
            <CustomText textAlign={"left"} title={infoUser?.gender == true ? "Nam" : "Nữ"} />
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
  content: {
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
  boxAvt: {
    marginTop: scale(20),
    // backgroundColor: "#cccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderTopLeftRadius: 45,
    borderBottomLeftRadius: 45,
  },
  avt: {
    width: scale(90),
    height: scale(90),
    borderRadius: 80,
    borderColor: "#6AD2FD",
    borderWidth: 2,
  },

  email: {
    fontSize: moderateScale(16),
  },
  name: {
    fontSize: moderateScale(22),
  },

  boxBackground: {},
  bgImg: {
    borderRadius: 100,
    width: windowWidth,
    height: verticleScale(150),
    position: "absolute",
  },
  boxHealth: {
    flexDirection: "row",
    height: 180,
    width: windowWidth,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  blood: {
    width: scale(130),
    height: scale(130),
    backgroundColor: "#97c6f2",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  heart: {
    width: scale(130),
    height: scale(130),
    backgroundColor: "#4ea9fd",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlood: {
    fontSize: moderateScale(16),
    color: "#ffff",
    marginBottom: 10,
    fontWeight: "600",
  },
  textBlood: {
    fontSize: moderateScale(20),
    color: "#ffff",
    fontWeight: "900",
  },
})
