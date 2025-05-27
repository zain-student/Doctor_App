import { Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export const isTablet = width >= 600 // you can adjust this threshold
