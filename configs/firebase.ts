import { firebase } from "@react-native-firebase/database"
import auth from "@react-native-firebase/auth"



export const database = firebase
.app()
.database("https://healthcare-856bd-default-rtdb.asia-southeast1.firebasedatabase.app")


export const user = auth().currentUser