import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Slider, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Button } from "@rneui/themed"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"
import { color } from "../theme"
import { CustomText } from "../commons/CustomText"
import { scale } from "../utils/Scale/Scaling"
import DatePicker from "react-native-date-picker"
import moment from "moment"
import { format } from "date-fns"
import RadioForm from "react-native-simple-radio-button"

export const UserUpdateProfileScreen: FC<
  StackScreenProps<NavigatorParamList, "userUpdateProfile">
> = observer(function UserUpdateProfileScreen({ navigation }) {
  const user = firebase.auth().currentUser
  const [name, setName] = useState(user.displayName)
  const [email, setEmail] = useState(user.email)
  const [weight, setWeight] = useState(50)
  const [heartbeat, setHeartbeat] = useState("")
  const [height, setHeight] = useState(100)
  const [gender, setGender] = useState(true)

  const options = [
    { label: "Nam", value: true },
    { label: "Nữ", value: false },
  ]

  var [birtday, setBirtday] = useState(new Date())
  var formattedDate = format(birtday, "dd/MM/yyyy")

  const [open, setOpen] = useState(false)

  const updateInfoUser = () => {
    database
      .ref("/users/" + user.uid)
      .set({
        uid: user.uid,
        name: name,
        email: email,
        photoUrl: "https://i.pinimg.com/originals/12/61/dd/1261dda75d943cbd543cb86c15f31baa.jpg",
        phoneNumber: "0368440510",
        birthday: birtday,
        age: 48,
        gender: gender, //true is male - false is female
        height: height,
        weight: weight,
        heartbeat: 75,
        bloodPressure: "120/80",
      })
      .then(() => console.log("Update Info Successfully !!"))
  }
  return (
    <View style={styles.container}>
      <MyHeader title="User Profile" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <TextInput style={styles.input} placeholder="Username" onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
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
            <CustomText title={"Birt Day : " + formattedDate}></CustomText>
          </TouchableOpacity>
        </View>
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
        <CustomText title={gender.toString()}></CustomText>
        <RadioForm
          radio_props={options}
          initial={0} //initial value of this group
          onPress={(value) => {
            setGender(value)
          }} //if the user changes options, set the new value
        />

        <Button title={"Save Info User"} onPress={updateInfoUser} />
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
  content: {
    flex: 1,
  },
  input: {
    height: 40,
    borderWidth: 1,
    margin: 8,
    borderColor: color.colorHeader,
    borderRadius: 8,
    backgroundColor: color.text,
  },
  boxSlider: {
    alignItems: "center",
  },
  height: {
    width: scale(350),
  },
  boxBirtday: {
    alignItems: "center",
  },
  btnBirtday: {
    width: scale(150),
    margin: 8,
  },
})
