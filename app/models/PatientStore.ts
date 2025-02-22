import {Instance, SnapshotOut, types} from 'mobx-state-tree';
import {api} from '../services/api';
import {Patient, PatientModel} from './Patient';
import {Service, ServiceModel} from './Service';
import {withSetPropAction} from './helpers/withSetPropAction';
import {ToastAndroid} from 'react-native';

const PATIENTS = [
  {
    PatientId: 123440,
    FirstName: 'Abida',
    LastName: 'Hassan Ali',
    MiddleName: null,
    CNICRelationId: 0,
    RelationId: 0,
    MobileNumber1: null,
    Longitude: null,
    Latitude: null,
    PatientSpouseName: null,
    PatientName: null,
    Biometric: null,
    AddressLine1: null,
    AddressLine2: null,
    CityId: null,
    ProvinceId: null,
    HomePhone: null,
    CellPhone: null,
    WorkPhoneExt: null,
    SiteCod: null,
    OrganizationCod: null,
    IsZakatEligible: false,
    ZakatEligibleOn: null,
    IsVaccination: false,
    VaccinationOn: null,
    PrefferedLanguageId: null,
    RaceId: null,
    MaritalStatusId: null,
    ReligionId: null,
    EnteredBy: 0,
    EnteredOn: '2024-04-27T16:49:42.77',
    UpdatedBy: 0,
    UpdatedOn: '0001-01-01T00:00:00',
    PatientImage: null,
    WorkPhone: null,
    VaccinationBy: null,
    MRNNo: '01-01-0123440',
    DOB: '1/1/2016 12:00:00 AM',
    CNIC: '11111-1111111-1',
    CellPhoneNumber: '00000000000',
    Gender: 'Female',
    SiteName: 'Gharo',
    MartialStatus: 'Single',
    SpouseName: 'Hassan Ali',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Ghari bit Sakro',
    VillageName: null,
    SiteId: null,
  },
  {
    PatientId: 123439,
    FirstName: 'Abdul Jabbar',
    LastName: 'Abdul Ghani',
    MiddleName: null,
    CNICRelationId: 0,
    RelationId: 0,
    MobileNumber1: null,
    Longitude: null,
    Latitude: null,
    PatientSpouseName: null,
    PatientName: null,
    Biometric: null,
    AddressLine1: null,
    AddressLine2: null,
    CityId: null,
    ProvinceId: null,
    HomePhone: null,
    CellPhone: null,
    WorkPhoneExt: null,
    SiteCod: null,
    OrganizationCod: null,
    IsZakatEligible: false,
    ZakatEligibleOn: null,
    IsVaccination: false,
    VaccinationOn: null,
    PrefferedLanguageId: null,
    RaceId: null,
    MaritalStatusId: null,
    ReligionId: null,
    EnteredBy: 0,
    EnteredOn: '2024-04-27T16:42:56.947',
    UpdatedBy: 0,
    UpdatedOn: '0001-01-01T00:00:00',
    PatientImage: null,
    WorkPhone: null,
    VaccinationBy: null,
    MRNNo: '01-01-0123439',
    DOB: '2/24/1992 12:00:00 AM',
    CNIC: '41406-2878335-7',
    CellPhoneNumber: '03057015877',
    Gender: 'Male',
    SiteName: 'Gharo',
    MartialStatus: 'Married',
    SpouseName: 'Abdul Ghani',
    ZakatEligible: true,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Shafiabad',
    VillageName: null,
    SiteId: null,
  },
  {
    PatientId: 123438,
    FirstName: 'Naina',
    LastName: 'Ashraf',
    MiddleName: null,
    CNICRelationId: 0,
    RelationId: 0,
    MobileNumber1: null,
    Longitude: null,
    Latitude: null,
    PatientSpouseName: null,
    PatientName: null,
    Biometric: null,
    AddressLine1: null,
    AddressLine2: null,
    CityId: null,
    ProvinceId: null,
    HomePhone: null,
    CellPhone: null,
    WorkPhoneExt: null,
    SiteCod: null,
    OrganizationCod: null,
    IsZakatEligible: false,
    ZakatEligibleOn: null,
    IsVaccination: false,
    VaccinationOn: null,
    PrefferedLanguageId: null,
    RaceId: null,
    MaritalStatusId: null,
    ReligionId: null,
    EnteredBy: 0,
    EnteredOn: '2024-04-27T16:02:45.07',
    UpdatedBy: 0,
    UpdatedOn: '0001-01-01T00:00:00',
    PatientImage: null,
    WorkPhone: null,
    VaccinationBy: null,
    MRNNo: '01-01-0123438',
    DOB: '1/1/2018 12:00:00 AM',
    CNIC: '11111-1111111-1',
    CellPhoneNumber: '00000000000',
    Gender: 'Female',
    SiteName: 'Gharo',
    MartialStatus: 'Single',
    SpouseName: 'Ashraf',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Thaim Goth',
    VillageName: null,
    SiteId: null,
  },
];

