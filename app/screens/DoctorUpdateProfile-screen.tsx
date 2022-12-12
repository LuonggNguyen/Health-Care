import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Input } from "@rneui/themed"
import { database } from "../../configs/firebase"
import { color } from "../theme"
import { CustomButton } from "../components/CustomButton"
import { verticleScale } from "../utils/Scale/Scaling"

export const DoctorUpdateProfileScreen: FC<
  StackScreenProps<NavigatorParamList, "doctorUpdateProfile">
> = observer(function DoctorUpdateProfileScreen({ navigation, route }) {
  const doctor = route.params.detailsDoctor
  const [email, setEmail] = useState(doctor.email ?? "")
  const [name, setName] = useState(doctor.name ?? "")
  const [phone, setPhone] = useState(doctor.phoneNumber ?? "")
  // const [name, setName] = useState("")

  const updateInfoDoctor = (name, email, phone) => {
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
  const deleteDoctor = () => {
    database
      .ref("/doctors/" + doctor.uid)
      .remove()
      .then(() => {
        navigation.goBack()
      })
  }

  return (
    <View style={styles.container}>
      <MyHeader title="Update Doctor" onPress={() => navigation.goBack()} />
      <View style={{ marginTop: 20 }}>
        <Input
          style={styles.input}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          placeholder="Name"
          value={name}
          onChangeText={(name) => {
            setName(name)
          }}
        ></Input>
        <Input
          style={styles.input}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          placeholder="Email"
          value={email}
          onChangeText={(email) => {
            setEmail(email)
          }}
        ></Input>
        <Input
          style={styles.input}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          placeholder="Phone Number"
          value={phone}
          onChangeText={(phone) => {
            setPhone(phone)
          }}
        ></Input>
      </View>
      <View style={{ flex: 1 }}></View>
      {/* <Button title={"Save Info Doctor"} onPress={updateInfoDoctor} /> */}
      <View style={styles.boxButton}>
        <CustomButton title={"Update"} onPress={() => updateInfoDoctor(name, email, phone)} />
      </View>
      <View style={styles.boxButton}>
        <CustomButton title={"Delete Doctor"} onPress={deleteDoctor} />
      </View>
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
  input: {
    textAlign: "center",
    height: 50,
    width: 300,
    marginTop: 6,
    borderRadius: 16,
    backgroundColor: color.background,
  },
  boxButton: {
    alignItems: "center",
    marginBottom: verticleScale(20),
  },
})
