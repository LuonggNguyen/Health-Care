import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../navigators"
import { database } from "../../configs/firebase"

// @ts-ignore
export const UserHealthScreen: FC<StackScreenProps<NavigatorParamList, "userHealth">> = observer(
  function UserHealthScreen() {
    useEffect(() => {
      database.ref("/Posts").on("value", (response) => {
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
