import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
// import { firebase } from "@react-native-firebase/database"

export const DoctorUpdateProfileScreen: FC<
  StackScreenProps<NavigatorParamList, "doctorUpdateProfile">
> = observer(function DoctorUpdateProfileScreen() {
  // firebase
  //   .app()
  //   .database(
  //     "https://healthcare-856bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  //   )
  //   .ref("/users/" + uid)
  //   .set({
  //     yearExp: 5,
  //     type: "clgt",
  //   })
  //   .then(() => console.log("Data set."))
  return <View></View>
})
