import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Button } from "@rneui/themed"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"

export const UserUpdateProfileScreen: FC<
  StackScreenProps<NavigatorParamList, "userUpdateProfile">
> = observer(function UserUpdateProfileScreen({ navigation }) {
  const user = firebase.auth().currentUser

  const updateInfoUser = () => {
    database
      .ref("/users/" + user.uid)
      .set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoUrl: "https://i.pinimg.com/originals/12/61/dd/1261dda75d943cbd543cb86c15f31baa.jpg",
        phoneNumber: "0368440510",
        birthday: "05/10/2002",
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
