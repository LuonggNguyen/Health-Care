import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Input, Text } from "@rneui/themed"
import { firebase } from "@react-native-firebase/database"
import { database } from "../../configs/firebase"
import { color } from "../theme"
import { CustomText } from "../components/CustomText"
import { scale, verticleScale } from "../utils/Scale/Scaling"
import RadioForm from "react-native-simple-radio-button"
import { CustomButton } from "../components/CustomButton"
import Slider from "@react-native-community/slider"
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import DatePicker from "react-native-date-picker"
import moment from "moment"

export const UserUpdateProfileScreen: FC<
  StackScreenProps<NavigatorParamList, "userUpdateProfile">
> = observer(function UserUpdateProfileScreen({ navigation }) {
  const [infoUser, setInfoUser] = useState<InfoUser>()
  const [minBP, setMinBP] = useState("")
  const [maxBP, setMaxBP] = useState("")
  const [email, setEmail] = useState("")
  const [weight, setWeight] = useState(0)
  const [height, setHeight] = useState(0)
  const [heartbeat, setHeartbeat] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState()
  const [birthday, setBirthDay] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState("")
  const options = [
    { label: "Nam", value: true },
    { label: "Nữ", value: false },
  ]
  useEffect(() => {
    database.ref("/users/" + firebase.auth().currentUser.uid).on("value", (snapshot) => {
      const [min, max] = snapshot.val().bloodPressure.split("/")
      setInfoUser(snapshot.val())
      setGender(snapshot.val().gender)
      setMinBP(min)
      setMaxBP(max)
      setEmail(snapshot.val().email)
      setHeartbeat(snapshot.val().heartbeat)
      setHeight(snapshot.val().height)
      setWeight(snapshot.val().weight)
      setPhone(snapshot.val().phoneNumber)
      setDate(snapshot.val().birthday)
    })
    return () => {
      setInfoUser(null)
      setGender(undefined)
      setMinBP(undefined)
      setMaxBP(undefined)
      setEmail(undefined)
      setHeartbeat(undefined)
      setHeight(undefined)
      setWeight(undefined)
      setPhone(undefined)
      setDate(undefined)
    }
  }, [])

  const updateInfoUser = (email, phone, date, gender, height, weight, heartbeat, minBP, maxBP) => {
    database
      .ref("/users/" + firebase.auth().currentUser.uid)
      .set({
        uid: firebase.auth().currentUser.uid,
        name: firebase.auth().currentUser.displayName,
        email: email,
        photoUrl: "https://i.pinimg.com/originals/12/61/dd/1261dda75d943cbd543cb86c15f31baa.jpg",
        phoneNumber: phone,
        birthday: date,
        gender: gender, //true is male - false is female
        height: height,
        weight: weight,
        heartbeat: heartbeat,
        bloodPressure: `${minBP}/${maxBP}`,
      })
      .then(() => {
        console.log("Update Info Successfully !!")
        navigation.goBack()
      })
  }
  return (
    <View style={styles.container}>
      <MyHeader title="User Profile" onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <Input
          containerStyle={styles.input}
          placeholder="Phone"
          onChangeText={(e) => setPhone(e)}
          value={phone}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          leftIcon={<Ionicons name="call" size={24} color="gray" />}
        />
        <Input
          containerStyle={styles.input}
          placeholder="Email"
          onChangeText={(e) => setEmail(e)}
          value={email}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          leftIcon={<Ionicons name="mail" size={24} color="gray" />}
        />
        <Input
          containerStyle={styles.input}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          placeholder="Birth Day DD/MM/YYYY"
          value={date}
          onChangeText={(e) => setDate(e)}
          leftIcon={
            <Ionicons name="calendar" size={24} color="gray" onPress={() => setOpen(true)} />
          }
        />
        <DatePicker
          title="Select Day"
          mode="date"
          modal
          open={open}
          date={birthday}
          onConfirm={(date) => {
            setOpen(false)
            setBirthDay(date)
            setDate(moment(date).format("DD/MM/yyyy"))
          }}
          onCancel={() => {
            setOpen(false)
          }}
        />
        <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold", margin: 8 }}>
          Info Health
        </Text>
        <View style={styles.boxSlider}>
          <CustomText title={"Height: " + height + " cm"}></CustomText>
          <Slider
            style={styles.height}
            maximumValue={250}
            minimumValue={100}
            minimumTrackTintColor="#cccc"
            maximumTrackTintColor="#cccc"
            step={1}
            value={infoUser?.height}
            onValueChange={(height) => setHeight(height)}
          />
        </View>
        <View style={styles.boxSlider}>
          <CustomText title={"Weight: " + weight + " kg"}></CustomText>
          <Slider
            style={styles.height}
            minimumValue={20}
            maximumValue={200}
            minimumTrackTintColor="#cccc"
            maximumTrackTintColor="#cccc"
            step={1}
            value={infoUser?.weight}
            onValueChange={(weight) => setWeight(weight)}
          />
        </View>
        <Input
          containerStyle={styles.input}
          placeholder="Heartbeat"
          onChangeText={(e) => setHeartbeat(e)}
          defaultValue={heartbeat}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          leftIcon={<FontAwesome name="heartbeat" size={24} color="gray" />}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#000", fontSize: 16, fontWeight: "bold", margin: 8 }}>
            Blood Pressure
          </Text>
          <Input
            containerStyle={styles.inputBloodPressure}
            placeholder="Min"
            onChangeText={(e) => setMinBP(e)}
            value={minBP}
            inputContainerStyle={{ borderBottomWidth: 0 }}
          />
          <Input
            containerStyle={styles.inputBloodPressure}
            placeholder="Max"
            onChangeText={(e) => setMaxBP(e)}
            value={maxBP}
            inputContainerStyle={{ borderBottomWidth: 0 }}
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
          <CustomButton
            title={"Save Info User"}
            onPress={() =>
              updateInfoUser(email, phone, date, gender, height, weight, heartbeat, minBP, maxBP)
            }
          />
        </View>
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
    marginTop: verticleScale(20),
    flex: 1,
    alignItems: "center",
  },
  input: {
    textAlign: "center",
    height: 50,
    width: 300,
    margin: 15,
    borderRadius: 16,
    backgroundColor: color.background,
  },
  inputBloodPressure: {
    textAlign: "center",
    height: 50,
    width: 120,
    marginVertical: 15,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: color.background,
  },
  boxSlider: {
    margin: 12,
    alignItems: "center",
  },
  height: {
    width: scale(250),
  },
  boxGender: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: scale(30),
    width: scale(200),
    alignItems: "center",
    flex: 1,
  },
  boxButton: {
    marginBottom: verticleScale(20),
  },
  radioButton: {
    paddingLeft: 8,
  },
})
