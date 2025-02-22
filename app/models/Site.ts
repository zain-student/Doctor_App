import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  SiteId: number
  SiteName: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const SiteModel = types
  .model("Site")
  .props({
    SiteId: types.number,
    SiteName: types.identifier
  })
  .actions(withSetPropAction)
  .views((site) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in SiteModel', site)
      const defaultValue = { title: site.SiteName?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Site extends Instance<typeof SiteModel> {}
export interface SiteSnapshotOut extends SnapshotOut<typeof SiteModel> {}
export interface SiteSnapshotIn extends SnapshotIn<typeof SiteModel> {}

// @demo remove-file
