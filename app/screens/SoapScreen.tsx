import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  ViewStyle,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Image,
  ImageBackground,
} from 'react-native';
import {Header, Screen, Text, Profile, Icon} from '../components';
import {PatientStackScreenProps} from 'app/navigators';
import {spacing, typography} from '../theme';
import {useStores} from 'app/models';
import {ProfileIconButton} from './HomeScreen/ProfileIconButton';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import SoapHeaderComponent from 'app/components/SoapHeaderComponent';
import TableComponent from 'app/components/TableComponent';
import {DrawerIconButton} from './HomeScreen/DrawerIconButton';
import {FlatListIndicator} from '@fanchenbao/react-native-scroll-indicator';
import SoapObjectiveItem from 'app/components/SoapObjectiveItem';
import SoapAssessmentItem from 'app/components/SoapAssessmentItem';
import DropDownPicker from 'react-native-dropdown-picker';
import SoapPlanItem from 'app/components/SoapPlanItem';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AddMedicationForm from 'app/components/AddMedicationForm';
import AllergiesForm from 'app/components/AllergiesForm';
import PhysicalExamForm from 'app/components/PhysicalExamForm';
import {api} from 'app/services/api';
import {getRequest} from 'app/services/api/NetworkService';
import {
  IallergyData,
  IdiagnosisData,
  IorderInvestData,
  IpaitentHistory,
  IpatientMedication,
} from 'app/@types/SoapInterfaces';
import {mmkvStorage, UserContext} from 'app/utils/UserContext';
import moment from 'moment';
import {getDoctorNameFromPatient} from 'app/utils/UtilFunctions';
import {useFocusEffect} from '@react-navigation/native';

let vaccdata = [
  {title: 'Select Investigation', value: '', list: ['MRI', 'ST Scan']},
  {title: 'Select Vaccination', value: '', list: ['INJECT T', 'Vaccin A']},
];
let dropdownList: string[] = [];
let tableType = '';
let flatlistRef: React.RefObject<FlatList> = React.createRef();
let patientHistory: IpaitentHistory[] = [];
let medicationData: IpatientMedication[] = [];
let orderInvestData: IorderInvestData[] = [];
let diagnosisData: IdiagnosisData[] = [];
let allergiesData: IallergyData[] = [];
let isDataAvailableForSyncing = true;