const PATIENTS_SELECTED = [
  {
    PatientId: 100033,
    FirstName: 'Muhammad Ali',
    LastName: 'Ali Muhammad ',
    MRNNo: '01-01-0100033',
    DOB: '1/1/2005 12:00:00 AM',
    CNIC: '41406-0270901-3',
    CellPhoneNumber: '03212055079',
    Gender: 'Male',
    SiteName: 'Gharo',
    MartialStatus: 'Single',
    SpouseName: 'Ali Muhammad',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Jam baranch',
    EnteredOn: '2023-10-16T18:39:17.75',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'OPD Charges',
        Charges: '40',
      },
    ],
    Status: 'CheckIn',
    CheckInSynced: false,
    Vitals: [],
  },
  {
    PatientId: 100032,
    FirstName: 'Akbari Naz',
    LastName: 'Zahid',
    MRNNo: '01-01-0100032',
    DOB: '10/1/1985 12:00:00 AM',
    CNIC: '41406-9577288-8',
    CellPhoneNumber: '03133751890',
    Gender: 'Female',
    SiteName: 'Gharo',
    MartialStatus: 'Married',
    SpouseName: 'Zahid',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Eid Ghah Mohallah',
    EnteredOn: '2023-10-16T16:37:45.11',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'OPD Charges',
        Charges: '40',
      },
    ],
    Status: 'CheckIn',
    CheckInSynced: false,
    Vitals: [],
  },
  {
    PatientId: 100031,
    FirstName: 'Zahid',
    LastName: 'Shahid',
    MRNNo: '01-01-0100031',
    DOB: '1/1/1980 12:00:00 AM',
    CNIC: '41406-9577288-8',
    CellPhoneNumber: '03133751890',
    Gender: 'Male',
    SiteName: 'Gharo',
    MartialStatus: 'Married',
    SpouseName: 'Shahid',
    ZakatEligible: false,
    Country: 'Pakistan',
    City: 'Thatta',
    Province: 'Sindh',
    Address: 'Eid Ghah Mohallah',
    EnteredOn: '2023-10-16T16:35:43.607',
    Services: [
      {
        ServiceId: 30013,
        ServiceName: 'OPD Charges',
        Charges: '40',
      },
    ],
    Status: 'CheckIn',
    CheckInSynced: false,
    Vitals: [],
  },
];
export const PatientStoreModel = types
  .model('PatientStore')
  .props({
    patients: types.array(PatientModel),
    selectedPatient: types.array(types.reference(PatientModel)),
    patientQueue: types.array(types.reference(PatientModel)),
    // favorites: types.array(types.reference(PatientModel)),
    // favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions(store => ({
    // async
    async fetchPatients(data) {
      store.setProp('patients', data);
      // store.setProp('patients', PATIENTS);
      // const response = await api.getPatients(site);
      // if (response.kind === 'ok') {
      //   store.setProp('patients', response.patients);
      //   console.log('response patients.....', response.patients?.length);
      //   // console.log('response store.....', store);
      //   // console.log('response stores patients.....', store.patients);
      // } else {
      //   ToastAndroid.show(
      //     'Unable to retrieve patients data. Please try again.',
      //     ToastAndroid.LONG,
      //   );
      //   return;
      // }
    },
    async fetchPatients(data) {
      // store.setProp('patients', data);
      // store.setProp('patients', PATIENTS);
      // const response = await api.getPatients(site);
      // if (response.kind === 'ok') {
      //   store.setProp('patients', response.patients);
      //   console.log('response patients.....', response.patients?.length);
      //   // console.log('response store.....', store);
      //   // console.log('response stores patients.....', store.patients);
      // } else {
      //   ToastAndroid.show(
      //     'Unable to retrieve patients data. Please try again.',
      //     ToastAndroid.LONG,
      //   );
      //   return;
      // }
    },
    async setPatientsData(data) {
      // store.setProp('patients', data);
    },
    addPatientInQueue(patient: Patient) {
      store.patientQueue.push(patient);
    },
    removePatientFromQueue(patient: Patient) {
      store.patientQueue.remove(patient);
    },
    selectPatient(patient: Patient) {
      store.selectedPatient[0] = patient;
    },
    deselectPatient(patient: Patient) {
      store.selectedPatient.remove(patient);
    },
    addFavorite(patient: Patient) {
      store.favorites.push(patient);
    },
    removeFavorite(patient: Patient) {
      store.favorites.remove(patient);
    },
    patientSelected(patient: Patient) {
      return store.selectedPatient.includes(patient);
    },
    getSelectedPatient() {
      return store.selectedPatient;
    },
    addSelectedPatientStatus(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].Status = status;
    },
    addServicesToSelectedPatient(services: Array<Service>) {
      console.log('selected Services list.......', services);
      for (let i = 0; i < services.length; i++) {
        if (store.selectedPatient.length > 0)
          console.log('selected Services list.......1', services[i]);
        console.log('selected Services list.......2', store.selectedPatient[0]);
        console.log(
          'selected Services list.......2',
          store.selectedPatient[0].Services,
        );

        // store.selectedPatient[0].Services = services
        if (!store.selectedPatient[0].Services.includes(services[i])) {
          store.selectedPatient[0].Services.push(services[i]);
          console.log(
            'selected Services list.......3',
            store.selectedPatient[0].Services,
          );
        }
      }
    },
    addCheckedInSynced(checkedInSynced: boolean) {
      if (store.selectedPatient[0])
        store.selectedPatient[0].CheckInSynced = checkedInSynced;
    },
    addNewPatient(patient: Patient) {
      console.log('patient in add new patient....', patient);
      store.patients.push(patient);
    },
    addAddressToNewPatient(
      address: string,
      country: string,
      province: string,
      city: string,
      index: number,
    ) {
      store.patients[index].Address = address;
      store.patients[index].Country = country;
      store.patients[index].Province = province;
      store.patients[index].City = city;
    },
    selectNewPatient(index: number) {
      console.log('index in select New Patient....', index);
      console.log('index in select New Patient....', store.patients[index]);
      store.selectedPatient[0] = store.patients[index];
    },
    emptySelectedPatient() {
      store.selectedPatient.clear();
    },
    addVitals(vitals: any) {
      console.log('vitals inside mobx....', vitals);
      var array = [];
      array.push(vitals);
      console.log('new array in vitals mobx...', array);
      if (store.selectedPatient[0]) {
        store.selectedPatient[0].Vitals = array;
        store.selectedPatient[0].Status = 'Vitals';
      }
    },
    addNursingNote(nursingNote: string) {
      if (store.selectedPatient[0])
        store.selectedPatient[0].NursingNote = nursingNote;
    },
    addVitalsTimeTime(status: string) {
      if (store.selectedPatient.length > 0)
        store.selectedPatient[0].VitalsTime = status;
    },
  }))
  .views(store => ({
    get patientsForList() {
      // return store.favoritesOnly ? store.favorites : store.patients
      return store.patients;
    },
    patientQueueForList() {
      return store.patientQueue;
    },
    hasFavorite(patient: Patient) {
      return store.favorites.includes(patient);
    },
    selectAPatient(patient: Patient) {
      console.log('patientSelected in store....', store.selectedPatient[0]);
      if (!store.patientSelected(patient)) store.selectPatient(patient);
    },
    latestIndex() {
      return store.patients.length;
    },
  }))
  .actions(store => ({
    toggleFavorite(patient: Patient) {
      if (store.hasFavorite(patient)) {
        store.removeFavorite(patient);
      } else {
        store.addFavorite(patient);
      }
    },
  }));

export interface PatientStore extends Instance<typeof PatientStoreModel> {}
export interface PatientStoreSnapshot
  extends SnapshotOut<typeof PatientStoreModel> {}

// @demo remove-file
