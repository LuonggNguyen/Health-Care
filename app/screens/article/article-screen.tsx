import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, StyleSheet } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { database } from "../../../configs/firebase"

// @ts-ignore
export const ArticleScreen: FC<StackScreenProps<NavigatorParamList, "article">> = observer(
  function ArticleScreen() {
    useEffect(() => {
      database.ref("/Post").on("value", (response) => {
        console.log(response.val())
      })
    }, [])
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return <View></View>
  },
)
const styles = StyleSheet.create({})
