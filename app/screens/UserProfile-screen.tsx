import Modal from "react-native-modal"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import {
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { Dialog, Header, Image } from "@rneui/themed"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"
import { color } from "../theme"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { CustomButton } from "../components/CustomButton"
import ImgToBase64 from "react-native-image-base64"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"

const windowWidth = Dimensions.get("window").width
export const UserProfileScreen: FC<StackScreenProps<NavigatorParamList, "userProfile">> = observer(
  function UserProfileScreen({ navigation }) {
    const [infoUser, setInfoUser] = useState<InfoUser>()
    const [modalVisible, setModalVisible] = useState(false)
    const [imgUpdate, setImgUpdate] = useState("")
    const [loading, setLoading] = useState(false)

    const user = firebase.auth().currentUser
    useEffect(() => {
      GoogleSignin.configure({
        webClientId: "716587017495-gtaa8ofao9l15fofvf68mb0csgplieae.apps.googleusercontent.com",
      })
      database
        .ref("/users/" + firebase.auth().currentUser.uid)
        .on("value", (snapshot) => setInfoUser(snapshot.val()))
      return () => {
        setInfoUser(undefined)
      }
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

    const selectImage = () => {
      try {
        const options: any = {
          maxWidth: 500,
          maxHeight: 500,
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
              setImgUpdate("data:image/png;base64," + base64String)
            })
            .catch((err) => console.log(err))
        })
      } catch (error) {
        console.log("no bug")
      }
    }
    const openCamera = () => {
      const options: any = {
        maxWidth: 500,
        maxHeight: 500,
        mediaType: "photo",
      }
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker")
        } else if (response.didCancel) {
          console.log("ImagePicker Error: ", response.didCancel)
        }
        const source = { uri: response.assets }
        console.log(source.uri[0].uri)
        ImgToBase64.getBase64String(source?.uri[0]?.uri)
          .then((base64String) => {
            setImgUpdate("data:image/png;base64," + base64String)
          })
          .catch((err) => console.log(err))
      })
    }
    const cancelUpdateAvatar = () => {
      setModalVisible(false)
      setImgUpdate("")
    }

    const updateAvatar = () => {
      if (imgUpdate) {
        setLoading(true)
        database
          .ref("/users/" + firebase.auth().currentUser.uid)
          .update({
            photoUrl: imgUpdate,
          })
          .then(() => {
            cancelUpdateAvatar()
            setLoading(false)
            Alert.alert("Update Avatar Successfully !!")
          })
      } else {
        cancelUpdateAvatar()
      }
    }
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>User</Text>}
          rightComponent={
            <MaterialIcons name="logout" size={24} color={color.colorTextHeader} onPress={logout} />
          }
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
                  uri:
                    infoUser?.photoUrl ||
                    "https://www.seekpng.com/png/detail/115-1150053_avatar-png-transparent-png-royalty-free-default-user.png",
                }}
              >
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 3,
                    zIndex: 1,
                    width: scale(30),
                    height: scale(30),
                    backgroundColor: "#777",
                    borderRadius: scale(15),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    setModalVisible(!modalVisible)
                  }}
                >
                  <FontAwesome name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              </Image>
            </View>
            <View style={styles.boxName}>
              <Text style={styles.name}>{user.displayName || infoUser.name}</Text>
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
          <Modal isVisible={modalVisible} animationIn="zoomIn" animationOut="zoomOut">
            {loading ? (
              <View style={styles.viewModal}>
                <Dialog.Loading />
              </View>
            ) : (
              <View style={styles.viewModal}>
                <Image
                  style={[
                    styles.avt,
                    {
                      width: verticleScale(200),
                      height: verticleScale(200),
                      borderRadius: scale(100),
                    },
                  ]}
                  source={{
                    uri:
                      imgUpdate ||
                      infoUser?.photoUrl ||
                      "https://www.seekpng.com/png/detail/115-1150053_avatar-png-transparent-png-royalty-free-default-user.png",
                  }}
                />
                <View
                  style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}
                >
                  <TouchableOpacity onPress={selectImage} style={{ alignItems: "center" }}>
                    <FontAwesome name="image" size={30} color={color.colorApp} />
                    <Text
                      style={{
                        fontSize: moderateScale(14),
                        fontWeight: "bold",
                        color: color.colorApp,
                        paddingTop: 6,
                      }}
                    >
                      Upload File
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={openCamera} style={{ alignItems: "center" }}>
                    <FontAwesome name="camera" size={30} color={color.colorApp} />
                    <Text
                      style={{
                        fontSize: moderateScale(14),
                        fontWeight: "bold",
                        color: color.colorApp,
                        paddingTop: 6,
                      }}
                    >
                      Open Camera
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}
                >
                  <TouchableOpacity
                    onPress={cancelUpdateAvatar}
                    style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
                  >
                    <FontAwesome name="times-circle" size={32} color={"red"} />
                    <Text
                      style={{
                        fontSize: moderateScale(16),
                        fontWeight: "bold",
                        color: "red",
                        margin: 8,
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={updateAvatar}
                    style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}
                  >
                    <FontAwesome name="check-circle" size={32} color={"green"} />
                    <Text
                      style={{
                        fontSize: moderateScale(16),
                        fontWeight: "bold",
                        color: "green",
                        margin: 8,
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Modal>
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
  },
  titleHeader: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: color.colorTextHeader,
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
  viewModal: {
    backgroundColor: "#fff",
    width: "90%",
    height: verticleScale(450),
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 20,
  },
})
