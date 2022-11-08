import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Dialog, Header, Image, Input } from "@rneui/themed"
import auth from "@react-native-firebase/auth"
import Ionicons from "react-native-vector-icons/Ionicons"
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin"

export const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  function LoginScreen({ navigation }) {
    const [showPass, setShowPass] = useState(true)
    const [email, setEmail] = useState("ngan@doctor.com")
    const [pass, setPass] = useState("123456")
    const [loading, setLoading] = useState(false)

    async function onGoogleButtonPress() {
      try {
        await GoogleSignin.configure({
          webClientId: "716587017495-gtaa8ofao9l15fofvf68mb0csgplieae.apps.googleusercontent.com",
        })
        const { idToken } = await GoogleSignin.signIn()
        // console.log(GoogleSignin.signIn())

        const googleCredential = await auth.GoogleAuthProvider.credential(idToken)
        setLoading(true)
        return auth()
          .signInWithCredential(googleCredential)
          .then((userCredentials) => {
            navigation.navigate("user")
            navigation.reset({
              index: 0,
              routes: [{ name: "user" }],
            })
            setLoading(false)
          })
          .catch((err) => {
            console.log("Login Fail !!\n" + err)
          })
      } catch (e) {
        console.log(e)
      }
    }

    const handleLogin = (username, password) => {
      if (!username || !password) {
        Alert.alert("Can't be empty")
      } else {
        setEmail("")
        setPass("")
        setLoading(true)
        auth()
          .signInWithEmailAndPassword(username, password)
          .then((infoAccount) => {
            const checkRole = infoAccount.user.email.search("@doctor")
            if (checkRole == -1) {
              navigation.navigate("user")
              navigation.reset({
                index: 0,
                routes: [{ name: "user" }],
              })
              setLoading(false)
            } else {
              navigation.navigate("doctor")
              navigation.reset({
                index: 0,
                routes: [{ name: "doctor" }],
              })
              setLoading(false)
            }

            // Alert.alert("Login Successful !!")
          })
          .catch((error) => {
            if (error.code === "auth/invalid-email") {
              Alert.alert("That email address is invalid!")
            }
            console.error(error)
            setEmail("")
            setPass("")
          })
      }
    }

    const goToRegister = () => {
      navigation.navigate("register")
    }
    if (loading) {
      return (
        <View style={styles.container}>
          <Header
            centerComponent={
              <Text style={{ color: "#000", fontSize: 24, fontWeight: "bold" }}>LOGIN</Text>
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
            <Text style={{ color: "#000", fontSize: 24, fontWeight: "bold" }}>LOGIN</Text>
          }
          backgroundColor="#fff"
        />
        <Image
          source={{ uri: "https://www.pngmart.com/files/6/Healthcare-PNG-Transparent.png" }}
          containerStyle={styles.logo}
          PlaceholderContent={<Text>loading</Text>}
        />
        <View style={styles.cardLogin}>
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
          <Button
            onPress={() => handleLogin(email, pass)}
            title="Login"
            titleStyle={{ color: "#000", fontSize: 20, fontWeight: "bold" }}
            color="#fff"
            type="solid"
            buttonStyle={{ borderColor: "#555", borderWidth: 1, borderRadius: 8 }}
          />
          <GoogleSigninButton
            style={{ marginTop: 50, height: 48, width: "80%", alignSelf: "center" }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={() => onGoogleButtonPress().then(() => console.log("Signed in with Google!"))}
          />
        </View>
        <View style={styles.footer}>
          <Text style={{ color: "#000", fontSize: 16 }}>Don't have an account ? </Text>
          <TouchableOpacity onPress={goToRegister}>
            <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>Register now!!</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    flex: 1,
    width: "90%",
    resizeMode: "cover",
    marginBottom: 8,
  },
  cardLogin: {
    flex: 2,
    width: "90%",
    marginVertical: 8,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    justifyContent: "center",
  },
})
