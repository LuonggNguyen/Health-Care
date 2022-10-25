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
      database.ref("/post").on("value", (response) => {
        const listkey = Object.keys(response.val())
        listkey.map((key) => {
          database.ref("/posts/" + key).update({
            idPost: key,
          })
        })
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
