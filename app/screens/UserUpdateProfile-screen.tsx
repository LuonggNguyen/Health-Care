import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, StyleSheet, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { MyHeader } from "../components/MyHeader"
import { Dialog, Input, Text } from "@rneui/themed"
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
> = observer(function UserUpdateProfileScreen({ navigation, route }) {
  const user = route.params.detailsUser
  const [email, setEmail] = useState(user?.email)
  const [birthday, setBirthDay] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  if (!user.bloodPressure) {
    user.bloodPressure = "/"
  }
  const [min, max] = user?.bloodPressure?.split("/")
  const [minBP, setMinBP] = useState(min)
  const [maxBP, setMaxBP] = useState(max)
  const [weight, setWeight] = useState(user?.weight)
  const [height, setHeight] = useState(user?.height)
  const [heartbeat, setHeartbeat] = useState(user?.heartbeat)
  const [phone, setPhone] = useState(user?.phoneNumber)
  const [gender, setGender] = useState(user?.gender)
  const [date, setDate] = useState(user?.birthday)
  const options = [
    { label: "Male", value: true },
    { label: "Female", value: false },
  ]

  const updateInfoUser = (email, phone, date, gender, height, weight, heartbeat, minBP, maxBP) => {
    setLoading(true)
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
        setLoading(false)
        navigation.goBack()
      })
  }
  if (loading) {
    return (
      <View style={styles.container}>
        <MyHeader title="User Profile" onPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Dialog.Loading />
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <MyHeader title="User Profile" onPress={() => navigation.goBack()} />
      <ScrollView>
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
          <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold", marginVertical: 8 }}>
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
              value={height}
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
              value={weight}
              onValueChange={(weight) => setWeight(weight)}
            />
          </View>
          <Input
            containerStyle={styles.input}
            placeholder="Heartbeat"
            onChangeText={(e) => setHeartbeat(parseInt(e))}
            value={heartbeat?.toString()}
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
              formHorizontal={true}
              radio_props={options}
              initial={gender ? 0 : 1}
              onPress={(value) => {
                setGender(value)
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.boxButton}>
        <CustomButton
          title={"Save Info User"}
          onPress={() =>
            updateInfoUser(email, phone, date, gender, height, weight, heartbeat, minBP, maxBP)
          }
        />
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
    width: 100,
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
    alignItems: "center",
    marginBottom: verticleScale(20),
  },
  radioButton: {
    paddingLeft: 8,
  },
})
