import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Dialog, Header, Input } from "@rneui/themed"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import auth from "@react-native-firebase/auth"
import { database } from "../../../configs/firebase"

export const RegisterScreen: FC<StackScreenProps<NavigatorParamList, "register">> = observer(
  function RegisterScreen({ navigation }) {
    const [showPass, setShowPass] = useState(true)
    const [showRePass, setShowRePass] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [rePass, setRePass] = useState("")
    const [avt, setAvt] = useState("")
    const [loading, setLoading] = useState(false)
    const resetForm = () => {
      setEmail("")
      setPass("")
      setRePass("")
      setName("")
      setAvt("")
    }

    const handleRegister = async (email, pass, rePass, name, avt) => {
      if (!email || !pass || !rePass || !name || !avt) {
        Alert.alert("Can't be empty")
        resetForm()
      } else if (email.search("@doctor") != -1) {
        Alert.alert("Email @doctor only for Doctor !!")
      } else if (pass != rePass) {
        Alert.alert("Incorrect re-password")
        setPass("")
        setRePass("")
      } else {
        setLoading(true)
        const update = {
          displayName: name,
          photoURL: avt,
        }
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
            console.error(error)
            resetForm()
          })
        await auth()
          .currentUser.updateProfile(update)
          .then(() => {
            database
              .ref("/users/" + auth().currentUser.uid)
              .set({
                uid: auth().currentUser.uid,
                name: auth().currentUser.displayName,
                email: auth().currentUser.email,
                photoUrl: auth().currentUser.photoURL,
                phoneNumber: auth().currentUser.phoneNumber,
              })
              .then(() => {
                setLoading(false)
                Alert.alert("", "User account created & signed in!", [
                  {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => goToLogin() },
                ])
                resetForm()
                goToLogin()
              })
          })
          .catch((e) => console.log(e))
      }
    }

    const goToLogin = () => {
      navigation.navigate("login")
    }

    const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : -250
    if (loading) {
      return (
        <View style={styles.container}>
          <Header
            centerComponent={
              <Text style={{ color: "#000", fontSize: 24, fontWeight: "bold" }}>REGISTER</Text>
            }
            backgroundColor="#fff"
          />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Dialog.Loading />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Header
          centerComponent={
            <Text style={{ color: "#000", fontSize: 24, fontWeight: "bold" }}>REGISTER</Text>
          }
          backgroundColor="#fff"
        />
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
              <Input
                placeholder="URL Photo Make Avatar"
                leftIcon={<Ionicons name="image" size={26} color="gray" />}
                value={avt}
                onChangeText={(e) => setAvt(e)}
              />
              <Button
                onPress={() => {
                  handleRegister(email, pass, rePass, name, avt)
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
        <View style={styles.footer}>
          <Text style={{ color: "#000", fontSize: 16 }}>Do you already have an account ? </Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>Signin now!!</Text>
          </TouchableOpacity>
        </View>
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
