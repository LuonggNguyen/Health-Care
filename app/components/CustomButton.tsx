import { Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"
import React from "react"
import { observer } from "mobx-react-lite"
import { moderateScale, scale } from "../utils/Scale/Scaling"

export interface CustomButton {
  title?: any
  onPress?: any
}

export const CustomButton = React.memo(
  observer(function MyHeader(props: CustomButton) {
    return (
      <SafeAreaView>
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
          {/* <CustomText title={props.title} size={moderateScale(18)}></CustomText> */}
          <Text style={styles.titleButton}>{props.title}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }),
)
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4ea9fd",
    width: scale(250),
    height: scale(50),
    borderRadius: 25,
    justifyContent: "center",
  },
  titleButton: {
    fontSize: moderateScale(18),
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
})
