const { Dimensions } = require("react-native")

const { width, height } = Dimensions.get("window")
const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const scale = (size) => (width / guidelineBaseWidth) * size
const verticleScale = (size) => (height / guidelineBaseHeight) * size
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor

export { scale, verticleScale, moderateScale }
