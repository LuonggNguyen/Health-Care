import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Header, Image } from "@rneui/themed"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"
import { color } from "../theme"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
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
      return () => {}
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

    const getAge = (dateString) => {
      if (!dateString) {
        return 0
      } else {
        var today = new Date()
        const [day, month, year] = dateString.split("/")
        const time = new Date(+year, +month - 1, +day)
        var birthDate = new Date(time)

        var age = today.getFullYear() - birthDate.getFullYear()
        var m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        return age
      }
    }
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>User</Text>}
          rightComponent={<MaterialIcons name="logout" size={24} color="#000" onPress={logout} />}
        />
        <ScrollView>
          <View style={styles.content}>
            <ImageBackground
              style={styles.bgImg}
              source={{
                uri: "https://wallpaperaccess.com/full/624111.jpg",
              }}
            ></ImageBackground>

            <View style={styles.boxAvt}>
              <Image
                style={styles.avt}
                source={{
                  uri: infoUser?.photoUrl,
                }}
              ></Image>
            </View>
            <View style={styles.boxName}>
              <Text style={styles.name}>{infoUser?.name}</Text>
            </View>
            <View style={styles.boxHealth}>
              <View style={styles.blood}>
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
              <Text style={styles.textInfor}>{infoUser?.email}</Text>
              <Text style={styles.textInfor}>{"Phone Number: " + infoUser?.phoneNumber} </Text>
              <Text style={styles.textInfor}>{"Age: " + getAge(infoUser?.birthday)} </Text>
              <Text style={styles.textInfor}>
                {"Gender: "}
                {infoUser?.gender ? "Male" : "Female"}
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                marginTop: verticleScale(15),
                marginBottom: verticleScale(15),
              }}
            >
              <CustomButton
                title={"Update Proflie"}
                onPress={() => navigation.navigate("userUpdateProfile", { detailsUser: infoUser })}
              />
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: "#cfe2f3",
  },
  titleHeader: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#000",
  },

  boxAvt: {
    marginTop: verticleScale(87),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  avt: {
    width: verticleScale(125),
    height: verticleScale(125),
    borderRadius: 80,
    borderColor: "#6AD2FD",
    borderWidth: 2,
  },
  boxName: {
    alignItems: "center",
    marginTop: verticleScale(15),
  },
  name: {
    fontSize: moderateScale(22),
    fontWeight: "500",
  },
  email: {
    fontSize: moderateScale(16),
    fontStyle: "italic",
  },
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
    backgroundColor: "#4ea9fd",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    elevation: 8,
  },
  heart: {
    width: scale(130),
    height: scale(130),
    backgroundColor: "#4ea9fd",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4.84,
    elevation: 8,
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
  boxInfor: {
    marginBottom: 8,
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
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,

    elevation: 8,
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
