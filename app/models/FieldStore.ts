import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Field, FieldModel } from "./Field"
import { api } from "app/services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const FieldStoreModel = types
  .model("FieldStore")
  .props({
    fields: types.array(FieldModel),
    selectedField: types.array(types.reference(FieldModel)),
    favorites: types.array(types.reference(FieldModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchFields() {
      const response = await api.getFields()
      if (response.kind === "ok") {
        store.setProp("fields", response.fields)
        console.log('response fields.....', response.fields)
        console.log('response store.....', store)
        console.log('response stores fields.....', store.fields)
      } else {
        console.tron.error(`Error fetching fields: ${JSON.stringify(response)}`, [])
      }
    },
    selectField( field: Field){
      store.selectedField.push(field)
    },
    deselectField(field: Field) {
      store.selectedField.remove(field)
    },
    addFavorite(field: Field) {
      store.favorites.push(field)
    },
    removeFavorite(field: Field) {
      store.favorites.remove(field)
    },
  }))
  .views((store) => ({
    get fieldsForList() {
      // return store.favoritesOnly ? store.favorites : store.fields
      console.log('Store Fields...... in View', store)
      return store.fields
    },
    // get selectedField(){
    //   console.log('selected Field in view...', store.fields)
    //   return store.selectedField
    // },
    hasFavorite(field: Field) {
      return store.favorites.includes(field)
    },
    fieldSelected(field: Field) {
      return store.selectedField.includes(field)
    },
    getSelectedField() {
      return store.selectedField.length > 0 ? store.selectedField[0] : null
    },
  }))
  .actions((store) => ({
    toggleFavorite(field: Field) {
      if (store.hasFavorite(field)) {
        store.removeFavorite(field)
      } else {
        store.addFavorite(field)
      }
    },
    toggleField(field: Field) {
      if (!store.fieldSelected(field))
        store.selectedField[0] = field
    },
  }))

export interface FieldStore extends Instance<typeof FieldStoreModel> {}
export interface FieldStoreSnapshot extends SnapshotOut<typeof FieldStoreModel> {}

// @demo remove-file
