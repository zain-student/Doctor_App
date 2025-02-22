import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Site, SiteModel } from "./Site"
import { api } from "app/services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const SiteStoreModel = types
  .model("SiteStore")
  .props({
    sites: types.array(SiteModel),
    selectedSite: types.array(types.reference(SiteModel)),
    favorites: types.array(types.reference(SiteModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchSites() {
      const response = await api.getSites()
      if (response.kind === "ok") {
        store.setProp("sites", response.sites)
        console.log('response sites.....', response.sites)
        console.log('response store.....', store)
        console.log('response stores sites.....', store.sites)
      } else {
        console.tron.error(`Error fetching sites: ${JSON.stringify(response)}`, [])
      }
    },
    selectSite( site: Site){
      store.selectedSite.push(site)
    },
    deselectSite(site: Site) {
      store.selectedSite.remove(site)
    },
    addFavorite(site: Site) {
      store.favorites.push(site)
    },
    removeFavorite(site: Site) {
      store.favorites.remove(site)
    },
  }))
  .views((store) => ({
    get sitesForList() {
      // return store.favoritesOnly ? store.favorites : store.sites
      console.log('Store Sites...... in View', store)
      return store.sites
    },
    // get selectedSite(){
    //   console.log('selected Site in view...', store.sites)
    //   return store.selectedSite
    // },
    hasFavorite(site: Site) {
      return store.favorites.includes(site)
    },
    siteSelected(site: Site) {
      return store.selectedSite.includes(site)
    },
    getSelectedSite() {
      return store.selectedSite.length > 0 ? store.selectedSite[0] : null
    },
  }))
  .actions((store) => ({
    toggleFavorite(site: Site) {
      if (store.hasFavorite(site)) {
        store.removeFavorite(site)
      } else {
        store.addFavorite(site)
      }
    },
    toggleSite(site: Site) {
      if (!store.siteSelected(site))
        store.selectedSite[0] = site
    },
  }))

export interface SiteStore extends Instance<typeof SiteStoreModel> {}
export interface SiteStoreSnapshot extends SnapshotOut<typeof SiteStoreModel> {}

// @demo remove-file
