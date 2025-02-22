import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
import { string } from "mobx-state-tree/dist/internal"
// import { types } from "@babel/core"

interface Enclosure {

BMI: string,
'BMI Status': string,
'BP Diastolic': string,
'BP Systolic': string,
Height: string,
Pulse: string,
'R/R': string,
SpO2: string,
Temp: string,
'Waist Circumference': string,
Weight: string
}
/**
 * This represents an episode of React Native Radio.
 */
export const ValueModel = types
  .model("Value")
  .props({
    BMI: types.maybeNull(types.string),
    'BMI Status': types.maybeNull(types.string),
    "BP Diastolic": types.maybeNull(types.string),
    "BP Systolic": types.maybeNull(types.string),
    Height: types.maybeNull(types.string),
    Pulse: types.maybeNull(types.string),
    'R/R': types.maybeNull(types.string),
    SpO2: types.maybeNull(types.string),
    Temp: types.maybeNull(types.string),
    'Waist Circumference': types.maybeNull(types.string),
    Weight: types.maybeNull(types.string)
  })
  .actions(withSetPropAction)
  .views((value) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in ValueModel', value)
      const defaultValue = { title: value.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Value extends Instance<typeof ValueModel> {}
export interface ValueSnapshotOut extends SnapshotOut<typeof ValueModel> {}
export interface ValueSnapshotIn extends SnapshotIn<typeof ValueModel> {}

// @demo remove-file
