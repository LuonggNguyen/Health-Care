import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Dialog, Input } from "@rneui/themed"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import auth from "@react-native-firebase/auth"
import { database } from "../../../configs/firebase"
import Toast from "react-native-simple-toast"
import { MyHeader } from "../../components/MyHeader"

export const RegisterDoctor: FC<StackScreenProps<NavigatorParamList, "register">> = observer(
  function RegisterDoctor({ navigation }) {
    const [showPass, setShowPass] = useState(true)
    const [showRePass, setShowRePass] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [rePass, setRePass] = useState("")
    const [loading, setLoading] = useState(false)
    const resetForm = () => {
      setEmail("")
      setPass("")
      setRePass("")
      setName("")
    }

    const handleRegister = async (email, pass, rePass, name) => {
      if (!email || !pass || !rePass || !name) {
        Alert.alert("Can't be empty")
        resetForm()
      } else if (email.search("@doctor") == -1) {
        Alert.alert("You need to use email @doctor")
      } else if (email.search("@admin") != -1) {
        Alert.alert("Email @admin only for Admin !!")
      } else if (pass != rePass) {
        Alert.alert("Incorrect re-password")
        setPass("")
        setRePass("")
      } else {
        setLoading(true)
        const update = {
          displayName: name,
        }

        try {
          await auth()
            .createUserWithEmailAndPassword(email, pass)
            .then(() => {})
            .catch((error) => {
              if (error.code === "auth/email-already-in-use") {
                Alert.alert("That email address is already in use!")
              }

              if (error.code === "auth/invalid-email") {
                Alert.alert("That email address is invalid!")
              }
              resetForm()
              console.log(error)
            })
          await auth()
            .currentUser.updateProfile(update)
            .then(() => {
              database
                .ref("/doctors/" + auth().currentUser.uid)
                .set({
                  uid: auth().currentUser.uid,
                  name: auth().currentUser.displayName,
                  email: auth().currentUser.email,
                  birthDay: "11/10/1970",
                  dayStartWork: "20/10/2005",
                  department: "Internal medicine doctor",
                  gender: true,
                  photoUrl:
                    "https://static.vecteezy.com/system/resources/previews/001/206/141/original/doctors-png.png",
                  phoneNumber: "0999999999",
                })
                .then(() => {
                  setLoading(false)
                  Toast.showWithGravity("Register Successfull !!", Toast.LONG, Toast.TOP)
                  resetForm()
                  navigation.goBack()
                })
            })
            .catch((e) => console.log(e))
        } catch (error) {
          setLoading(false)
        }
      }
    }

    const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : -250
    if (loading) {
      return (
        <View style={styles.container}>
          <MyHeader title="Register Doctor" onPress={() => navigation.goBack()} />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Dialog.Loading />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <MyHeader title="Register Doctor" onPress={() => navigation.goBack()} />
        <KeyboardAvoidingView
          style={styles.cardRegister}
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{}}>
              <Input
                placeholder="Name"
                leftIcon={<MaterialCommunityIcons name="account" size={26} color="gray" />}
                value={name}
                onChangeText={(e) => setName(e)}
              />
              <Input
                placeholder="Email"
                leftIcon={<Ionicons name="mail" size={24} color="gray" />}
                value={email}
                onChangeText={(e) => setEmail(e)}
              />
              <Input
                secureTextEntry={showPass}
                placeholder="Password"
                leftIcon={<Ionicons name="lock-closed" size={24} color="gray" />}
                value={pass}
                onChangeText={(p) => setPass(p)}
                rightIcon={
                  !pass ? (
                    <View />
                  ) : (
                    <Ionicons
                      name={showPass ? "eye" : "eye-off"}
                      size={24}
                      color="gray"
                      onPress={() => {
                        setShowPass(!showPass)
                      }}
                    />
                  )
                }
              />
              <Input
                secureTextEntry={showRePass}
                placeholder="Re-Password"
                leftIcon={<Ionicons name="lock-closed" size={24} color="gray" />}
                value={rePass}
                onChangeText={(p) => setRePass(p)}
                rightIcon={
                  !rePass ? (
                    <View />
                  ) : (
                    <Ionicons
                      name={showRePass ? "eye" : "eye-off"}
                      size={24}
                      color="gray"
                      onPress={() => {
                        setShowRePass(!showRePass)
                      }}
                    />
                  )
                }
              />
              <Button
                onPress={() => {
                  handleRegister(email, pass, rePass, name)
                }}
                title="Register"
                titleStyle={{ color: "#000", fontSize: 20, fontWeight: "bold" }}
                color="#fff"
                type="solid"
                buttonStyle={{
                  borderColor: "#555",
                  borderWidth: 1,
                  borderRadius: 8,
                  marginTop: 50,
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cardRegister: {
    // marginTop: verticleScale(120),
    flex: 1,
    width: "90%",
    justifyContent: "center",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    justifyContent: "center",
  },
})
