import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  ServiceId: number
  ServiceName: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const ServiceModel = types
  .model("Service")
  .props({
    ServiceId: types.identifierNumber,
    ServiceName: types.string,
    Charges: types.string
  })
  .actions(withSetPropAction)
  .views((service) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in ServiceModel', service)
      const defaultValue = { title: service.ServiceName?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Service extends Instance<typeof ServiceModel> {}
export interface ServiceSnapshotOut extends SnapshotOut<typeof ServiceModel> {}
export interface ServiceSnapshotIn extends SnapshotIn<typeof ServiceModel> {}

// @demo remove-file
