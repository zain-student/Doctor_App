import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {Vital, VitalModel} from './Vital';
import {api} from 'app/services/api';
import {withSetPropAction} from './helpers/withSetPropAction';
import {ToastAndroid} from 'react-native';

export const VitalStoreModel = types
  .model('VitalStore')
  .props({
    vitals: types.array(VitalModel),
    selectedVital: types.array(types.reference(VitalModel)),
    favorites: types.array(types.reference(VitalModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetchVitals(patientId: number) {
      const response = await api.getVitals(patientId);
      // if (response.kind === "ok") {
      if (response.kind === 'ok') {
        store.setProp('vitals', response.vitals);
        console.log('response vitals.....', response.vitals);
        console.log('response store.....', store);
        console.log('response stores vitals.....', store.vitals);
      } else if (response.kind === 'unauthorized') {
        console.log('-=-=-=-=-=-=-=-=data', response);
        // ToastAndroid.show('Authorization Failed!', ToastAndroid.SHORT)
      } else {
        console.tron.error(
          `Error fetching vitals: ${JSON.stringify(response)}`,
          [],
        );
      }
    },
    selectVital(vital: Vital) {
      store.selectedVital.push(vital);
    },
    deselectVital(vital: Vital) {
      store.selectedVital.remove(vital);
    },
    addFavorite(vital: Vital) {
      store.favorites.push(vital);
    },
    removeFavorite(vital: Vital) {
      store.favorites.remove(vital);
    },
  }))
  .views(store => ({
    get vitalsForList() {
      // return store.favoritesOnly ? store.favorites : store.vitals
      console.log('Store Vitals...... in View', store);
      return store.vitals;
    },
    // get selectedVital(){
    //   console.log('selected Vital in view...', store.vitals)
    //   return store.selectedVital
    // },
    hasFavorite(vital: Vital) {
      return store.favorites.includes(vital);
    },
    vitalSelected(vital: Vital) {
      return store.selectedVital.includes(vital);
    },
    getSelectedVital() {
      return store.selectedVital.length > 0 ? store.selectedVital[0] : null;
    },
  }))
  .actions(store => ({
    toggleFavorite(vital: Vital) {
      if (store.hasFavorite(vital)) {
        store.removeFavorite(vital);
      } else {
        store.addFavorite(vital);
      }
    },
    toggleVital(vital: Vital) {
      if (!store.vitalSelected(vital)) store.selectedVital[0] = vital;
    },
  }));

export interface VitalStore extends Instance<typeof VitalStoreModel> {}
export interface VitalStoreSnapshot
  extends SnapshotOut<typeof VitalStoreModel> {}

// @demo remove-file
