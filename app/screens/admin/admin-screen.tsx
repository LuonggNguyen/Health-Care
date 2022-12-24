/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-inline-styles */
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, StyleSheet, TouchableOpacity, View, Text, SafeAreaView } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { color } from "../../theme"
import { database } from "../../../configs/firebase"
import { moderateScale, scale, verticleScale } from "../../utils/Scale/Scaling"
import { Header } from "@rneui/themed"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { FAB, Image } from "@rneui/base"

// @ts-ignore
export const AdminScreen: FC<StackScreenProps<NavigatorParamList, "admin">> = observer(
  function AdminScreen({ navigation }) {
    const [listDoctors, setListDoctors] = useState([])

    useEffect(() => {
      database.ref("/doctors").on("value", (response) => {
        setListDoctors(Object.values(response.val()))
      })
      console.log(listDoctors)
      return () => setListDoctors(undefined)
    }, [])
    const logout = () => {
      auth().currentUser.providerData[0].providerId === "google.com"
        ? GoogleSignin.signOut().then(() => {
            auth().signOut()
            navigation.navigate("login")
          })
        : auth()
            .signOut()
            .then(() => {
              navigation.navigate("login")
            })
    }

    return (
      <View style={styles.container}>
        <Header
          centerComponent={
            <Text style={{ color: color.colorTextHeader, fontSize: 24, fontWeight: "bold" }}>
              List Doctors
            </Text>
          }
          rightComponent={
            <MaterialIcons name="logout" size={24} color={color.colorTextHeader} onPress={logout} />
          }
          backgroundColor={color.colorHeader}
        />
        <SafeAreaView>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={listDoctors}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("doctorUpdateProfile", { detailsDoctor: item })
                  }
                >
                  <View style={styles.content}>
                    <View style={{ paddingLeft: 20 }}>
                      <Image
                        style={{ width: scale(90), height: scale(90) }}
                        source={{ uri: item.photoUrl }}
                      ></Image>
                    </View>
                    <View style={styles.boxInfor}>
                      <Text style={styles.textName}>{item.name}</Text>
                      <Text style={styles.text}>{item.department}</Text>
                      <Text style={styles.text}>{item.email}</Text>
                      <Text style={styles.text}>{item.gender ? "Male" : "Female"}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
            numColumns={1}
          />
        </SafeAreaView>
        <FAB
          placement="right"
          size="large"
          color={color.colorHeader}
          onPress={() => {
            navigation.navigate("registerDoctor")
          }}
        >
          <MaterialIcons name="add" color={"#fff"} size={scale(24)} />
        </FAB>
      </View>
    )
  },
)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: verticleScale(10),
    marginHorizontal: 6,
    paddingVertical: 10,
    flexDirection: "row",
    borderColor: "#bcbcbcbc",
    borderWidth: 1,
    borderRadius: 8,
  },
  boxInfor: {
    marginHorizontal: scale(20),
    borderRadius: 16,
    alignItems: "center",
  },
  textName: {
    padding: verticleScale(6),
    fontSize: moderateScale(18),
    fontWeight: "500",
  },
  text: {
    padding: verticleScale(2),
    fontSize: moderateScale(14),
  },
})
