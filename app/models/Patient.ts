import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
import { ServiceModel, Service } from "./Service"
import { FieldModel } from "./Field"
import { ValueModel } from "./Value"
// import { types } from "@babel/core"

interface Enclosure {
  PatientId: number,
  FirstName: string,
  LastName: string,
  MRNNo: string,
  DOB: string,
  CNIC: string,
  CellPhoneNumber: string,
  Gender: string,
  SiteName: string,
  MartialStatus: string,
  SpouseName: string,
  ZakatEligible: boolean,
  Country: string,
  City: string,
  Province: string,
  Address: string,
  EnteredOn: string,
  Services: any,
  Status: string,
  CheckInSynced: boolean,
  Vitals: undefined,
}

/**
 * This represents an episode of React Native Radio.
 */
export const PatientModel = types
  .model("Patient")
  .props({
    PatientId: types.identifierNumber,
    FirstName: types.string,
    LastName: types.string,
    MRNNo: types.string,
    DOB: types.string,
    CNIC: types.string,
    CellPhoneNumber: types.string,
    Gender: types.string,
    SiteName: types.string,
    MartialStatus: types.string,
    SpouseName: types.string,
    ZakatEligible: types.boolean,
    Country: types.string,
    City: types.string,
    Province: types.string,
    Address: types.string,
    EnteredOn: types.string,
    Services: types.array(ServiceModel),

    Status: types.maybeNull(types.string),
    CheckInTime: types.maybeNull(types.string),
    VitalsTime: types.maybeNull(types.string),
    PrescriptionTime: types.maybeNull(types.string),
    PharmacyTime: types.maybeNull(types.string),
    CheckoutTime: types.maybeNull(types.string),
    
    CheckInSynced: types.maybeNull(types.boolean),
    NursingNote: types.maybeNull(types.string),
    Vitals: types.maybeNull(types.array(ValueModel))
  })
  .actions(withSetPropAction)
  .views((patient) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in PatientModel', patient)
      const defaultValue = { title: patient.FirstName?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Patient extends Instance<typeof PatientModel> {}
export interface PatientSnapshotOut extends SnapshotOut<typeof PatientModel> {}
export interface PatientSnapshotIn extends SnapshotIn<typeof PatientModel> {}

// @demo remove-file