export const SoapScreen: FC<PatientStackScreenProps<'PatientVitalsHistory'>> =
  function PatientVitalsHistoryScreen(_props) {
    const {flow} = _props.route?.params || {};
    const userContext = useContext(UserContext);
    const [currentPatient, setCurrentPatient] = useState(
      userContext.patientsData[userContext.selectedPatientIndex],
    );
    const [openInvestigDropDown, setOpenInvestigDropDown] = useState(false);
    const [openVaccDropDown, setOpenVaccDropDown] = useState(false);
    const [investigValue, setInvestigValue] = useState(null);
    const [vaccValue, setVaccValue] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownIndex, setDropdownIndex] = useState(-1);
    const [investigItems, setInvestigItems] = useState([
      {label: 'SBF Test', value: 'apple'},
      {label: 'MRI', value: 'banana'},
    ]);
    const [vaccItems, setVaccItems] = useState([
      {label: 'Covid', value: 'apple'},
      {label: 'Vic', value: 'banana'},
    ]);

    const soapSubCategories = [
      {title: 'Subjective', id: 1},
      {title: 'Objective', id: 2},
      {title: 'Assessment', id: 3},
      {title: 'Plan', id: 4},
    ];
    const [expandedItemId, setExpandedItemId] = useState(-1);
    const [innerExpandedItem, setInnerExpandedItem] = useState('');
    const [showOrderInvestigation, setShowOrderInvestigation] = useState(false);
    const [selectedMedicationIndex, setSelectedMedicationIndex] = useState(-1);
    const [showAddMedicationForm, setShowAddMedicationForm] = useState(false);
    //Subjective Table Component
    const [showTableComp, setShowTableComp] = useState(false);
    const [selectedIndexForaEdit, setSelectedIndexForaEdit] = useState<
      null | number
    >(null);
    // ....................
    const [dayValue, setDayValue] = useState<number | null>(null);
    const [weekValue, setWeekValue] = useState<number | null>(null);
    const [monthValue, setMonthValue] = useState<number | null>(null);
    const [editingCategory, setEditingCategory] = useState<
      'day' | 'week' | 'month' | null
    >(null);

    // ....................
    const [selectedAllergyItemForEdit, setSelectedAllergyItemForEdit] =
      useState(null);
    const [showAllergiesForm, setShowAllergiesForm] = useState(false);
    const [showPhysicalExamForm, setShowPhysicalExamForm] = useState(false);
    const [showOrderInvestigationTable, setShowOrderInvestigationTable] =
      useState(false);
    const {navigation} = _props;
    const {patientStore, vitalStore, fieldStore, authenticationStore} =
      useStores();
    const {
      patientQueue,
      patientQueueForList,
      patientsForList,
      getSelectedPatient,
    } = patientStore;
    const tableHead = ['Date', 'Time Taken', 'Taken By'];
    const tableData = [
      ['19-02-24', '2:34 PM', 'Shandana Gulzar'],
      ['19-02-24', '11:14 PM', 'Noreen Anjum'],
      ['19-02-24', '10:34 PM', 'Kamran Khalid'],
      ['19-02-24', '2:03 PM', 'Shandana Gulzar'],
      ['19-02-24', '2:24 PM', 'Salman Akram'],
      ['19-02-24', '2:34 PM', 'Shahid Anwar'],
      ['19-02-24', '3:16 PM', 'Shandana Gulzar'],
    ];

    // const [currentPatient, setCurrentPatient] = useState(getSelectedPatient());
    const [user, setUser] = useState(authenticationStore.login);

    useEffect(() => {
      isDataAvailableForSyncing = true;
      if (flow === 'Presenting Complaint' || flow === 'Allergies') {
        onItemPress({title: 'Subjective', id: 1});
      } else if (flow === 'Vitals') {
        onItemPress({title: 'Objective', id: 2});
        setInnerExpandedItem('vital');
      } else if (flow === 'Physical Examination') {
        onItemPress({title: 'Objective', id: 2});
        tableType = 'physicalExam';
        setSelectedIndexForaEdit(null);
        setShowTableComp(true);
      } else if (flow === 'Diagnosis') {
        onItemPress({title: 'Objective', id: 2});
        setInnerExpandedItem('diagnosis');
      } else if (flow === 'Order Investigations') {
        onItemPress({title: 'Assessment', id: 3});
        setInnerExpandedItem('investigation');
      } else if (flow === 'Medications') {
        onItemPress({title: 'Plan', id: 4});
        setInnerExpandedItem('medication');
      }

      // getPatientDiagnosis();
    }, []);

    // const getPatientDiagnosis = async () => {
    //   try {
    //     console.warn('gett', patientStore.getSelectedPatient()[0].PatientId);
    //     let response = await getRequest(
    //       `Doctor/GetPatientDiagnosisByPatientId?PatientId=${
    //         patientStore.getSelectedPatient()[0].PatientId
    //       }`,
    //     );
    //     console.warn('response', response);
    //     if (response.code === 200) {
    //       diagnosisData = response.data[0].PatientWiseList;
    //     }
    //   } catch (e) {
    //     console.warn('err', e);
    //   }
    // };

    useEffect(() => {
      if (flow === 'Diagnosis' && expandedItemId === 2) {
        console.warn('scrolling');
        flatlistRef.current?.scrollToOffset({animated: true, offset: 40});
        navigation.setParams({flow: ''});
      }
    }, [expandedItemId]);

    useEffect(() => {
      const subs = BackHandler.addEventListener('hardwareBackPress', onGoBack);
      return () => {
        subs.remove();
      };
    }, [
      showAddMedicationForm,
      showOrderInvestigation,
      showTableComp,
      showAllergiesForm,
      selectedIndexForaEdit !== null,
      showOrderInvestigationTable,
      showPhysicalExamForm,
    ]);

    const onViewEditPresentComplaint = (val: any) => {
      if (tableType === 'allergy') {
        setShowAllergiesForm(true);
        setSelectedAllergyItemForEdit(val);
      } else {
        setSelectedIndexForaEdit(val);
      }
    };

    function onItemPress(item: any) {
      if (item.id === expandedItemId) {
        setExpandedItemId(-1);
        return;
      }
      setShowTableComp(false);
      setShowAllergiesForm(false);
      setShowPhysicalExamForm(false);
      // if (item.id === 2) {
      //   if (currentPatient) {
      //     let patientData = JSON.parse(JSON.stringify(currentPatient));
      //     patientData.vitals.sort((a, b) => {
      //       let now = moment();
      //       return now.diff(moment(a)) - now.diff(moment(b));
      //     });
      //     setCurrentPatient(patientData);
      //     // console.warn('vitals', vitalsData[0]);
      //   }
      // }
      setExpandedItemId(item.id);
    }

    function onVitalHistoryPress() {
      fieldStore.fetchFields();
      navigation.navigate('EditVitals');
    }

    const profilePress = () => {
      // console.log('Profile pressed.......')
    };
    const toggleDrawer = () => {
      navigation.toggleDrawer();
      // console.log('Profile pressed.......')
    };

    const onAddOrderInvestigation = () => {
      vaccdata = [
        {title: 'Select Investigation', value: '', list: ['MRI', 'ST Scan']},
        {
          title: 'Select Vaccination',
          value: '',
          list: ['INJECT T', 'Vaccin A'],
        },
      ];
      setShowOrderInvestigation(true);
    };
    // ....................................
    const handleSave = (value: number) => {
      if (editingCategory === 'day') {
        setDayValue(value);
      } else if (editingCategory === 'week') {
        setWeekValue(value);
      } else if (editingCategory === 'month') {
        setMonthValue(value);
      }
      setShowTableComp(false); // hide UI again
    };
