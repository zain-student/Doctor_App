import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  PatientId: number,
  PatientVitalId: number,
  VitalsInformationId: number,
  Date: string,
  Time: string,
  Readings: string,
  Unit: string,
  Name: string,
  Description: string,
  NurseName: string,
  EnteredOn: string,
  NursingNoteId: number
}

/**
 * This represents an episode of React Native Radio.
 */
export const VitalModel = types
  .model("Vital")
  .props({
    PatientId: types.number,
    PatientVitalId: types.number,
    VitalsInformationId: types.number,
    Date: types.string,
    Time: types.string,
    Readings: types.maybeNull(types.string),
    Unit: types.maybeNull(types.string),
    Name: types.maybeNull(types.string),
    Description: types.maybeNull(types.string),
    NurseName: types.string,
    EnteredOn: types.string,
    NursingNoteId: types.number
  })
  .actions(withSetPropAction)
  .views((Vital) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in VitalModel', Vital)
      const defaultValue = { title: Vital.Name?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Vital extends Instance<typeof VitalModel> {}
export interface VitalSnapshotOut extends SnapshotOut<typeof VitalModel> {}
export interface VitalSnapshotIn extends SnapshotIn<typeof VitalModel> {}

// @demo remove-file
