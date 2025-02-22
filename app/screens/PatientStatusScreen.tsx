import React, {FC, useCallback, useContext, useState} from 'react';
import {
  TouchableOpacity,
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  FlatList,
  TextInput,
  ToastAndroid,
  Clipboard,
  Modal,
  Platform,
} from 'react-native';
import {Button, ListItem, Screen, Text, Header} from '../components';
import {HomeTabScreenProps} from '../navigators/HomeNavigator';
import {spacing, colors, typography} from '../theme';
import {openLinkInBrowser} from '../utils/openLinkInBrowser';
import {isRTL} from '../i18n';
import {Icon} from '../components';
import {useStores} from 'app/models';
import {calculateFullAge} from 'app/models/helpers/dateHelpers';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {formatDate} from 'app/utils/formatDate';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {HeaderBackButton} from './HomeScreen/HeaderBackButton';
import {useFocusEffect} from '@react-navigation/native';
import {mmkvStorage, UserContext} from 'app/utils/UserContext';
import {DrawerIconButton} from './HomeScreen/DrawerIconButton';
import moment from 'moment';
import {
  getPhysicalExamFromPatients,
  getPresentCompFromPatients,
} from 'app/utils/UtilFunctions';
import Loading from 'app/components/Loading';
import {postRequest} from 'app/services/api/NetworkService';
import RNFS from 'react-native-fs';

const chainReactLogo = require('../../assets/images/cr-logo.png');
const reactNativeLiveLogo = require('../../assets/images/rnl-logo.png');
const reactNativeRadioLogo = require('../../assets/images/rnr-logo.png');
const reactNativeNewsletterLogo = require('../../assets/images/rnn-logo.png');

