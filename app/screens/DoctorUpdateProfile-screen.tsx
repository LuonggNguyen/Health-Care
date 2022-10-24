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
> = observer(function DoctorUpdateProfileScreen({ navigation, route }) {
  const doctor = route.params.detailsDoctor
  console.log("Doctor ", doctor.dayStartWork)

  const user = firebase.auth().currentUser

  const updateInfoDoctor = () => {
    database
      .ref("/doctors/" + user.uid)
      .set({
        uid: doctor.uid,
        name: user.displayName,
        email: user.email,
        phoneNumber: "0383334687",
        dayStartWork: "20/10/2005",
        department: "Internal medicine doctor",
        birthDay: "11/10/1970",
        photoUrl:
          "https://static.vecteezy.com/system/resources/previews/001/206/141/original/doctors-png.png",
        gender: false, //true is male - false is female
      })
      .then(() => console.log("Update Info Successfully !!"))
  }

  return (
    <View style={styles.container}>
      <MyHeader title="Doctor Profile" onPress={() => navigation.goBack()} />
      <Button
        title={"Save Info Doctor"}
        onPress={() => {
          navigation.navigate("postArticle")
        }}
      />
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
