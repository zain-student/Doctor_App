import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { User, UserModel } from "./User"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const UserStoreModel = types
  .model("UserStore")
  .props({
    users: types.array(UserModel),
    // favorites: types.array(types.reference(UserModel)),
    // favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchUsers() {
      const response = await api.getUsers()
      if (response.kind === "ok") {
        store.setProp("users", response.users)
        console.log('response users.....', response.users)
        console.log('response store.....', store)
        console.log('response stores users.....', store.users)

      } else {
        console.tron.error(`Error fetching users: ${JSON.stringify(response)}`, [])
      }
    },
    addFavorite(user: User) {
      store.favorites.push(user)
    },
    removeFavorite(user: User) {
      store.favorites.remove(user)
    },
  }))
  .views((store) => ({
    get usersForList() {
      // return store.favoritesOnly ? store.favorites : store.users
      console.log('Store Users...... in View', store)
      return store.users

    },

    hasFavorite(user: User) {
      return store.favorites.includes(user)
    },
  }))
  .actions((store) => ({
    toggleFavorite(user: User) {
      if (store.hasFavorite(user)) {
        store.removeFavorite(user)
      } else {
        store.addFavorite(user)
      }
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}

// @demo remove-file
