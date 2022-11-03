import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Button,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Header, Image } from "@rneui/themed"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import auth from "@react-native-firebase/auth"
import { color } from "../theme"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import { CustomButton } from "../components/CustomButton"

const windowWidth = Dimensions.get("window").width
// const windowHeight = Dimensions.get("window").height
export const DoctorProfileScreen: FC<StackScreenProps<NavigatorParamList, "doctorProfile">> =
  observer(function DoctorProfileScreen({ navigation }) {
    const [infoDoctor, setInfoDoctor] = useState<InfoDoctor>()
    useEffect(() => {
      GoogleSignin.configure({
        webClientId: "716587017495-gtaa8ofao9l15fofvf68mb0csgplieae.apps.googleusercontent.com",
      })
      database.ref("/doctors/" + firebase.auth().currentUser.uid).on("value", (snapshot) => {
        setInfoDoctor(snapshot.val())
      })
      return () => {
        setInfoDoctor(undefined)
      }
    }, [])
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>Doctor</Text>}
          rightComponent={
            <MaterialIcons
              name="logout"
              size={28}
              color="#000"
              onPress={() =>
                auth()
                  .signOut()
                  .then(() => {
                    navigation.navigate("login")
                  })
              }
            />
          }
        />
        <View style={styles.content}>
          <ScrollView>
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
                  uri: infoDoctor?.photoUrl,
                }}
              ></Image>
            </View>
            <View style={styles.boxName}>
              <Text style={styles.name}>{infoDoctor?.name}</Text>
              <Text style={styles.email}>{infoDoctor?.email}</Text>
            </View>
            <View style={styles.boxHealth}>
              <View style={styles.blood}>
                <Text style={styles.titleBlood}>Day Start Work</Text>
                <Text style={styles.textBlood}>{infoDoctor?.dayStartWork}</Text>
              </View>
              <View style={styles.heart}>
                <Text style={styles.titleBlood}>Gender</Text>
                <View style={styles.rowHeartbeat}>
                  {/* <FontAwesome name="gender" color={"white"} size={scale(20)}></FontAwesome> */}
                  <Text style={styles.textBlood}>{infoDoctor?.gender ? "Male" : "Female"}</Text>
                </View>
              </View>
            </View>
            <View style={styles.boxDepartment}>
              <View style={styles.department}>
                <Text style={styles.titleDepartment}>Department</Text>
                <Text style={styles.textBlood}>{infoDoctor?.department}</Text>
              </View>
            </View>
            <Text style={styles.titleInfor}>Information Doctor</Text>
            <View style={styles.boxInfor}>
              <Text style={styles.textInfor}>{"Phone Number: " + infoDoctor?.phoneNumber} </Text>

              <Text style={styles.textInfor}>{"Birt Day: " + infoDoctor?.birthDay} </Text>
              <Text style={styles.textInfor}>
                {"Gender: "}
                {infoDoctor?.gender ? "Male" : "Female"}
              </Text>
            </View>
            {/* <View
              style={{
                alignItems: "center",
                marginTop: verticleScale(15),
                marginBottom: verticleScale(15),
              }}
            >
              <CustomButton
                title={"Update Proflie"}
                onPress={() => navigation.navigate("postArticle")}
              />
            </View> */}
          </ScrollView>
        </View>

        {/* <Button
          title={"Update Proflie"}
          onPress={() => navigation.navigate("doctorUpdateProfile")}
        /> */}
      </View>
    )
  })

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  bgImg: {
    borderRadius: 100,
    width: windowWidth,
    height: verticleScale(150),
    position: "absolute",
  },
  boxAvt: {
    marginTop: verticleScale(87),
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
    fontWeight: "700",
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

  boxDepartment: {
    flexDirection: "row",
    height: 180,
    width: windowWidth,
    alignItems: "center",
  },

  department: {
    flex: 1,
    height: scale(130),
    marginLeft: scale(40),
    marginRight: scale(40),
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
  titleDepartment: {
    fontSize: moderateScale(18),
    color: "#ffff",
    marginBottom: 10,
    fontWeight: "700",
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
