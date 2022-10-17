import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native"
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
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { CustomButton } from "../components/CustomButton"

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
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>User</Text>}
          rightComponent={<MaterialIcons name="logout" size={28} color="#000" onPress={logout} />}
        />
        <ScrollView>
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
                {/* <FontAwesome name="" color={"white"} size={scale(20)}></FontAwesome> */}

                <Text style={styles.titleBlood}>Blood Pressure</Text>
                <Text style={styles.textBlood}>{infoUser?.bloodPressure}</Text>
              </View>
              <View style={styles.heart}>
                <Text style={styles.titleBlood}>Heart Beat</Text>
                <View style={styles.rowHeartbeat}>
                  <FontAwesome name="heartbeat" color={"white"} size={scale(20)}></FontAwesome>
                  <Text style={styles.textBlood}>{infoUser?.heartbeat}</Text>
                </View>
                <Text style={{ color: "white", fontSize: moderateScale(12), marginTop: 10 }}>
                  Normal Heart Rate
                </Text>
              </View>
            </View>
            <View style={styles.boxHealth}>
              <View style={styles.blood}>
                {/* <FontAwesome name="weight" color={"white"} size={scale(20)}></FontAwesome> */}

                <Text style={styles.titleBlood}>Weight</Text>
                <Text style={styles.textBlood}>
                  {infoUser?.weight}
                  {" Kg"}
                </Text>
                <Text style={{ color: "white", fontSize: moderateScale(12), marginTop: 10 }}>
                  {infoUser?.weight > 40 ? "Weight Normal" : "Weight Too Low"}
                </Text>
              </View>
              <View style={styles.heart}>
                <Text style={styles.titleBlood}>Height</Text>
                <View style={styles.rowHeartbeat}>
                  <FontAwesome name="male" color={"white"} size={scale(20)}></FontAwesome>
                  <Text style={styles.textBlood}>{infoUser?.height}</Text>
                </View>
                <Text style={{ color: "white", fontSize: moderateScale(12), marginTop: 10 }}>
                  Normal Heart Rate
                </Text>
              </View>
            </View>
            <Text style={styles.titleInfor}>Information User</Text>
            <View style={styles.boxInfor}>
              <Text style={styles.textInfor}>{"Phone Number: " + infoUser?.phoneNumber} </Text>

              <Text style={styles.textInfor}>{"Birt Day: " + infoUser?.birthday} </Text>
              <Text style={styles.textInfor}>
                {"Gender: "}
                {infoUser?.gender ? "Male" : "Female"}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={{ alignItems: "center" }}>
          <CustomButton
            title={"Update Proflie"}
            onPress={() => navigation.navigate("userUpdateProfile", { detailsUser: infoUser })}
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
  },
  titleHeader: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#000",
  },
  boxInfor: {
    paddingBottom: 30,
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#4ea9fd",
    marginLeft: moderateScale(35),
    marginRight: moderateScale(35),
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 9,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5.68,

    elevation: 11,
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
    marginLeft: scale(5),
  },
  rowHeartbeat: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleInfor: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: moderateScale(20),
    fontWeight: "700",
    color: color.colorApp,
  },
  textInfor: {
    fontSize: moderateScale(18),
    color: "#ffff",
    fontWeight: "500",
    alignSelf: "center",
    marginTop: 10,
  },
})
