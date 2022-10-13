import { Text, StyleSheet, View, TouchableOpacity } from "react-native"
import React, { Component } from "react"
import { observer } from "mobx-react-lite"
import { Button } from "@rneui/base"
import { CustomText } from "../commons/CustomText"
import { moderateScale, scale } from "../utils/Scale/Scaling"
import { color } from "../theme"

export interface CustomButton {
  title?: any
  onPress?: any
  size?: any
}

export const CustomButton = React.memo(
  observer(function MyHeader(props: CustomButton) {
    return (
      <TouchableOpacity style={styles.button} onPress={props.onPress}>
        {/* <CustomText title={props.title} size={moderateScale(18)}></CustomText> */}
        <Text style={styles.titleButton}>Save</Text>
      </TouchableOpacity>
    )
  }),
)
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#60c0f0",
    width: scale(150),
    height: scale(50),
    borderRadius: 25,
    justifyContent: "center",
  },
  titleButton: {
    fontSize: moderateScale(18),
    color: "#ffff",
    fontWeight: "700",
    textAlign: "center",
  },
})
