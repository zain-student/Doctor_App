import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {api} from '../services/api';
import {LoginModel} from './Login';
import {UserModel} from './User';
import {MMKV} from 'react-native-mmkv';
import {mmkvStorage} from 'app/utils/UserContext';

export const AuthenticationStoreModel = types
  .model('AuthenticationStore')
  .props({
    login: types.array(UserModel),
    authToken: types.maybe(types.string),
    authEmail: '',
    appStatus: '1',
  })
  .views(store => ({
    get isAuthenticated() {
      return !!store.authToken;
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank";
      // if (store.authEmail.length < 6) return "must be at least 6 characters"
      // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
      //   return "must be a valid email address"
      return '';
    },
    appIsOnline() {
      return store.appStatus;
    },
  }))
  .actions(store => ({
    async loginUser(UserName, UserPassword) {
      const response = await api.loginUser(UserName, UserPassword);
      console.log('login response......', response);

      if (response.kind === 'ok') {
        console.log('login response......', response);
        this.setAuthToken(response.token);
        this.distributeAuthToken(response.token);
        this.setUser(response.login);
        mmkvStorage.set('loggedInUsername', response.login[0].FullName);
        mmkvStorage.set('loggedInUserId', response.login[0].UserId);
        // store.setProp("login", response.login)
      } else {
        console.tron.error(
          `Error while loggin in: ${JSON.stringify(response)}`,
          [],
        );
      }
    },
    setAuthToken(value?: string) {
      if (value) mmkvStorage.set('authToken', value);
      store.authToken = value;
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, '');
    },
    distributeAuthToken(value?: string) {
      // optionally grab the store's authToken if not passing a value
      const token = value || store.authToken;
      console.log('auth token...', token);
      api.apisauce.setHeader('Authorization', `Bearer ${token}`);
    },
    logout() {
      console.log('logging out.....');
      store.authToken = undefined;
      store.authEmail = '';
    },
    setAppIsOnline(appStatus: string) {
      console.log('current App Status .....', store.appStatus);
      console.log('change App status.....', appStatus);

      store.appStatus = appStatus;
      console.log('change App status.....', store.appIsOnline());
    },
    setUser(user) {
      store.login = user;
    },
  }));

export interface AuthenticationStore
  extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot
  extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
