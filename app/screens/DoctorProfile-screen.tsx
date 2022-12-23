import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Alert,
  Button,
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import auth from "@react-native-firebase/auth"
import { color } from "../theme"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { database } from "../../configs/firebase"
import { firebase } from "@react-native-firebase/database"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import ImgToBase64 from "react-native-image-base64"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Modal from "react-native-modal"

const windowWidth = Dimensions.get("window").width
// const windowHeight = Dimensions.get("window").height
export const DoctorProfileScreen: FC<StackScreenProps<NavigatorParamList, "doctorProfile">> =
  observer(function DoctorProfileScreen({ navigation }) {
    const [infoDoctor, setInfoDoctor] = useState<InfoDoctor>()
    const [imgUpdate, setImgUpdate] = useState("")
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
      GoogleSignin.configure({
        webClientId: "716587017495-gtaa8ofao9l15fofvf68mb0csgplieae.apps.googleusercontent.com",
      })
      database.ref("/doctors/" + firebase.auth().currentUser.uid).on("value", (snapshot) => {
        setInfoDoctor(snapshot.val())
      })
      return () => {
        setInfoDoctor(null)
      }
    }, [])

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
        console.log(error)
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
          .ref("/doctors/" + firebase.auth().currentUser.uid)
          .update({
            photoUrl: imgUpdate,
          })
          .then(() => {
            cancelUpdateAvatar()
            setLoading(false)
            Alert.alert("Update Avatar Successfully !!")
            // setTimeout(() => {
            //   Utils.showSuccessToast({
            //     text1: "Update Avatar Successfully",
            //   })
            // }, 1000)
          })
      } else {
        cancelUpdateAvatar()
      }
    }

    return (
      <View style={styles.container}>
        <Header
          backgroundColor={color.colorHeader}
          centerComponent={<Text style={styles.titleHeader}>Doctor</Text>}
          rightComponent={
            <MaterialIcons
              name="logout"
              size={28}
              color={color.colorTextHeader}
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
                        infoDoctor?.photoUrl ||
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
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesome name="times-circle" size={32} color={"red"} />
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "red", margin: 8 }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={updateAvatar}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesome name="check-circle" size={32} color={"green"} />
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "green", margin: 8 }}>
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Modal>
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
    color: color.colorTextHeader,
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
    fontSize: moderateScale(16),
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
