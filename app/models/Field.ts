import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { translate } from "../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  VitalInformationId: number,
  Name: string,
  IsCalculated: boolean,
  Unit: string,
  Reading: string
}
/**
 * This represents an episode of React Native Radio.
 */
export const FieldModel = types
  .model("Field")
  .props({
    VitalInformationId: types.identifierNumber,
    Name: types.string,
    IsCalculated: types.boolean,
    Unit: types.string,
    Reading: types.maybeNull(types.string)
  })
  .actions(withSetPropAction)
  .views((field) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in FieldModel', field)
      const defaultValue = { title: field.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Field extends Instance<typeof FieldModel> {}
export interface FieldSnapshotOut extends SnapshotOut<typeof FieldModel> {}
export interface FieldSnapshotIn extends SnapshotIn<typeof FieldModel> {}

// @demo remove-file
