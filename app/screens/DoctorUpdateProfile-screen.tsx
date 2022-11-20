import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View, Text } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { firebase } from "@react-native-firebase/database"
import { Button, Input } from "@rneui/themed"
import { database } from "../../configs/firebase"

export const DoctorUpdateProfileScreen: FC<
  StackScreenProps<NavigatorParamList, "doctorUpdateProfile">
> = observer(function DoctorUpdateProfileScreen({ navigation, route }) {
  const doctor = route.params.detailsDoctor

  const user = firebase.auth().currentUser
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  // const [name, setName] = useState("")

  const updateInfoDoctor = () => {
    database
      .ref("/doctors/" + doctor.uid)
      .set({
        uid: doctor.uid,
        name: name == "" ? doctor.name : name,
        email: email == "" ? doctor.email : email,
        phoneNumber: phone == "" ? doctor.phoneNumber : phone,
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
      <MyHeader title="Update Doctor" onPress={() => navigation.goBack()} />
      <Input
        placeholder="Name"
        onChangeText={(name) => {
          setName(name)
        }}
      ></Input>
      <Input
        placeholder="Email"
        onChangeText={(email) => {
          setEmail(email)
        }}
      ></Input>
      <Input
        placeholder="Phone Number"
        onChangeText={(phone) => {
          setPhone(phone)
        }}
      ></Input>

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
