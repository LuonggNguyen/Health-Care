import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { firebase } from "@react-native-firebase/database"
import { Button } from "@rneui/themed"
import { database } from "../../configs/firebase"

export const DoctorUpdateProfileScreen: FC<
  StackScreenProps<NavigatorParamList, "doctorUpdateProfile">
> = observer(function DoctorUpdateProfileScreen({ navigation }) {
  const user = firebase.auth().currentUser

  const updateInfoDoctor = () => {
    database
      .ref("/doctors/" + user.uid)
      .set({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phoneNumber: "0383334687",
        dayStartWork: "20/10/2005",
        department: "Internal medicine doctor",
        age: 48,
        gender: false, //true is male - false is female
      })
      .then(() => console.log("Update Info Successfully !!"))
  }

  return (
    <View style={styles.container}>
      <MyHeader title="Doctor Profile" onPress={() => navigation.goBack()} bgColor />
      <Button title={"Save Info Doctor"} onPress={updateInfoDoctor} />
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