// ........................................
    const onAddInvestigationsPressed = () => {
      try {
        if (showOrderInvestigationTable) {
          // Require atleast one of the field to be selected
          if (!vaccdata[0]?.value && !vaccdata[1]?.value) {
            alert('Please select atleast one field');
            return;
          }

          // if (showOrderInvestigationTable) {
          let _data = currentPatient;
          let dataToAdd = {
            // SpecimenId: 42087,
            // PatientId: 6,
            ServiceName: vaccdata[0]?.value || vaccdata[1]?.value || '',
            OrderDate: moment().toISOString(),
            EnteredByName: mmkvStorage.getString('loggedInUsername'),
            EnteredBy: {
              UserId: mmkvStorage.getNumber('loggedInUserId'),
              FullName: mmkvStorage.getString('loggedInUsername'),
            },
            VaccineCodeId: 0,
            VaccineGroupId: 0,
            LabTestData: {
              SubServiceId: 0,
              ServiceGroupId: 0,
              Code: '',
            },
            isChanged: true,
          };

          if (vaccdata[0]?.value && global.investigationDropdownData) {
            let itemToFind = global.investigationDropdownData.find(
              item => item.Name === vaccdata[0].value,
            );
            if (itemToFind) {
              dataToAdd.LabTestData = {
                SubServiceId: itemToFind.SubServiceId,
                ServiceGroupId: itemToFind.ServiceGroupId,
                Code: itemToFind.Code,
              };
            }
          }

          if (vaccdata[1]?.value && global.vaccinationDropdownData) {
            let itemToFind = global.vaccinationDropdownData.find(
              item => item.CvxDescription === vaccdata[1].value,
            );
            if (itemToFind) {
              dataToAdd.VaccineCodeId = itemToFind.VaccineCodeId;
              dataToAdd.VaccineGroupId = itemToFind.VaccineGroupId;
            }
          }

          if (_data.orderInvestigations) {
            _data.orderInvestigations.push(dataToAdd);
          } else {
            _data.orderInvestigations = [dataToAdd];
          }
          updateCurrentPatient(_data);
          setShowOrderInvestigation(false);
          setShowOrderInvestigationTable(false);
        } else {
          setShowOrderInvestigationTable(true);
        }
      } catch (e) {}
    };

    const onAddMedicationPressed = (index?: number) => {
      if (index !== undefined) {
        setSelectedMedicationIndex(index);
      } else {
        setSelectedMedicationIndex(-1);
      }
      setShowAddMedicationForm(true);
      isDataAvailableForSyncing = true;
    };

    const onDeleteMedicationPressed = (index: number) => {
      let _data = currentPatient;
      _data.medications.splice(index, 1);
      updateCurrentPatient(_data);
      isDataAvailableForSyncing = true;
    };

    const onGoBack = () => {
      if (showAddMedicationForm) {
        setShowAddMedicationForm(false);
      } else if (showOrderInvestigation) {
        if (showOrderInvestigationTable) {
          setShowOrderInvestigationTable(false);
        } else {
          setShowOrderInvestigation(false);
        }
      } else if (showTableComp) {
        if (selectedIndexForaEdit !== null) {
          setSelectedIndexForaEdit(null);
        } else if (showAllergiesForm) {
          setShowAllergiesForm(false);
        } else if (showPhysicalExamForm) {
          setShowPhysicalExamForm(false);
          setShowTableComp(false);
        } else {
          setShowTableComp(false);
        }
      } else {
        navigation.goBack();
      }
      return true;
    };

    const onItemPressed = (item, index) => {
      console.warn(index);
      if (showDropdown && index === dropdownIndex) {
        setShowDropdown(false);
        return;
      }
      if (index === 0) {
        if (global.investigationDropdownData) {
          dropdownList = global.investigationDropdownData;
        } else {
          dropdownList = [];
        }
      } else {
        if (global.vaccinationDropdownData) {
          dropdownList = global.vaccinationDropdownData;
        } else {
          dropdownList = [];
        }
      }
      setDropdownIndex(index);
      setShowDropdown(true);
    };

    const onDropdownItemPressed = (item: any) => {
      vaccdata[dropdownIndex].value =
        dropdownIndex === 0 ? item.Name : item.CvxDescription;
      setShowDropdown(false);
    };

    const onViewAllPressed = () => {
      _props.navigation.navigate('PatientHistory', {flow: 'soapNote'});
    };

    const updateCurrentPatient = (_data: any, _flow?: number) => {
      setCurrentPatient(_data);
      if (_flow !== 1) {
        let patientDat = JSON.parse(JSON.stringify(userContext.patientsData));
        patientDat[userContext.selectedPatientIndex] = JSON.parse(
          JSON.stringify({..._data, isEditedByDoc: true}),
        );
        userContext.updatePatientsData(patientDat);
      }
    };

    const onSavePressed = () => {
      try {
        if (!isDataAvailableForSyncing) {
          return;
        }
        isDataAvailableForSyncing = false;
        let data = JSON.parse(JSON.stringify(currentPatient));
        let meds = data.medications.map(itm => {
          // return {
          // MedicineId: itm.MedicineId,
          // DrugName: itm.DrugName,
          // Quantity: itm.Quantity,
          // EnteredOn: itm.EnteredOn,
          // OrderNumber: itm.OrderNumber,
          // ProviderName: itm.ProviderName,
          // DirectionToPatient: itm.DirectionToPatient,
          return `${itm.MedicineId}:${itm.DrugName}:${itm.Quantity}:${itm.EnteredOn}:${itm.OrderNumber}:${itm.ProviderName}:${itm.DirectionToPatient}`;
          // };
        });
        // console.warn('patient', patient);
        let dataToSend = {
          // ...data.patient,
          FirstName: data.patient.FirstName,
          LastName: data.patient.LastName,
          DOB: data.patient.DOB,
          Gender: data.patient.Gender,
          MRNNo: data.patient.MRNNo,
          PatientId: data.patient.PatientId,
          CheckInTime: data.patient.CheckInTime,
          VitalsTime: data.patient.VitalsTime,
          PrescriptionTime: moment().toISOString(),
          status: 'Prescription',
          Medications: meds,
          //
        };
        // let dataChunks=[
        //   {
        //     patientId:
        //     Medications: data.medications.slice(-1),
        //   }
        // ]
        if (global.successResponses) {
          let sIndexToFind = global.successResponses.findIndex(
            itm => itm === dataToSend.PatientId,
          );
          if (sIndexToFind !== -1) {
            global.successResponses.splice(sIndexToFind, 1);
          }
        }
        console.warn('data to send', dataToSend);
        if (userContext.clientSocket) {
          userContext.clientSocket.write(
            JSON.stringify({sender: 'doctor', payload: dataToSend}),
          );
        } else {
          console.warn('data::', dataToSend);
          global.dataToTransfer = JSON.stringify({
            sender: 'doctor',
            payload: dataToSend,
          });
        }
        let prevData = currentPatient;
        prevData.patient = {
          ...prevData.patient,
          PrescriptionTime: moment().toISOString(),
          status: 'Prescription',
        };

        updateCurrentPatient({...currentPatient});
        navigation.navigate('HomeScreen');
      } catch (e) {}
    };

    return (
      <>
        <Header
          LeftActionComponent={<DrawerIconButton onPress={toggleDrawer} />}
          RightActionComponent={<ProfileIconButton onPress={profilePress} />}
          showBackToSoapNote={
            showAddMedicationForm ||
            showOrderInvestigation ||
            selectedIndexForaEdit?.length > 0 ||
            showTableComp
          }
          onGoBack={onGoBack}
        />
        <Screen
          preset="fixed"
          contentContainerStyle={$container}
          // safeAreaEdges={["top"]}
        >
          <ImageBackground
            source={require('../../assets/images/SoapBg.png')}
            style={{flex: 1}}
            resizeMode="stretch">
            <Profile
              currentPatient={
                userContext.patientsData[userContext.selectedPatientIndex]
                  ?.patient
              }
            />
            <SoapHeaderComponent
              doctorName={
                getDoctorNameFromPatient(
                  userContext.patientsData[userContext.selectedPatientIndex],
                )
                  ? getDoctorNameFromPatient(
                      userContext.patientsData[
                        userContext.selectedPatientIndex
                      ],
                    )
                  : authenticationStore.login
                  ? 'Dr. ' + authenticationStore.login[0]?.FullName
                  : ''
              }
            />
            {showOrderInvestigation ? (
              <View>
                <View
                  style={{
                    backgroundColor: '#F3F3F3',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                  }}>
                  <Text preset="bold" style={{fontSize: 14}}>
                    Order Investigations
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  {!showOrderInvestigationTable ? (
                    <FlatList
                      ref={flatlistRef}
                      data={vaccdata}
                      renderItem={({item, index}) => (
                        <View style={{marginBottom: 8}}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              backgroundColor: 'white',
                              borderWidth: 1,
                              borderColor: 'rgba(0,0,0,0.16)',
                              paddingVertical: 11,
                              borderRadius: 6,
                              // marginBottom: 8,
                              justifyContent: 'space-between',
                              height: 46,
                            }}
                            onPress={() => onItemPressed(item, index)}>
                            <Text
                              style={{
                                color: '#80858A',
                                fontSize: 12,
                                paddingLeft: 16,
                                fontFamily: typography.primary.medium,
                                width: '80%',
                              }}
                              numberOfLines={1}>
                              {item.value ? item.value : item.title}
                            </Text>
                            <EntypoIcon
                              name="chevron-down"
                              color="#80858A"
                              size={20}
                              style={{marginRight: 20}}
                            />
                          </TouchableOpacity>
                          {index === dropdownIndex && showDropdown && (
                            <View
                              style={{
                                backgroundColor: '#F3F3F3',
                                borderRadius: 12,
                              }}>
                              <FlatList
                                data={dropdownList}
                                renderItem={({item}) => (
                                  <TouchableOpacity
                                    onPress={() => onDropdownItemPressed(item)}>
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        padding: 6,
                                        paddingHorizontal: 20,
                                      }}>
                                      {dropdownIndex === 0
                                        ? item.Name
                                        : item.CvxDescription}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              />
                            </View>
                          )}
                        </View>
                      )}
                    />
                  ) : (
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: '#DBDADE',
                        paddingTop: 6,
                        borderRadius: 6,
                      }}>
                      <FlatList
                        data={vaccdata.slice(0, 1)}
                        // contentContainerStyle=
                        ListHeaderComponent={() => (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              borderBottomWidth: 1,
                              borderColor: '#DBDADE',
                              paddingBottom: 4,
                            }}>
                            <Text
                              preset="bold"
                              style={{
                                width: '46%',
                                fontSize: 13,
                                textAlign: 'center',
                                color: '#4B465C',
                              }}>
                              Name
                            </Text>
                            <Text
                              preset="bold"
                              style={{
                                width: '51%',
                                fontSize: 13,
                                textAlign: 'center',
                                color: '#4B465C',
                              }}>
                              Comment
                            </Text>
                          </View>
                        )}
                        renderItem={({item, index}) => (
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              // backgroundColor: 'red',
                              justifyContent: 'space-between',
                              borderBottomWidth: 1,
                              borderBottomColor: '#DBDADE',
                              backgroundColor: 'white',
                            }}>
                            <Text
                              numberOfLines={1}
                              style={{
                                width: '46%',
                                paddingVertical: 4,
                                fontSize: 12,
                                textAlign: 'center',
                                color: '#4B465C',
                              }}>
                              {item.value}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={{
                                width: '51%',
                                paddingVertical: 4,
                                fontSize: 12,
                                textAlign: 'center',
                                color: '#4B465C',
                              }}>
                              Test conducted by{' '}
                              {mmkvStorage.getString('loggedInUsername')
                                ? mmkvStorage.getString('loggedInUsername')
                                : 'Ali'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  // disabled={
                  //   vaccdata[0].value && vaccdata[1].value ? false : true
                  // }
                  disabled={!(vaccdata[0]?.value || vaccdata[1]?.value)}
                  onPress={onAddInvestigationsPressed}
                  style={{
                    height: 42,
                    width: '100%',
                    backgroundColor: showOrderInvestigationTable
                      ? '#48BD69'
                      : '#2196F3',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 15,
                    marginBottom: 6,
                    borderRadius: 4,
                    flexDirection: 'row',
                  }}>
                  <Text
                    preset="bold"
                    style={{color: 'white', fontSize: 14, marginRight: 10}}>
                    ADD INVESTIGATIONS
                  </Text>
                  <AntDesignIcon
                    name="arrowright"
                    size={20}
                    color={'white'}
                    // style={{position: 'absolute'}}
                  />
                </TouchableOpacity>
              </View>
            ) : showAddMedicationForm ? (
              <AddMedicationForm
                selectedMedicationIndex={selectedMedicationIndex}
                currentPatient={currentPatient}
                updateCurrentPatient={updateCurrentPatient}
                onGoBack={onGoBack}
              />
            ) : (
              <FlatListIndicator
                indStyle={{
                  width: 4,
                  marginTop: 276,
                  backgroundColor: '#23AAFA',
                  marginRight: -6,
                }}
                flatListProps={{
                  data: soapSubCategories,
                  renderItem: ({item}) => (
                    <>
                      <View
                        style={{
                          borderWidth: item.id === expandedItemId ? 2 : 0,
                          borderColor: '#56B4FF',
                        }}>
                        <TouchableOpacity
                          onPress={() => onItemPress(item)}
                          style={{
                            flexDirection: 'row',
                            height: 33,
                            borderWidth: item.id === expandedItemId ? 0 : 2,
                            borderColor: '#E2E8F0',
                            marginBottom: 4,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor:
                              item.id === expandedItemId ? '#0067B9' : 'white',
                          }}>
                          <Text
                            preset="bold"
                            style={{
                              color:
                                item.id === expandedItemId
                                  ? 'white'
                                  : '#23AAFA',
                              fontSize: 13,
                              marginLeft: 8,
                            }}>
                            {item.title}
                          </Text>
                          <Icon
                            icon={
                              item.id === expandedItemId
                                ? 'closeIcon'
                                : 'blueAddIcon'
                            }
                            size={20}
                            style={{marginRight: 10}}
                          />
                        </TouchableOpacity>
                        {showTableComp && expandedItemId === item.id ? (
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                backgroundColor: '#F8FEFF',
                                height: 28,
                              }}>
                              <Text
                                preset="bold"
                                style={{
                                  color: '#23AAFA',
                                  fontSize: 13,
                                  marginLeft: 10,
                                }}>
                                {tableType === 'allergy'
                                  ? 'Patient Allergies'
                                  : tableType === 'physicalExam'
                                  ? showPhysicalExamForm
                                    ? 'Diagnosis'
                                    : 'Physical Exam'
                                  : 'Presentation Complaint'}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  if (tableType === 'allergy') {
                                    setSelectedAllergyItemForEdit(null);
                                    setShowAllergiesForm(true);
                                  } else {
                                    console.warn('clickked');
                                    setSelectedIndexForaEdit(-1);
                                    setShowTableComp(true);
                                  }
                                }}>
                                <Icon
                                  icon={'blueAddIcon'}
                                  size={20}
                                  style={{marginLeft: 6}}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                        {expandedItemId === 1 && item.id === 1 && (
                          <>
                            {showTableComp ? (
                              <View></View>
                            ) : (
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#F8FEFF',
                                    height: 28,
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    preset="bold"
                                    style={{
                                      color: '#23AAFA',
                                      fontSize: 13,
                                      marginLeft: 10,
                                    }}>
                                    Presentation Complaint
                                  </Text>
                                  {/* ................................................ */}
                                  <TouchableOpacity
                                    onPress={() => {
                                      tableType = 'presentComplaint';
                                      setSelectedIndexForaEdit(null);
                                      setShowTableComp(true);
                                    }}>
                                    <Icon
                                      icon={'eyeIcon'}
                                      size={24}
                                      style={{marginLeft: 6}}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      tableType = 'presentComplaint'; // existing
                                      setSelectedIndexForaEdit(-1); // maybe new entry
                                      setEditingCategory('day'); // or 'week' or 'month'
                                      setShowTableComp(true);
                                    }}>
                                    <Icon
                                      icon={'blueAddIcon'}
                                      size={20}
                                      style={{marginLeft: 6}}
                                    />
                                  </TouchableOpacity>
{/* 
                                  <TouchableOpacity
                                    onPress={() => {
                                      tableType = 'presentComplaint';
                                      setSelectedIndexForaEdit(-1);
                                      setShowTableComp(true);
                                    }}>
                                    <Icon
                                      icon={'blueAddIcon'}
                                      size={20}
                                      style={{marginLeft: 6}}
                                    />
                                  </TouchableOpacity> */}
                                </View>
                                {/* <View
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    height: 28,
                                    borderTopWidth: 0.5,
                                    borderBottomWidth: 0.5,
                                    borderColor: '#56B4FF',
                                    alignItems: 'center',
                                    paddingLeft: 10,
                                  }}>
                                  <FlatList
                                    horizontal
                                    data={[
                                      'Gastrointertinal',
                                      'General Symptoms',
                                      'Temp.',
                                    ]}
                                    renderItem={({item, index}) => (
                                      <View
                                        style={{
                                          height: 20,
                                          backgroundColor:
                                            index === 0 ? '#2196F3' : 'white',
                                          borderWidth: index === 0 ? 0 : 1,
                                          borderColor: '#2196F3',
                                          paddingHorizontal: 4,
                                          marginRight: 10,
                                          borderRadius: 3,
                                          justifyContent: 'center',
                                        }}>
                                        <Text
                                          preset="bold"
                                          style={{
                                            color:
                                              index === 0 ? 'white' : '#2196F3',
                                            fontSize: 10,
                                          }}>
                                          {item}
                                        </Text>
                                      </View>
                                    )}
                                  />
                                </View> */}
                                {/* <View
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    height: 28,
                                    borderTopWidth: 0.5,
                                    borderBottomWidth: 0.5,
                                    borderColor: '#56B4FF',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    preset="bold"
                                    style={{
                                      color: '#4B465C',
                                      fontSize: 13,
                                      marginLeft: 10,
                                    }}>
                                    Heartburn:{' '}
                                    <Text
                                      preset="default"
                                      style={{
                                        color: '#4B465C',
                                        fontSize: 13,
                                        marginLeft: 10,
                                      }}>
                                      Yes
                                    </Text>
                                  </Text>
                                </View> */}
                                {/* <View
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    height: 28,
                                    borderTopWidth: 0.5,
                                    borderBottomWidth: 0.5,
                                    borderColor: '#56B4FF',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    preset="bold"
                                    style={{
                                      color: '#4B465C',
                                      fontSize: 13,
                                      marginLeft: 10,
                                    }}>
                                    General Symptoms:{' '}
                                    <Text
                                      preset="default"
                                      style={{
                                        color: '#4B465C',
                                        fontSize: 13,
                                        marginLeft: 10,
                                      }}>
                                      Body Aches
                                    </Text>
                                  </Text>
                                </View> */}
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#F8FEFF',
                                    height: 28,
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    preset="bold"
                                    style={{
                                      color: '#23AAFA',
                                      fontSize: 13,
                                      marginLeft: 10,
                                    }}>
                                    Allergies
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => {
                                      tableType = 'allergy';
                                      setSelectedIndexForaEdit(null);
                                      setShowTableComp(true);
                                    }}>
                                    <Icon
                                      icon={'eyeIcon'}
                                      size={24}
                                      style={{marginLeft: 6}}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      tableType = 'allergy';
                                      setSelectedIndexForaEdit(null);
                                      setShowTableComp(true);
                                    }}>
                                    <Icon
                                      icon={'blueAddIcon'}
                                      size={20}
                                      style={{marginLeft: 6}}
                                    />
                                  </TouchableOpacity>
                                </View>
                                {currentPatient?.allergies?.length === 0 && (
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      backgroundColor: 'white',
                                      height: 28,
                                      borderTopWidth: 0.5,
                                      borderBottomWidth: 0.5,
                                      borderColor: '#56B4FF',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      preset="default"
                                      style={{
                                        color: '#4B465C',
                                        fontSize: 13,
                                        marginLeft: 10,
                                      }}>
                                      No data
                                    </Text>
                                  </View>
                                )}
                                {/* <View
                                  style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    height: 28,
                                    borderTopWidth: 0.5,
                                    borderBottomWidth: 0.5,
                                    borderColor: '#56B4FF',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    preset="bold"
                                    style={{
                                      color: '#4B465C',
                                      fontSize: 13,
                                      marginLeft: 10,
                                    }}>
                                    General Symptoms:{' '}
                                    <Text
                                      preset="default"
                                      style={{
                                        color: '#4B465C',
                                        fontSize: 13,
                                        marginLeft: 10,
                                      }}>
                                      Body Aches
                                    </Text>
                                  </Text>
                                </View> */}
                              </View>
                            )}
                          </>
                        )}
                        {/* ......................................................... */}
                        {!showTableComp &&
                          expandedItemId === 2 &&
                          item.id === 2 && (
                            <SoapObjectiveItem
                              onViewAllPressed={onViewAllPressed}
                              currentPatient={currentPatient}
                              onPhysicalExamPressed={flag => {
                                tableType = 'physicalExam';
                                setSelectedIndexForaEdit(
                                  flag === 1 ? -1 : null,
                                );
                                setShowTableComp(true);
                              }}
                              onDiagnosisPressed={() => {
                                tableType = 'physicalExam';
                                setShowTableComp(true);
                                setShowPhysicalExamForm(true);
                              }}
                              updateCurrentPatient={updateCurrentPatient}
                              innerExpandedItem={innerExpandedItem}
                              setInnerExpandedItem={setInnerExpandedItem}
                            />
                          )}
                        {expandedItemId === 3 && item.id === 3 && (
                          <SoapAssessmentItem
                            currentPatient={currentPatient}
                            onAddOrderInvestigation={onAddOrderInvestigation}
                            innerExpandedItem={innerExpandedItem}
                            setInnerExpandedItem={setInnerExpandedItem}
                          />
                        )}
                        {expandedItemId === 4 && item.id === 4 && (
                          <SoapPlanItem
                            currentPatient={currentPatient}
                            onAddMedicationPressed={onAddMedicationPressed}
                            onDeleteMedicationPressed={
                              onDeleteMedicationPressed
                            }
                            innerExpandedItem={innerExpandedItem}
                            setInnerExpandedItem={setInnerExpandedItem}
                            onSavePressed={onSavePressed}
                          />
                        )}
                      </View>
                      {showTableComp && expandedItemId === item.id ? (
                        <>
                          {showAllergiesForm ? (
                            <AllergiesForm
                              currentPatient={currentPatient}
                              updateCurrentPatient={updateCurrentPatient}
                              selectedAllergyItemForEdit={
                                selectedAllergyItemForEdit
                              }
                              onGoBack={onGoBack}
                            />
                          ) : showPhysicalExamForm ? (
                            <PhysicalExamForm
                              onGoBack={onGoBack}
                              currentPatient={currentPatient}
                              updateCurrentPatient={updateCurrentPatient}
                            />
                          ) : (
                            <TableComponent
                              tableData={tableData}
                              selectedIndexForaEdit={selectedIndexForaEdit}
                              setSelectedIndexForaEdit={
                                setSelectedIndexForaEdit
                              }
                              setShowTableComp={setShowTableComp}
                              showAllergyData={tableType === 'allergy'}
                              tableType={tableType}
                              onViewEditPresentComplaint={
                                onViewEditPresentComplaint
                              }
                              currentPatient={currentPatient}
                              updateCurrentPatient={updateCurrentPatient}
                            />
                          )}
                        </>
                      ) : null}
                      {
                        expandedItemId === 1 &&
                        item.id === 1 &&
                        showTableComp ? (
                          <></>
                        ) : expandedItemId === 1 && item.id === 1 ? null : null // </View> //   </Text> //     SAVE //   <Text preset="bold" style={{color: 'white'}}> //   }}> //     marginBottom: 6, //     marginTop: 6.5, //     alignItems: 'center', //     justifyContent: 'center', //     backgroundColor: '#48BD69', //     width: '100%', //     height: 36, //   style={{ // <View
                      }
                    </>
                  ),
                }}
                // contentContainerStyle={{marginTop: 20}}
              />
            )}
          </ImageBackground>
        </Screen>
      </>
    );
  };

const $container: ViewStyle = {
  paddingHorizontal: spacing.lg,
  flex: 1,
};
