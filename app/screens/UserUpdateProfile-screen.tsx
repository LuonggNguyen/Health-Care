import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Button, Text } from "@rneui/themed"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"
import { color } from "../theme"
import { CustomText } from "../components/CustomText"
import { moderateScale, scale, verticleScale } from "../utils/Scale/Scaling"
import DatePicker from "react-native-date-picker"
import moment from "moment"
import { format } from "date-fns"
import RadioForm from "react-native-simple-radio-button"
import { CustomButton } from "../components/CustomButton"
import Slider from "@react-native-community/slider"

export const UserUpdateProfileScreen: FC<
  StackScreenProps<NavigatorParamList, "userUpdateProfile">
> = observer(function UserUpdateProfileScreen({ navigation }) {
  const user = firebase.auth().currentUser
  const [email, setEmail] = useState(user.email)
  const [weight, setWeight] = useState(50)
  const [heartbeat, setHeartbeat] = useState("")
  const [phone, setPhone] = useState("")
  const [height, setHeight] = useState(100)
  const [gender, setGender] = useState(true)

  const options = [
    { label: "Nam", value: true },
    { label: "Nữ", value: false },
  ]

  const [birtday, setBirtday] = useState(new Date())
  const formattedDate = format(birtday, "dd/MM/yyyy")

  const [open, setOpen] = useState(false)

  const updateInfoUser = () => {
    database
      .ref("/users/" + user.uid)
      .set({
        uid: user.uid,
        name: user.displayName,
        email: email,
        photoUrl: "https://i.pinimg.com/originals/12/61/dd/1261dda75d943cbd543cb86c15f31baa.jpg",
        phoneNumber: phone,
        birthday: formattedDate,
        age: 48,
        gender: gender, //true is male - false is female
        height: height,
        weight: weight,
        heartbeat: 75,
        bloodPressure: "120/80",
      })
      .then(() => {
        console.log("Update Info Successfully !!")
        navigation.goBack()
      })
  }
  return (
    <View style={styles.container}>
      <MyHeader title="User Profile" onPress={() => navigation.goBack()} />
      {/* <ScrollView> */}
      <View style={styles.content}>
        <TextInput style={styles.input} placeholder="Phone" onChangeText={setPhone} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          defaultValue={user.email}
        />
        <View style={styles.boxSlider}>
          <CustomText title={height + "cm"}></CustomText>
          <Slider
            style={styles.height}
            maximumValue={250}
            minimumValue={100}
            minimumTrackTintColor="#cccc"
            maximumTrackTintColor="#cccc"
            step={1}
            value={height}
            onValueChange={(height) => setHeight(height)}
          />
        </View>
        <View style={styles.boxSlider}>
          <CustomText title={weight + "kg"}></CustomText>
          <Slider
            style={styles.height}
            minimumValue={50}
            maximumValue={250}
            minimumTrackTintColor="#cccc"
            maximumTrackTintColor="#cccc"
            step={1}
            value={weight}
            onValueChange={(weight) => setWeight(weight)}
          />
        </View>
        <View style={styles.boxBirtday}>
          <TouchableOpacity style={styles.btnBirtday} onPress={() => setOpen(true)}>
            {/* <CustomText title={"Birt Day : " + formattedDate}></CustomText> */}
            <Text style={styles.textBirtDay}>{"Birt Day : " + formattedDate}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            open={open}
            date={birtday}
            onConfirm={(birtday) => {
              setOpen(false)
              setBirtday(birtday)
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
        </View>

        <View style={styles.boxGender}>
          <RadioForm
            labelStyle={{ fontSize: 18, color: color.storybookTextColor, paddingRight: 30 }}
            labelHorizontal={true}
            animation={true}
            formHorizontal={true}
            radio_props={options}
            initial={0} //initial value of this group
            onPress={(value) => {
              setGender(value)
            }}
          />
        </View>
        <View style={styles.boxButton}>
          <CustomButton title={"Save Info User"} onPress={updateInfoUser} />
        </View>
      </View>
      {/* </ScrollView> */}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3feff",
  },
  titleHeader: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    marginTop: verticleScale(20),
    flex: 1,
    alignItems: "center",
  },
  input: {
    textAlign: "center",
    height: 50,
    width: 300,
    // borderWidth: 1,
    margin: 15,
    // borderColor: color.colorHeader,
    borderRadius: 16,
    backgroundColor: color.text,
    shadowColor: "#60c0f0",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  boxSlider: {
    margin: 12,
    alignItems: "center",
  },
  height: {
    width: scale(250),
  },
  boxBirtday: {
    justifyContent: "center",
    margin: 12,
    alignItems: "center",
    width: scale(250),
    height: 50,
    backgroundColor: color.text,
    borderRadius: 15,
    shadowColor: "#60c0f0",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  btnBirtday: {
    width: scale(200),
    margin: 8,
  },
  boxGender: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: scale(30),
    // flexDirection: "row",
    // backgroundColor: color.line,
    width: scale(200),
    alignItems: "center",
    flex: 1,
  },
  boxButton: {
    marginBottom: verticleScale(40),
  },
  textBirtDay: {
    color: color.storybookDarkBg,
    fontWeight: "600",
    fontSize: moderateScale(16),
    textAlign: "center",
  },
  radioButton: {
    paddingLeft: 8,
  },
})
