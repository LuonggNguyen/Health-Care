import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Header, Input } from "@rneui/themed"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import auth from "@react-native-firebase/auth"

export const RegisterScreen: FC<StackScreenProps<NavigatorParamList, "register">> = observer(
  function RegisterScreen({ navigation }) {
    const [showPass, setShowPass] = useState(true)
    const [showRePass, setShowRePass] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [rePass, setRePass] = useState("")
    const [avt, setAvt] = useState("")

    const handleRegister = async (email, pass, rePass, name, avt) => {
      if (!email || !pass || !rePass || !name || !avt) {
        Alert.alert("Can't be empty")
        setEmail("")
        setPass("")
        setRePass("")
        setName("")
        setAvt("")
      } else if (pass != rePass) {
        Alert.alert("Incorrect re-password")
        setPass("")
        setRePass("")
      } else {
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
            setEmail("")
            setPass("")
            setRePass("")
            setName("")
            setAvt("")
          })
        await auth()
          .currentUser.updateProfile(update)
          .then(() => {
            Alert.alert("User account created & signed in!")
            setEmail("")
            setPass("")
            setRePass("")
            setName("")
            setAvt("")
          })
          .catch((e) => console.log(e))
      }
    }

    const goToLogin = () => {
      navigation.navigate("login")
    }
    return (
      <View style={styles.container}>
        <Header
          centerComponent={
            <Text style={{ color: "#000", fontSize: 24, fontWeight: "bold" }}>REGISTER</Text>
          }
          backgroundColor="#fff"
        />
        <View style={styles.cardRegister}>
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
            buttonStyle={{ borderColor: "#555", borderWidth: 1, borderRadius: 8, marginTop: 70 }}
          />
        </View>
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