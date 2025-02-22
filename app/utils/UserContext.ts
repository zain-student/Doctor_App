import React from 'react';
import {MMKV} from 'react-native-mmkv';

export const mmkvStorage = new MMKV();

export type userContextType = {
  isLoggedIn: boolean;
  selectedPatientIndex: number;
  clientSocket: any;
  refreshData: boolean;
  patientsData: any;
  //Updaters
  updateclientSocket: (value: any) => void;
  startConnectionDiscovery: () => void;
  updatePatientsData: (value: any) => void;
  updateSelectedPatientIndex: (val: number) => void;
  updateIsLoggedIn: (val: boolean) => void;
};

export const UserContext = React.createContext<userContextType>({
  clientSocket: null,
  refreshData: false,
  patientsData: [],
  selectedPatientIndex: -1,
  updateclientSocket: () => {},
  startConnectionDiscovery: () => {},
  updatePatientsData: () => {},
  updateSelectedPatientIndex: () => {},
});
