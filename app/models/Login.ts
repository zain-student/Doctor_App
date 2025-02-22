import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"
import { UserModel } from "./User"
// import { types } from "@babel/core"

interface Enclosure {
  data: [],
  code: number,
  message: string,
  token: string,
  Error: string,
  ErrorList: string
}

/**
 * This represents an episode of React Native Radio.
 */
export const LoginModel = types
  .model("Login")
  .props({
    data: types.array(UserModel),
    code: types.number,
    message: types.string,
    token: types.string,
    Error: types.string,
    ErrorList: types.string,
  })
  .actions(withSetPropAction)
  .views((login) => ({
    get parsedTitleAndSubtitle() {
      console.log('-=-=-=-= in UserModel', login)
      const defaultValue = { title: login.message?.trim(), subtitle: "" }

      console.log('-=-=-=-= in Default Value', defaultValue)

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
  }))

export interface Login extends Instance<typeof LoginModel> {}
export interface LoginSnapshotOut extends SnapshotOut<typeof LoginModel> {}
export interface LoginSnapshotIn extends SnapshotIn<typeof LoginModel> {}

// @demo remove-file