const STATUS = ['Checkin', 'Vitals', 'Prescription', 'Pharmacy', 'Checkout'];
const PATIENTS = [
  {
    patientId: 1,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: true,
    pharmacySynced: true,
    checkoutSynced: true,
  },
  {
    patientId: 2,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: true,
    pharmacySynced: true,
    checkoutSynced: false,
  },
  {
    patientId: 3,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: true,
    checkoutSynced: true,
  },
  {
    patientId: 4,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 5,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 6,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 7,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 8,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 9,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Pharmacy',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
  {
    patientId: 10,
    firstName: 'M. ',
    lastName: 'Ali',
    mrn: '123456789',
    gender: 'Male',
    age: '35Y|3M',
    status: 'Vitals',
    checkinSynced: true,
    vitalsSynced: true,
    prescriptionSynced: false,
    pharmacySynced: false,
    checkoutSynced: false,
  },
];
let popupMsg = '';
export const PatientStatusScreen: FC<HomeTabScreenProps<'PatientStatus'>> =
  function PatientStatusScreen(_props) {
    const [patient, setPatient] = useState('');
    const {navigation} = _props;
    const {patientStore, siteStore} = useStores();
    const {patientQueue, patientsForList} = patientStore;
    const [refresh, setRefresh] = useState('1');
    const userContext = useContext(UserContext);
    const [filteredData, setFilteredData] = useState([]);
    const [query, setQuery] = useState('');
    const [successResp, setSuccessResp] = useState<null | number[]>(null);
    const [checkoutSuccessResp, setCheckoutSuccessResp] = useState<
      null | number[]
    >(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showInfoPopup, setShowInfoPopup] = useState(false);

    useFocusEffect(
      useCallback(() => {
        setSuccessResp(global.successResponses ? global.successResponses : []);
        setCheckoutSuccessResp(
          global.checkoutSuccessResponses
            ? global.checkoutSuccessResponses
            : [],
        );

        console.warn('chec', global.successResponses);

        setRefresh(Math.random().toString());
        setIsLoading(false);
      }, [userContext.syncCompleted]),
    );

    useFocusEffect(
      useCallback(() => {
        try {
          if (global.receivedPatients?.length > 0) {
            let patients = JSON.parse(JSON.stringify(global.patientsBackup));
            for (let k = 0; k < global.receivedPatients.length; k++) {
              let exists = false;
              for (let i = 0; i < patients.length; i++) {
                if (
                  !global.receivedPatients[k].isSyncedLocally &&
                  global.receivedPatients[k]?.patient.PatientId ===
                    patients[i].patient.PatientId
                ) {
                  patients[i].patient = global.receivedPatients[k].patient;
                  patients[i].isFromNurse = true;

                  if (patients[i].vitals) {
                    console.warn('pushing');
                    patients[i].vitals.push(
                      ...global.receivedPatients[k].vitals,
                    );
                  } else {
                    patients[i].vitals = global.receivedPatients[k].vitals;
                  }
                  if (patients[i].presentingComplain?.length > 0) {
                    //nothing
                  } else {
                    patients[i].presentingComplain = [];
                  }
                  if (patients[i].physicalExams?.length > 0) {
                    //nothing
                  } else {
                    patients[i].physicalExams = [];
                  }
                  global.receivedPatients[k].isSyncedLocally = true;
                  exists = true;
                  console.warn('updated prev data');
                  break;
                }
              }
              if (!exists && !global.receivedPatients[k].isSyncedLocally) {
                global.receivedPatients[k].isSyncedLocally = true;
                global.receivedPatients[k].physicalExams = [];
                global.receivedPatients[k].presentingComplain = [];
                patients.unshift({
                  ...global.receivedPatients[k],
                  isFromNurse: true,
                });
              }
            }
            userContext.updatePatientsData(patients);
          }
          setRefresh(Math.random().toString());
        } catch (e) {
          console.warn('err', e);
        }
      }, [userContext.refreshData]),
    );

    const handleSearch = (text: string) => {
      try {
        const formattedQuery = text.toLowerCase();
        const _filteredData = userContext.patientsData.filter(item => {
          return item.patient.MRNNo.toLowerCase().includes(formattedQuery);
        });
        // console.warn('filtered', filteredData, advanceSearch);
        setFilteredData(_filteredData);
        setQuery(text);
      } catch (e) {
        setQuery(text);
      }
    };

    const onSyncPressed = (patientData: any) => {
      try {
        if (userContext.clientSocket) {
          setIsLoading(true);
          /////////
          let data = JSON.parse(JSON.stringify(patientData));
          let meds = data.medications.map(itm => {
            return `${itm.MedicineId}:${itm.DrugName}:${itm.Quantity}:${itm.EnteredOn}:${itm.OrderNumber}:${itm.ProviderName}:${itm.DirectionToPatient}`;
            // };
          });
          let dataToSend = {
            FirstName: data.patient.FirstName,
            LastName: data.patient.LastName,
            DOB: data.patient.DOB,
            Gender: data.patient.Gender,
            MRNNo: data.patient.MRNNo,
            PatientId: data.patient.PatientId,
            CheckInTime: data.patient.CheckInTime,
            VitalsTime: data.patient.VitalsTime,
            PrescriptionTime: data.patient.PrescriptionTime,
            status: 'Prescription',
            Medications: meds,
            //
          };
          console.warn('data to send', dataToSend);
          if (userContext.clientSocket) {
            userContext.clientSocket.write(
              JSON.stringify({sender: 'doctor', payload: dataToSend}),
            );
          }
          setTimeout(() => {
            setIsLoading(false);
          }, 1000 * 10);
        } else {
          ToastAndroid.show(
            'Unable to sync. Please check the connectivity',
            ToastAndroid.LONG,
          );
        }
      } catch (e) {
        setIsLoading(false);
      }
    };

    const onCheckoutSyncPressed = (patientData: any) => {
      try {
        if (userContext.clientSocket) {
          setIsLoading(true);
          sendCheckoutStatusToOtherApps({
            PatientId: patientData.patient.PatientId,
            CheckoutTime: patientData.patient.CheckoutTime,
          });
          setTimeout(() => {
            setIsLoading(false);
          }, 1000 * 10);
        } else {
          ToastAndroid.show(
            'Unable to sync. Please check the connectivity',
            ToastAndroid.LONG,
          );
        }
      } catch (e) {
        setIsLoading(false);
      }
    };

    const onSyncWithServerPressed = async (patientData: any) => {
      try {
        setIsLoading(true);
        let selectedServices: {
          ServiceId: string;
          ServiceName: string;
          Charges: string;
        }[] = [];
        let allergies: {
          Allergen: string;
          AllergenTypeId: number;
          AllergenType: string;
          Severity: string;
          OnSet: string;
          OnSetId: string;
          AllergenDate: string;
          EnteredBy: {
            UserId: number;
            FullName: string;
          };
          EnteredOn: string;
          UpdatedBy: null;
          UpdatedOn: null;
          ReactionName: string;
          AllergenId: number;
          ReactionId: number;
        }[] = [];
        let vitals: {
          VitalDate: string;
          EnteredBy: {
            UserId: number;
            FullName: string;
          };
          UpdatedBy: null;
          UpdatedOn: null;
          Data: {
            Name: string;
            Value: string;
            Unit: string;
          }[];
        }[] = [];
        let physicalExams: {
          physicalExamId: null;
          EnteredBy: {
            UserId: number;
            FullName: string;
          };
          EnteredOn: string;
          UpdatedBy: null;
          UpdatedOn: null;
          Data: {
            SectionId: number;
            QuestionId: number;
            QuestionGroupId: number;
            SelectedAnswerIds: number[];
            SelectedAnswers: string[];
          }[];
        }[] = [];
        let diagnosis: {
          DiagnosisId: number;
          StartDate: string;
          StopDate: string;
          EnteredBy: {
            UserId: number;
            FullName: string;
          };
          UpdatedBy: null;
          UpdatedOn: null;
          EnteredOn: string;
          Problem: string;
          ICD10Code: string;
          ICD10Name: string;
          Chronicity: string;
          Severity: string;
          ChronicityId: number;
          SeverityId: number;
          SelectedProblems: string;
          SelectedSeverity: string;
        }[] = [];
        let history: any = [];
        let orderInvestigations: {
          ServiceName: string;
          VaccineCodeId: number;
          VaccineGroupId: number;
          LabTestData: {
            SubServiceId: number;
            ServiceGroupId: number;
            Code: string;
          };
          Charges: number;
          OrderDate: string;
          EnteredBy: {
            UserId: number;
            FullName: string;
          };
        }[] = [];
        let medications: {
          MedicationListId: number;
          DrugName: string;
          DirectionToProivder: string;
          DirectionToPatient: string;
          Comments: string;
          StartDate: string;
          EndDate: string;
          DosageForm: string;
          Route: string;
          Dose: string;
          Frequency: string;
          Quantity: number;
          EnteredBy: {
            UserId: number;
            FullName: string;
          };
          UpdatedBy: null;
          EnteredOn: string;
          UpdatedOn: null;
        }[] = [];
        let DispatchedMedicines: {
          MedicationListId: number;
          DrugName: string;
          Quantity: number;
          DispatchedBy: {
            UserId: number;
            FullName: string;
          };
          DispatchedOn: string;
        }[] = [];
        let presentingComplain: {
          presentingComplainId: null;
          EnteredBy: {
            UserId: number;
            FullName: string;
          };
          UpdatedBy: null;
          EnteredOn: string;
          UpdatedOn: null;
          Data: {
            SectionId: number;
            QuestionId: number;
            QuestionGroupId: number;
            SelectedAnswerIds: number[];
            SelectedAnswers: string[];
          }[];
        }[] = [];
        if (patientData.patient.Services) {
          patientData.patient.Services.forEach((service: any) => {
            selectedServices.push(service);
          });
        }
        if (patientData.allergies) {
          patientData.allergies.forEach((item: any) => {
            allergies.push({
              Allergen: item.Allergen,
              AllergenTypeId: item.AllergenTypeId,
              AllergenType: item.AllergenType,
              Severity: item.Severity ? item.Severity : '',
              OnSet: item.OnSet ? item.OnSet : '',
              OnSetId: item.OnSetId ? item.OnSetId : '',
              AllergenDate: item.AllergenDate,
              EnteredBy: {
                UserId: mmkvStorage.getNumber('loggedInUserId'),
                FullName: mmkvStorage.getString('loggedInUsername'),
              },
              EnteredOn: '2024-09-08T19:24:54',
              UpdatedBy: null,
              UpdatedOn: null,
              ReactionName: item.Reactions
                ? item.Reactions
                : item.ReactionName
                ? item.ReactionName
                : '',
              AllergenId: item.AllergenId ? item.AllergenId : '',
              ReactionId: item.ReactionId ? item.ReactionId : '',
            });
          });
        }
        if (patientData.vitals) {
          patientData.vitals.forEach((item: any) => {
            vitals.push({
              ...item,
              EnteredBy: item.EnteredBy ?? {
                UserId: mmkvStorage.getNumber('loggedInUserId'),
                FullName: mmkvStorage.getString('loggedInUsername'),
              },
            });
          });
        }
        if (patientData.physicalExams) {
          patientData.physicalExams.forEach((item: any) => {
            if (item.isChanged) {
              physicalExams.push({
                ...item,
                EnteredBy: {
                  UserId: mmkvStorage.getNumber('loggedInUserId'),
                  FullName: mmkvStorage.getString('loggedInUsername'),
                },
                Data: flattenSectionList(item.Data),
              });
            }
          });
        }
        if (patientData.diagnosis?.PatientWiseList) {
          patientData.diagnosis.PatientWiseList.forEach((item: any) => {
            if (item.isChanged) {
              diagnosis.push({
                ...item,
              });
            }
          });
        }
        if (patientData.orderInvestigations) {
          patientData.orderInvestigations.forEach((item: any) => {
            if (item.isChanged) {
              orderInvestigations.push({
                ...item,
              });
            }
          });
        }
        if (patientData.history) {
          patientData.history.forEach((item: any) => {
            history.push({
              ...item,
            });
          });
        }
        if (patientData.medications) {
          patientData.medications.forEach((item: any) => {
            if (item.isNew) {
              medications.push({
                ...item,
                EnteredBy: {
                  UserId: mmkvStorage.getNumber('loggedInUserId'),
                  FullName: mmkvStorage.getString('loggedInUsername'),
                },
                ProviderId: mmkvStorage.getNumber('loggedInUserId'),
              });
            }
          });
        }
        if (patientData.patient.PharmacyTime) {
          patientData.medications.forEach((item: any) => {
            DispatchedMedicines.push({
              ...item,
              DispatchedBy: patientData.patient.PharmacyEnteredBy ?? {
                UserId: mmkvStorage.getNumber('loggedInUserId'),
                FullName: mmkvStorage.getString('loggedInUsername'),
              },
              DispatchedOn: patientData.patient.PharmacyTime,
            });
          });
        }
        if (patientData.presentingComplain) {
          patientData.presentingComplain.forEach((item: any) => {
            if (item.isChanged) {
              presentingComplain.push({
                ...item,
                EnteredBy: {
                  UserId: mmkvStorage.getNumber('loggedInUserId'),
                  FullName: mmkvStorage.getString('loggedInUsername'),
                },
                Data: flattenSectionList(item.Data),
              });
            }
          });
          // console.warn(
          //   'patientData.presentingComplain',
          //   presentingComplain[0].Data,
          // );
        }
        let patient = patientData.patient;
        console.warn('patient::', patient);

        let data = {
          patient: {
            ...patient,
            PatientId: patient.newPatientId
              ? patient.newPatientId
              : patient.PatientId > 0
              ? patient.PatientId
              : null,
            FirstName: patient.FirstName,
            LastName: patient.LastName,
            MRNNo: patient.PatientId > 0 ? patient.MRNNo : null,
            DOB: patient.DOB
              ? moment(patient.DOB, 'DD/MM/YYYY hh:mm:ss A').format(
                  'YYYY-MM-DD',
                )
              : '',
            CNIC: patient.CNIC ? patient.CNIC : '',
            CellPhoneNumber: patient.CellPhoneNumber
              ? patient.CellPhoneNumber
              : '',
            Gender: patient.Gender ? patient.Gender : '',
            SiteName: patient.SiteName ? patient.SiteName : '',
            SiteId: patient.SiteId
              ? patient.SiteId
              : patient.SiteName
              ? siteStore.sites.find(item => item.SiteName === patient.SiteName)
                  ?.SiteId
              : '',
            MartialStatus:
              patient.PatientId > 0
                ? patient.MaritalStatusId
                : patient.MartialStatus
                ? patient.MartialStatus
                : '',
            SpouseName: patient.SpouseName ? patient.SpouseName : '',
            Country: patient.Country ? patient.Country : '',
            City:
              patient.PatientId > 0
                ? patient.CityId
                : patient.City
                ? patient.City
                : '',
            Province:
              patient.PatientId > 0
                ? patient.ProvinceId
                : patient.Province
                ? patient.Province
                : '',
            Address: patient.Address ? patient.Address : '',
            EnteredOn:
              patient.PatientId > 0
                ? patient.EnteredOn
                : moment().format('YYYY-MM-DD'),
            EnteredBy: patient.EnteredBy ?? {
              UserId: mmkvStorage.getNumber('loggedInUserId'),
              FullName: mmkvStorage.getString('loggedInUsername'),
            },
            Status: 'CheckOut',
            CheckInTime: patient.CheckInTime,
            VitalsTime: patient.VitalsTime,
            PrescriptionTime: patient.PrescriptionTime,
            PharmacyTime: patient.PharmacyTime,
            CheckoutTime: patient.CheckoutTime
              ? patient.CheckoutTime
              : moment().toISOString(),
            // patient.PharmacyTime && !patient.CheckoutTime
            //   ? moment().toISOString()
            //   : '',
          },
          selectedServices,
          allergies,
          vitals,
          physicalExams,
          diagnosis,
          history,
          orderInvestigations,
          medications,
          DispatchedMedicines,
          presentingComplain,
        };
        console.warn('request::', JSON.stringify(data));
        let response = await postRequest(
          'Patient/InsertUpdateConsolidatedPatientInfo',
          data,
        );
        console.warn('resp::', response);
        if (response.code === 200) {
          writeLog(JSON.stringify(data));
          let prevData = [...userContext.patientsData];
          let indexToFind = prevData.findIndex(
            item => item.patient.PatientId === patientData.patient.PatientId,
          );
          if (indexToFind !== -1) {
            let newPatientId = null;
            if (!data.patient.PatientId) {
              newPatientId = response.data[0].patient.PatientId;
            }
            prevData[indexToFind] = {
              ...prevData[indexToFind],
              patient: {
                ...prevData[indexToFind].patient,
                newPatientId,
                CheckoutTime: data.patient.CheckoutTime,
              },
            };
            try {
              prevData[indexToFind] = {
                ...prevData[indexToFind],
                presentingComplain: prevData[
                  indexToFind
                ]?.presentingComplain?.map(item => ({
                  ...item,
                  isChanged: false,
                })),
                physicalExams: prevData[indexToFind]?.physicalExams?.map(
                  item => ({
                    ...item,
                    isChanged: false,
                  }),
                ),
                orderInvestigations: prevData[
                  indexToFind
                ]?.orderInvestigations?.map(item => ({
                  ...item,
                  isChanged: false,
                })),
                diagnosis: {
                  PatientWiseList: prevData[
                    indexToFind
                  ].diagnosis?.PatientWiseList?.map(item => ({
                    ...item,
                    isChanged: false,
                  })),
                },
                medications: prevData[indexToFind]?.medications?.map(item => {
                  return {
                    ...item,
                    isNew: false,
                  };
                }),
              };
            } catch (e) {}
            userContext.updatePatientsData(prevData);
          }
          Clipboard.setString(JSON.stringify({patient: data.patient}));
          popupMsg = 'Data saved successfully!';
          setShowInfoPopup(true);
          sendCheckoutStatusToOtherApps({
            PatientId: patient.PatientId,
            CheckoutTime: data.patient.CheckoutTime,
          });
          // ToastAndroid.show('Data saved successfully!', ToastAndroid.LONG);
        } else {
          Clipboard.setString(JSON.stringify(data));
          popupMsg =
            'Something went wrong. We are unable to process your request at this time. Please try again later';
          setShowInfoPopup(true);
        }
      } catch (e) {
        console.warn('err::', e);
        popupMsg =
          'Something went wrong. We are unable to process your request at this time. Please try again later' +
          e;
        setShowInfoPopup(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Function to write logs to the file
    const writeLog = async (logMessage: string) => {
      try {
        const filePath = `${
          Platform.OS === 'android'
            ? RNFS.DownloadDirectoryPath
            : RNFS.DocumentDirectoryPath
        }/logs.json`;
        const newLog = {
          timestamp: new Date().toISOString(),
          message: logMessage,
        };

        // Check if the log file exists
        const fileExists = await RNFS.exists(filePath);

        if (fileExists) {
          // Read the existing logs
          const existingLogs = await RNFS.readFile(filePath, 'utf8');
          const logs = JSON.parse(existingLogs);

          // Append the new log and write back to the file
          logs.push(newLog);
          await RNFS.writeFile(filePath, JSON.stringify(logs, null, 2), 'utf8');
        } else {
          // Create a new log file with the first log entry
          await RNFS.writeFile(
            filePath,
            JSON.stringify([newLog], null, 2),
            'utf8',
          );
        }

        console.log('Log written successfully');
      } catch (error) {
        console.error('Error writing log:', error);
      }
    };

    const sendCheckoutStatusToOtherApps = (payload: any) => {
      try {
        if (userContext.clientSocket) {
          console.warn('checking out');
          userContext.clientSocket.write(
            JSON.stringify({
              sender: 'doctor',
              payload,
              isCheckoutSync: true,
            }),
          );
        }
      } catch (e) {}
    };

    const getAnswerIdsFromIds = (answersList: any[], optionList: any[]) => {
      try {
        let answerIds: any = [];
        answersList.forEach(answerItem => {
          let option = optionList.find(item => item.Name === answerItem.Name);
          if (option) {
            answerIds.push(option.Id);
          }
        });
        return answerIds;
      } catch (e) {
        console.warn('err ans list::', e);
        return [];
      }
    };

    const flattenSectionList = (data: any) => {
      try {
        let tempData: any = [];
        data.forEach((section: any) => {
          tempData = [...tempData, ...section.data];
        });
        return tempData.map((itemData: any) => {
          return {
            ...itemData,
            QuestionId: itemData.QuestionId
              ? itemData.QuestionId
              : itemData.OptionList[0]?.QuestionId,
            SelectedAnswerIds: getAnswerIdsFromIds(
              itemData.AnswerList,
              itemData.OptionList,
            ),
            SelectedAnswers: itemData.AnswerList.map((item: any) => item.Name),
          };
        });
      } catch (e) {
        console.warn('err present list::', e);
        return [];
      }
    };

    const shouldSyncOptionBeDisplayed = (user: any) => {
      if (
        user &&
        user.CheckInTime &&
        user.VitalsTime &&
        user.PrescriptionTime &&
        user.PharmacyTime
      ) {
        return true;
      }
      return false;
    };

    const PatientItem = ({title, item}) => (
      <View style={$patientItemView}>
        <View style={$patientItemTitleView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon icon="userIcon" size={22} />
            <Text
              testID="login-heading"
              preset="bold"
              style={$patientTitleText}>
              {'MRN: ' + title.MRNNo}
            </Text>
          </View>
          {shouldSyncOptionBeDisplayed(title) ? (
            <TouchableOpacity
              style={{paddingHorizontal: 4}}
              onPress={() => onSyncWithServerPressed(item)}>
              <Text
                preset="default"
                style={{fontSize: 10, paddingHorizontal: 1, color: '#009FFF'}}>
                Sync
              </Text>
            </TouchableOpacity>
          ) : (
            <Icon
              icon="syncDone"
              size={24}
              // style={{position: 'absolute', right: 20}}
            />
          )}
        </View>
        <View style={[$patientItemDetailView]}>
          <Text
            testID="login-heading"
            preset="bold"
            style={{color: '#475569', fontSize: 12}}>
            {title.FirstName}
          </Text>
          <Text
            testID="login-heading"
            preset="default"
            style={{fontSize: 10, color: '#475569'}}>
            {
              // item.MRNNo + ' | ' +
              title.Gender + ' | ' + calculateFullAge(title.DOB)
            }
          </Text>
        </View>

        {/* Check in..... */}
        <View style={$patientItemDetailView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView, {marginTop: 14}]}>
              <View
                style={[
                  $circleStartView,
                  title.CheckInTime && {backgroundColor: colors.themeText},
                ]}
              />
              <View
                style={[
                  $lineView,
                  title.CheckInTime && {backgroundColor: colors.themeText},
                ]}
              />
            </View>
            <Icon icon="home" size={23} />
            <View style={{flexDirection: 'column'}}>
              <Text
                // testID="login-heading"
                preset={title.CheckInTime ? 'bold' : 'default'}
                style={[
                  $patientsText,
                  {
                    marginStart: spacing.sm,
                    fontSize: 12,
                    color: title.CheckInTime ? 'black' : '#909090',
                  },
                  title.CheckInTime && {color: '#23AAFA'},
                ]}>
                {'Check - In'}
              </Text>
              {title.CheckInTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginStart: spacing.sm, fontSize: 12},
                  ]}>
                  {/* {title.CheckInTime ? formatDate(title.CheckInTime) : ""} */}
                  {moment(title.CheckInTime).format('YYYY-MM-DD hh:mm A')}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              $circleView,
              {backgroundColor: title.CheckInSynced ? 'white' : 'lightgray'},
            ]}>
            <Icon
              icon={title.CheckInSynced ? 'checkIcon' : 'unsync'}
              color={title.CheckInSynced && 'green'}
              size={14}
            />
          </View>
        </View>

        {/* Vitals..... */}
        <View style={$patientItemDetailView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView]}>
              <View
                style={[
                  $lineView,
                  title.VitalsTime && {backgroundColor: colors.themeText},
                ]}
              />
              <View
                style={[
                  $circleStartView,
                  title.VitalsTime && {backgroundColor: colors.themeText},
                ]}
              />
              <View
                style={[
                  $lineView,
                  title.VitalsTime && {backgroundColor: colors.themeText},
                ]}
              />

              {/* <View style={[$lineView, title.Status == 'Vitals' && {backgroundColor: colors.themeText}]} />
              <View style={[$circleStartView, title.Status == 'Vitals' && {backgroundColor: colors.themeText}]} />
              <View style={[$lineView, title.Status == 'Vitals' && {backgroundColor: colors.themeText}]} /> */}
            </View>
            <Icon
              icon={title.VitalsTime ? 'prescription' : 'prescription'}
              size={20}
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                // testID="login-heading"
                preset={title.VitalsTime ? 'bold' : 'default'}
                // style={[$patientsText, {marginStart: spacing.sm}, title.Status == 'Vitals' && {color: colors.themeText}]}
                style={[
                  $patientsText,
                  {
                    marginStart: spacing.sm,
                    fontSize: 12,
                    color: title.VitalsTime ? 'black' : '#909090',
                  },
                  title.VitalsTime && {color: colors.themeText},
                ]}>
                {'Vitals'}
              </Text>
              {title.VitalsTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginLeft: spacing.sm, fontSize: 12},
                  ]}>
                  {moment(title.VitalsTime).format('YYYY-MM-DD hh:mm A')}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              $circleView,
              {backgroundColor: title.vitalsSynced ? 'green' : 'lightgray'},
            ]}>
            <Icon
              icon={title.vitalsSynced ? 'sync' : 'unsync'}
              color={title.vitalsSynced && 'green'}
              size={14}
            />
          </View>
        </View>

        {/* Prescription..... */}
        <View style={$patientItemDetailView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView]}>
              <View
                style={[
                  $lineView,
                  title.PrescriptionTime && {
                    backgroundColor: colors.themeText,
                  },
                ]}
              />
              <View
                style={[
                  $circleStartView,
                  title.PrescriptionTime && {
                    backgroundColor: colors.themeText,
                  },
                ]}
              />
              <View
                style={[
                  $lineView,
                  title.PrescriptionTime && {
                    backgroundColor: colors.themeText,
                  },
                ]}
              />
            </View>
            <Icon icon="pharmacy" size={20} />
            <View style={{flexDirection: 'column'}}>
              <Text
                // testID="login-heading"
                preset={title.PrescriptionTime ? 'bold' : 'default'}
                style={[
                  $patientsText,
                  {
                    marginStart: spacing.sm,
                    fontSize: 12,
                    color: title.PrescriptionTime ? 'black' : '#909090',
                  },
                  title.PrescriptionTime && {
                    color: colors.themeText,
                  },
                ]}>
                {'Prescription'}
              </Text>
              {title.PrescriptionTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginLeft: spacing.sm, fontSize: 12},
                  ]}>
                  {title.PrescriptionTime
                    ? moment(title.PrescriptionTime).format(
                        'YYYY-MM-DD hh:mm A',
                      )
                    : ''}
                </Text>
              )}
            </View>
          </View>
          {!successResp ? null : successResp.includes(
              title.PatientId,
            ) ? null : title.PrescriptionTime ? (
            <TouchableOpacity
              onPress={() => onSyncPressed(title)}
              style={[
                // $circleView,
                {
                  backgroundColor: title.CheckInSynced ? 'green' : 'lightgray',
                  borderRadius: 4,
                },
              ]}>
              <Text
                preset="default"
                style={{fontSize: 10, paddingHorizontal: 1}}>
                Sync Locally
              </Text>
            </TouchableOpacity>
          ) : null}
          <View
            style={[
              $circleView,
              {
                backgroundColor: title.prescriptionSynced
                  ? 'green'
                  : 'lightgray',
              },
            ]}>
            <Icon
              icon={title.prescriptionSynced ? 'sync' : 'unsync'}
              color={title.vitalsSynced && 'green'}
              size={14}
            />
          </View>
        </View>

        {/* Pharmacy..... */}
        <View style={$patientItemDetailView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView]}>
              <View
                style={[
                  $lineView,
                  title.PharmacyTime && {
                    backgroundColor: colors.themeText,
                  },
                ]}
              />
              <View
                style={[
                  $circleStartView,
                  title.PharmacyTime && {
                    backgroundColor: colors.themeText,
                  },
                ]}
              />
              <View
                style={[
                  $lineView,
                  title.PharmacyTime && {
                    backgroundColor: colors.themeText,
                  },
                ]}
              />
            </View>
            <Icon icon="vitals" size={20} />
            <View style={{flexDirection: 'column'}}>
              <Text
                testID="login-heading"
                preset={title.PharmacyTime ? 'bold' : 'default'}
                style={[
                  $patientsText,
                  {
                    marginStart: spacing.sm,
                    fontSize: 12,
                    color: title.PharmacyTime ? 'black' : '#909090',
                  },
                  title.PharmacyTime && {color: colors.themeText},
                ]}>
                {'Pharmacy'}
              </Text>
              {title.PharmacyTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginLeft: spacing.sm, fontSize: 12},
                  ]}>
                  {title.PharmacyTime
                    ? moment(title.PharmacyTime).format('YYYY-MM-DD hh:mm A')
                    : ''}
                </Text>
              )}
            </View>
          </View>
          <View
            style={[
              $circleView,
              {backgroundColor: title.pharmacySynced ? 'green' : 'lightgray'},
            ]}>
            <Icon
              icon={title.pharmacySynced ? 'sync' : 'unsync'}
              color={title.vitalsSynced && 'green'}
              size={14}
            />
          </View>
        </View>

        {/* Checkout..... */}
        <View
          style={{
            ...$patientItemDetailView,
            borderBottomWidth: 0,
            marginBottom: 4,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[$circleLineView]}>
              <View
                style={[
                  $lineView,
                  title.CheckoutTime && {
                    backgroundColor: colors.themeText,
                  },
                ]}
              />
              <View
                style={[
                  $circleStartView,
                  title.CheckoutTime && {
                    backgroundColor: colors.themeText,
                  },
                  {marginBottom: 14},
                ]}
              />

              {/* <View style={[$lineView, title.Status == 'Checkout' && {backgroundColor: colors.themeText}]} /> */}
            </View>
            <Icon icon="checkout" size={20} />
            <View style={{flexDirection: 'column'}}>
              <Text
                testID="login-heading"
                preset={title.CheckoutTime ? 'bold' : 'default'}
                style={[
                  $patientsText,
                  {marginStart: spacing.sm, fontSize: 12, color: '#909090'},
                  title.CheckoutTime && {color: colors.themeText},
                ]}>
                {'Check-Out'}
              </Text>
              {title.CheckoutTime && (
                <Text
                  testID="login-heading"
                  preset="default"
                  style={[
                    $patientsText,
                    {marginLeft: spacing.sm, fontSize: 12},
                  ]}>
                  {moment(title.CheckoutTime).format('YYYY-MM-DD hh:mm A')}
                </Text>
              )}
            </View>
          </View>
          {!checkoutSuccessResp ? null : checkoutSuccessResp.includes(
              title.PatientId,
            ) ? null : title.CheckoutTime ? (
            <TouchableOpacity
              onPress={() => onCheckoutSyncPressed(title)}
              style={[
                // $circleView,
                {
                  backgroundColor: title.CheckInSynced ? 'green' : 'lightgray',
                  borderRadius: 4,
                },
              ]}>
              <Text
                preset="default"
                style={{fontSize: 10, paddingHorizontal: 1}}>
                Sync Locally
              </Text>
            </TouchableOpacity>
          ) : null}
          <View
            style={[
              $circleView,
              {backgroundColor: title.checkoutSynced ? 'green' : 'lightgray'},
            ]}>
            <Icon
              icon={title.checkoutSynced ? 'sync' : 'unsync'}
              color={title.vitalsSynced && 'green'}
              size={14}
            />
          </View>
        </View>
      </View>
    );

    function patientItemPress(title: React.SetStateAction<string>) {
      console.log('-=-=-=-=-=-=-=-=-', title);
      // console.log('-=-=-=-=-=-=-=-=-', patient)
      setPatient(title);
    }

    function addNewPress() {
      navigation.navigate('Profile');
    }

    function advanceSearchPress() {
      navigation.navigate('Patient');
    }
    const profilePress = () => {
      // console.log('Profile pressed.......')
    };
    const toggleDrawer = () => {
      navigation.toggleDrawer();
      // console.log('Profile pressed.......')
    };

    return (
      <>
        <Header
          LeftActionComponent={<DrawerIconButton onPress={toggleDrawer} />}
          RightActionComponent={<ProfileIconButton onPress={profilePress} />}
        />
        <Modal transparent visible={showInfoPopup}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.2)',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                backgroundColor: 'white',
                borderRadius: 12,
                paddingVertical: 20,
              }}>
              <Text
                style={{
                  marginBottom: 18,
                  fontFamily: typography.primary.medium,
                  textAlign: 'center',
                  fontSize: 12,
                  width: '90%',
                  alignSelf: 'center',
                }}>
                {popupMsg}
              </Text>
              <TouchableOpacity
                onPress={() => setShowInfoPopup(false)}
                style={{
                  height: 30,
                  width: '90%',
                  backgroundColor: '#009FFF',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 6,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: typography.primary.medium,
                    fontSize: 12,
                  }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Screen
          preset="fixed"
          contentContainerStyle={$container}
          // safeAreaEdges={["top"]}
        >
          <Loading isLoading={isLoading} />
          <View
            style={{
              borderWidth: 1,
              borderColor: '#A1AEC1',
              height: 38,
              marginHorizontal: 22,
              backgroundColor: 'white',
              // justifyContent: 'center',
              borderRadius: 6,
              marginBottom: 6,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                color: '#94A3B8',
                fontSize: 12,
                fontFamily: typography.primary.normal,
                flex: 1,
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}
              placeholder="Search Patient (By MRN)"
              placeholderTextColor={'#94A3B8'}
              value={query}
              onChangeText={handleSearch}
            />
            <Icon icon="searchIcon" size={23} style={{marginRight: 10}} />
          </View>
          {/* <Text preset="heading" tx="patientStatusScreen.patientStatus" style={$title} /> */}
          <View style={$patientsListView}>
            <FlatList
              // data={patientQueue}
              data={query?.length > 0 ? filteredData : userContext.patientsData}
              // style={$patientsListView}
              extraData={refresh}
              renderItem={({item}) => (
                <>
                  {item ? (
                    item.isDetailFetched ? (
                      true ? (
                        <PatientItem title={item.patient} item={item} />
                      ) : item.isFromNurse ? (
                        <PatientItem title={item.patient} item={item} />
                      ) : null
                    ) : (
                      <PatientItem title={item.patient} item={item} />
                    )
                  ) : null}
                </>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Screen>
      </>
    );
  };

const $container: ViewStyle = {
  // paddingTop: spacing.lg + spacing.xl,
  // paddingHorizontal: spacing.lg,
  flex: 1,
};

const $title: TextStyle = {
  flex: 0.5,
  marginBottom: spacing.sm,
};

const $patientsListView: ViewStyle = {
  flex: 6,
  // borderWidth: 1,
  width: '100%',
  alignSelf: 'center',
  // marginVertical: spacing.sm,
};

const $patientsText: TextStyle = {
  // padding: spacing.sm,
};

const $buttonsView: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  // alignSelf: 'baseline',
  // position: 'absolute',
  // bottom: 20,
  width: '100%',
};

const $tapButton: ViewStyle = {
  flex: 1,
  margin: spacing.md,
};

const $patientItemView: ViewStyle = {
  elevation: 6,
  marginVertical: spacing.md,
  backgroundColor: colors.background,
  borderRadius: 10,
  marginHorizontal: spacing.lg,
  overflow: 'hidden',
};

const $patientItemTitleView: ViewStyle = {
  flex: 1,
  backgroundColor: '#ECF6F8',
  borderTopRightRadius: 6,
  borderTopLeftRadius: 6,
  padding: spacing.sm,
  // borderWidth: 0.25,
  elevation: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const $patientTitleText: TextStyle = {
  paddingHorizontal: 10,
  color: '#009FFF',
  fontSize: 12,
};

const $patientItemInnerView: ViewStyle = {
  flex: 1.1,
};

const $patientItemIconsView: ViewStyle = {
  flex: 1.5,
  flexDirection: 'row',
  alignItems: 'center',
};

const $statusIconView: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: spacing.xxxs,
  paddingVertical: spacing.xxs,
};

const $patientItemDetailView: ViewStyle = {
  height: 35,
  backgroundColor: colors.background,
  // borderBottomRightRadius: 6,
  borderBottomWidth: 0.25,
  // borderBottomLeftRadius: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: spacing.sm,
  alignItems: 'center',
};

const $circleView: ViewStyle = {
  width: 18,
  height: 18,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'lightgray',
  borderRadius: 13,
};

const $circleLineView: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginEnd: spacing.sm,
};

const $circleStartView: ViewStyle = {
  width: 8,
  height: 8,
  borderRadius: 7,
  backgroundColor: 'lightgray',
};

const $lineView: ViewStyle = {
  width: 2,
  flex: 1,
  backgroundColor: 'lightgray',
};
// @home remove-file
