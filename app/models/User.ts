import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
// import { types } from "@babel/core"

interface Enclosure {
  UserId: number,
  UserName: string,
  UserPassword: string,
  FullName: string,
  RoleId: number
}

/**
 * This represents an episode of React Native Radio.
 */
export const UserModel = types
  .model("User")
  .props({
    UserId: types.number,
    UserName: types.string,
    UserPassword: types.maybeNull(types.string),
    FullName: types.string,
    RoleId: types.number
  })
  .actions(withSetPropAction)
  .views((user) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in UserModel', user)
      const defaultValue = { title: user.UserName?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}

// @demo remove-file
