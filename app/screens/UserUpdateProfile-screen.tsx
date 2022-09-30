import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Button } from "@rneui/themed"
import { firebase } from "@react-native-firebase/database"

export const UserUpdateProfileScreen: FC<
  StackScreenProps<NavigatorParamList, "userUpdateProfile">
> = observer(function UserUpdateProfileScreen({ navigation }) {
  const user = firebase.auth().currentUser

  const updateInfoUser = () => {
    firebase
      .app()
      .database("https://healthcare-856bd-default-rtdb.asia-southeast1.firebasedatabase.app")
      .ref("/users/" + user.uid)
      .set({
        name: user.displayName,
        email: user.email,
        phoneNumber: "0368440510",
        birthday: "05/10/2002",
        age: 48,
        gender: true, //true is male - false is female
        height: 175,
        weight: 60,
        heartbeat: 75,
        bloodPressure: "120/80",
      })
      .then(() => console.log("Update Info Successfully !!"))
  }
  return (
    <View style={styles.container}>
      <MyHeader title="User Profile" onPress={() => navigation.goBack()} />
      <Button title={"Save Info User"} onPress={updateInfoUser} />
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
  },
})
