// import {
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   ToastAndroid,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {useFocusEffect} from '@react-navigation/native';
// import React, {useEffect, useState, useCallback, useContext} from 'react';
// import {Text} from './Text';
// import {typography} from 'app/theme';
// import {UserContext} from '../utils/UserContext';
// import {Icon} from './Icon';
// import DatePicker from 'react-native-date-picker';
// import EntypoIcon from 'react-native-vector-icons/Entypo';
// import moment from 'moment';
// import {dosageForms} from 'app/constant/DosageForms';
// import {mmkvStorage} from 'app/utils/UserContext';

// let dropdownList: string[] = [];
// let medicineName = '';
// let medicationFormData = [];
// let medicationFormDataBackup = [
//   {title: 'Dose', value: 1, type: 'counter'},
//   {title: 'Route', value: 'ORAL', type: 'dropdown', list: ['INJECT', 'ORAL']},
//   {
//     title: 'Dosage Form',
//     value: 'TABLET',
//     type: 'dropdown',
//     list: ['SYRUP', 'TABLET', 'CAPSULE'],
//   },
//   {
//     title: 'Frequency',
//     value: '',
//     type: 'dropdown',
//     list: ['Once Daily', 'Twice Daily', 'Thrice Daily'],
//   },
//   {title: 'Duration', value: 1, type: 'counter'},
//   {title: 'Quantity', value: 1, type: 'counter'},
//   {
//     title: 'Refill',
//     value: '',
//     type: 'dropdown',
//     list: ['Once Daily', 'Twice Daily', 'Thrice Daily'],
//   },
//   {
//     title: 'Start Date',
//     value: '',
//     type: 'date',
//   },
//   {
//     title: 'End Date',
//     value: '',
//     type: 'date',
//   },
//   {
//     title: 'Direction To Patient',
//     value: '',
//     type: 'comments',
//   },
//   {
//     title: 'Direction To Pharmacist',
//     value: '',
//     type: 'comments',
//   },
//   {
//     title: 'Comments',
//     value: '',
//     type: 'comments',
//   },
// ];
// let medicineId = -1;
// let dateType = -1;

// export default function AddMedicationForm(props: any) {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [dropdownIndex, setDropdownIndex] = useState(-1);
//   const [refreshData, setRefreshData] = useState(false);
//   const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchedStr, setSearchedStr] = useState('');
//   // const [loadingMedicines, setLoadingMedicines] = useState(true);

//   // const userContext = useContext(UserContext);
//   // useFocusEffect(
//   //   useCallback(() => {
//   //     setRefresh(Math.random().toString());
//   //   }, [userContext.refreshData]),
//   // );
//   // useEffect(() => {
//   //   try {
//   //     console.warn(
//   //       'props.selectedMedicationIndex',
//   //       props.selectedMedicationIndex,
//   //     );
//   //     if (props.currentPatient && props.selectedMedicationIndex !== -1) {
//   //       medicationFormData = JSON.parse(
//   //         JSON.stringify(medicationFormDataBackup),
//   //       );
//   //       let medicationsData =
//   //         props.currentPatient.medications[props.selectedMedicationIndex];
//   //       medicineName = medicationsData.DrugName ? medicationsData.DrugName : '';
//   //       medicineId = medicationsData.MedicationListId
//   //         ? medicationsData.MedicationListId
//   //         : '';
//   //       setSearchedStr(medicineName);
//   //       medicationFormData[5].value = medicationsData.Quantity
//   //         ? medicationsData.Quantity
//   //         : 0;
//   //       medicationFormData[9].value = medicationsData.DirectionToPatient
//   //         ? medicationsData.DirectionToPatient
//   //         : generateDirectionToPatient();
//   //       medicationFormData[10].value = medicationsData.DirectionToProivder
//   //         ? medicationsData.DirectionToProivder
//   //         : '';
//   //       medicationFormData[11].value = medicationsData.Comments
//   //         ? medicationsData.Comments
//   //         : '';
//   //       medicationFormData[0].value = medicationsData.Dose
//   //         ? parseInt(medicationsData.Dose)
//   //         : 1;
//   //       medicationFormData[1].value = medicationsData.Route
//   //         ? medicationsData.Route
//   //         : '';
//   //       // medicationFormData[2].value = medicationsData.DosageForm
//   //       //   ? medicationsData.DosageForm
//   //       //   : '';
//   //       if (medicationsData.DosageForm) {
//   //         medicationFormData[2].value = medicationsData.DosageForm;
//   //       } else {
//   //         // Check if any dosageForm.shortName is in the searched medicine name
//   //         const dosageMatch = dosageForms.find(form =>
//   //           medicineName.toLowerCase().includes(form.shortName.toLowerCase()),
//   //         );
//   //         medicationFormData[2].value = dosageMatch
//   //           ? dosageMatch.shortName
//   //           : '';
//   //       }

//   //       medicationFormData[3].value = medicationsData.Frequency
//   //         ? medicationsData.Frequency
//   //         : '';
//   //       medicationFormData[7].value = medicationsData.StartDate
//   //         ? medicationsData.StartDate
//   //         : '';
//   //       medicationFormData[8].value = medicationsData.EndDate
//   //         ? medicationsData.EndDate
//   //         : '';
//   //       medicationFormData[6].value = medicationsData.Refill
//   //         ? medicationsData.Refill
//   //         : '';
//   //       setRefreshData(!refreshData);
//   //       // medicationFormData[4].value = moment(allergyData.AllergenDate)
//   //       //   ? moment(allergyData.AllergenDate).format('YYYY-MM-DD')
//   //       //   : '';
//   //       console.warn(
//   //         'first',
//   //         medicationFormData[5].value,
//   //         medicationsData.Quantity,
//   //       );
//   //     } else {
//   //       medicationFormData = JSON.parse(
//   //         JSON.stringify(medicationFormDataBackup),
//   //       );
//   //       // Add the start date bydefault to the visit date
//   //       medicationFormData[7].value = moment().format('YYYY-MM-DD');
//   //       setRefreshData(!refreshData);
//   //       console.warn('medicationFormData', medicationFormData);
//   //       console.log("Dta:::",)
//   //     }
//   //   } catch (e) {
//   //     console.warn('err', e);
//   //   }
//   // }, []);
//   useEffect(() => {
//     const initializeMedicineList = async () => {
//       try {
//         let medicineListData = mmkvStorage.getString('medicineListData');
//         if (medicineListData) {
//           global.medicineListData = JSON.parse(medicineListData);
//           console.log('data:', medicineListData);
//           console.log('Loaded medicine list from storage');
//           ToastAndroid.show(
//             'Loaded medicine list from storage',
//             ToastAndroid.LONG,
//           );

//           // setLoadingMedicines(false);
//         } else {
//           const response = await getRequest('api/Definition/List/Medication');
//           if (response.code === 200 && response.data[0]) {
//             global.medicineListData = response.data[0];
//             mmkvStorage.set(
//               'medicineListData',
//               JSON.stringify(global.medicineListData),
//             );
//             console.log('Loaded medicine list from API');
//             ToastAndroid.show(
//               'Loaded medicine list from API',
//               ToastAndroid.LONG,
//             );
//             // setLoadingMedicines(false);
//           }
//         }
//       } catch (e) {
//         console.warn('Failed to load medicine list:', e);
//         ToastAndroid.show('Failed to load Medicine list', ToastAndroid.LONG);
//         ToastAndroid.show(`Error: ${e.message}`, ToastAndroid.LONG);
//       }
//     };

//     initializeMedicineList();

//     try {
//       console.warn(
//         'props.selectedMedicationIndex',
//         props.selectedMedicationIndex,
//       );
//       if (props.currentPatient && props.selectedMedicationIndex !== -1) {
//         medicationFormData = JSON.parse(
//           JSON.stringify(medicationFormDataBackup),
//         );
//         let medicationsData =
//           props.currentPatient.medications[props.selectedMedicationIndex];
//         medicineName = medicationsData.DrugName ? medicationsData.DrugName : '';
//         medicineId = medicationsData.MedicationListId
//           ? medicationsData.MedicationListId
//           : '';
//         setSearchedStr(medicineName);
//         medicationFormData[5].value = medicationsData.Quantity
//           ? medicationsData.Quantity
//           : 0;
//         medicationFormData[9].value = medicationsData.DirectionToPatient
//           ? medicationsData.DirectionToPatient
//           : generateDirectionToPatient();
//         medicationFormData[10].value = medicationsData.DirectionToProivder
//           ? medicationsData.DirectionToProivder
//           : '';
//         medicationFormData[11].value = medicationsData.Comments
//           ? medicationsData.Comments
//           : '';
//         medicationFormData[0].value = medicationsData.Dose
//           ? parseInt(medicationsData.Dose)
//           : 1;
//         medicationFormData[1].value = medicationsData.Route
//           ? medicationsData.Route
//           : '';
//         if (medicationsData.DosageForm) {
//           medicationFormData[2].value = medicationsData.DosageForm;
//         } else {
//           const dosageMatch = dosageForms.find(form =>
//             medicineName.toLowerCase().includes(form.shortName.toLowerCase()),
//           );
//           medicationFormData[2].value = dosageMatch
//             ? dosageMatch.shortName
//             : '';
//         }
//         medicationFormData[3].value = medicationsData.Frequency
//           ? medicationsData.Frequency
//           : '';
//         medicationFormData[7].value = medicationsData.StartDate
//           ? medicationsData.StartDate
//           : '';
//         medicationFormData[8].value = medicationsData.EndDate
//           ? medicationsData.EndDate
//           : '';
//         medicationFormData[6].value = medicationsData.Refill
//           ? medicationsData.Refill
//           : '';
//         setRefreshData(!refreshData);
//         console.warn(
//           'first',
//           medicationFormData[5].value,
//           medicationsData.Quantity,
//         );
//       } else {
//         medicationFormData = JSON.parse(
//           JSON.stringify(medicationFormDataBackup),
//         );
//         medicationFormData[7].value = moment().format('YYYY-MM-DD');
//         setRefreshData(!refreshData);
//         console.warn('medicationFormData', medicationFormData);
//         console.log('Dta:::');
//       }
//     } catch (e) {
//       console.warn('err', e);
//     }
//   }, []);

//   const onItemPressed = (item: any, index: number) => {
//     if (index === 7 || index === 8) {
//       dateType = index;
//       setIsDatePickerVisible(true);
//       return;
//     }
//     if (showDropdown && index === dropdownIndex) {
//       setShowDropdown(false);
//       return;
//     }
//     setDropdownIndex(index);
//     if (item.title === 'Route') {
//       dropdownList = global.medicineRoutesData ? global.medicineRoutesData : [];
//     } else if (item.title === 'Frequency') {
//       dropdownList = global.medicineFrequencyData
//         ? global.medicineFrequencyData
//         : [];
//     } else if (item.title === 'Dosage Form') {
//       dropdownList = dosageForms.map(item => item.shortName);
//     } else {
//       dropdownList = item.list;
//     }
//     setShowDropdown(true);
//   };
//   // const onDropdownItemPressed = (item: any) => {
//   //   medicationFormData[dropdownIndex].value =
//   //     dropdownIndex === 1
//   //       ? item.Route
//   //       : dropdownIndex === 3
//   //       ? item.Frequency
//   //       : item;
//   //   setShowDropdown(false);
//   // };
//   const onDropdownItemPressed = (item: any) => {
//     medicationFormData[dropdownIndex].value =
//       dropdownIndex === 1
//         ? item.Route
//         : dropdownIndex === 3
//         ? item.Frequency
//         : item;

//     setShowDropdown(false);

//     // If Dosage Form or Frequency changed, update quantity
//     if (dropdownIndex === 2 || dropdownIndex === 3) {
//       updateQuantity();
//       setRefreshData(prev => !prev); // trigger re-render
//     }
//     if ([0, 2, 3, 4].includes(dropdownIndex)) {
//       medicationFormData[9].value = generateDirectionToPatient();
//       setRefreshData(prev => !prev);
//     }

//     setShowDropdown(false);
//     setRefreshData(prev => !prev); // trigger re-render
//   };

//   // const onChangeText = (queryStr: string) => {
//   //   setSearchedStr(queryStr);
//   //   try {
//   //     let data = global.medicineListData;
//   //     let filteredData = [];
//   //     if (data) {
//   //       filteredData = data.filter(item => item.Name.includes(queryStr));
//   //     }
//   //     console.warn('sss', filteredData);
//   //     setFilteredData(filteredData);
//   //     // setDropdownIndex(0);
//   //     // setShowDropdown(true);
//   //   } catch (e) {}
//   // };
//   const onChangeText = (queryStr: string) => {
//     setSearchedStr(queryStr);

//     try {
//       let data = global.medicineListData;
//       console.log('Raw global data:', data);
//       console.log('Search query:', queryStr);
//       console.log(
//         'Item Names:',
//         Array.isArray(data) ? data.map(d => d.Name) : 'Not an array',
//       );

//       let filteredData: any[] = [];

//       if (data && Array.isArray(data)) {
//         filteredData = data.filter(
//           item =>
//             typeof item?.Name === 'string' &&
//             item.Name.toLowerCase().includes(queryStr.toLowerCase()),
//         );
//       }

//       // console.log("Filtered data:", filteredData);
//       console.log('filtered');
//       setFilteredData(filteredData);
//     } catch (e) {
//       console.warn('Search error:', e);
//     }
//   };

//   //   const onChangeText = (queryStr: string) => {
//   //     setSearchedStr(queryStr);
//   //     try {
//   //       let data = global.medicineListData;
//   //       console.log('OOOOOOOOOO:', data);
//   //       console.log('..........')
//   //       let filteredData = [];
//   //       if (data) {
//   //         filteredData = data.filter(item =>
//   //           // item.Name.toLowerCase().includes(queryStr.toLowerCase()),
//   // item?.Name?.toLowerCase?.().includes(queryStr.toLowerCase())

//   //         );
//   //       }
//   //       setFilteredData(filteredData);
//   //     } catch (e) {
//   //       console.warn('Search error:', e);
//   //     }
//   //   };
//   // ..........................................................
//   const frequencyToNumber = (frequency: string) => {
//     switch (frequency.toLowerCase()) {
//       case 'oncedaily':
//       case 'onetimedaily':
//       case 'Bed Time':
//         return 1;
//       case '2timesaday':
//         return 2;
//       case '3timesaday':
//         return 3;
//       case '4timesaday':
//         return 4;
//       default:
//         return 1; // fallback
//     }
//   };

//   const updateQuantity = () => {
//     const dose = Number(medicationFormData[0].value) || 1;
//     const frequencyStr = medicationFormData[3].value || '';
//     const duration = Number(medicationFormData[4].value) || 1;

//     // Get the actual unit (DosageValueUnitName)
//     const dosageUnit = (medicationFormData[2].value || '').toLowerCase();

//     const frequency = frequencyToNumber(frequencyStr);

//     // ✅ Consider 'mg' or any unit that implies tablet/capsule
//     const isTabOrCap =
//       // dosageUnit.includes('mg') ||
//       // dosageUnit.includes('tab') ||
//       // dosageUnit.includes('cap');
//       (dosageUnit || '').toLowerCase().includes('mg') ||
//       (dosageUnit || '').toLowerCase().includes('tab') ||
//       (dosageUnit || '').toLowerCase().includes('cap');

//     const quantity = isTabOrCap ? dose * frequency * duration : 1;

//     medicationFormData[5].value = quantity;
//   };

//   // .....................................................
//   const onChangeItemCount = (item: any, index: number, action: string) => {
//     let _value = medicationFormData[index].value;
//     // if (typeof _value === 'number') {
//     //   if (action === 'add') {

//     //     medicationFormData[index].value = _value + 1;
//     //   } else {
//     //     medicationFormData[index].value = _value > 1 ? _value - 1 : 1;
//     //   }
//     // }
//     if (typeof _value === 'number') {
//       if (action === 'add') {
//         // ✅ If Duration, cap at 3
//         if (item.title === 'Duration') {
//           medicationFormData[index].value = _value < 3 ? _value + 1 : 3;
//         } else {
//           medicationFormData[index].value = _value + 1;
//         }
//       } else {
//         medicationFormData[index].value = _value > 1 ? _value - 1 : 1;
//       }
//     }

//     if (item.title === 'Duration') {
//       const duration = medicationFormData[index].value;
//       const startDateValue =
//         medicationFormData[7].value || moment().format('YYYY-MM-DD');
//       const endDate = moment(startDateValue)
//         .add(duration, 'days')
//         .format('YYYY-MM-DD');
//       medicationFormData[8].value = endDate;
//     }
//     // ✅ Recalculate quantity on Dose / Frequency / Duration change
//     if (['Dose', 'Frequency', 'Duration'].includes(item.title)) {
//       updateQuantity();
//       medicationFormData[9].value = generateDirectionToPatient();
//     } //.......................................................

//     setRefreshData(!refreshData);
//   };
//   const onDateSelected = (val: Date) => {
//     // setDob(date);
//     medicationFormData[dateType].value = val.toDateString();
//     setIsDatePickerVisible(false);
//   };
//   // const onSubmit = () => {
//   //   try {
//   //     if (
//   //       medicationFormData.some(
//   //         item => item.value === 0 || item.value?.length === 0,
//   //       ) ||
//   //       medicineName.length === 0
//   //     ) {
//   //       ToastAndroid.show('All fields are required', ToastAndroid.LONG);
//   //       return;
//   //     }
//   //     let diff = moment(medicationFormData[8].value).diff(
//   //       medicationFormData[7].value,
//   //       'days',
//   //     );
//   //     console.warn('diff', diff);
//   //     if (diff >= 1) {
//   //       // go onw
//   //       let patient = props.currentPatient;
//   //       // patient.diagnosis?.PatientWiseList=[]
//   //       let data = {
//   //         // Id: 72,
//   //         // PatientMedicationId: 78,
//   //         Id:
//   //           props.currentPatient && props.selectedMedicationIndex !== -1
//   //             ? patient.medications[props.selectedMedicationIndex].Id
//   //             : null,
//   //         MedicineId: medicineId,
//   //         MedicationListId: medicineId,
//   //         // PatientId: props.currentPatient.patient.PatientId,
//   //         // OrderNumber: 'PH-21-000068',
//   //         // RxNumber: 'RX-000068',
//   //         DrugName: medicineName,
//   //         RemainingQTY: 0,
//   //         Date: '2021-12-29T00:00:00',
//   //         ProviderName: mmkvStorage.getString('loggedInUsername') ?? '',
//   //         DirectionToProivder: medicationFormData[10].value,
//   //         DirectionToPatient: medicationFormData[9].value,
//   //         Quantity: medicationFormData[5].value,
//   //         //Custom Added
//   //         Comments: medicationFormData[11].value,
//   //         Dose: medicationFormData[0].value,
//   //         Route: medicationFormData[1].value,
//   //         DosageForm: medicationFormData[2].value,
//   //         Frequency: medicationFormData[3].value,
//   //         Refill: medicationFormData[6].value,
//   //         //Custom Added
//   //         NoteId: 0,
//   //         Issued: true,
//   //         UnitPrice: 22.8,
//   //         // PatientName: 'Test-1 Test-1',
//   //         // MRNo: '01-01-000006',
//   //         // TokenDate: null,
//   //         EnteredBy: 0,
//   //         EnteredByName: 'Ali',
//   //         EnteredOn: moment().toISOString(),
//   //         UpdatedBy: 0,
//   //         UpdatedOn: moment().toISOString(),
//   //         StartDate: medicationFormData[7].value,
//   //         EndDate: medicationFormData[8].value,
//   //         QtyInStock: 0,
//   //         isNew: true,
//   //         // Alert: false,
//   //       };
//   //       if (props.currentPatient && props.selectedMedicationIndex !== -1) {
//   //         patient.medications[props.selectedMedicationIndex] = data;
//   //       } else {
//   //         if (patient.medications) {
//   //           patient.medications.push(data);
//   //         } else {
//   //           patient.medications = [data];
//   //         }
//   //       }
//   //       props.updateCurrentPatient(patient);
//   //       props.onGoBack();
//   //     } else {
//   //       ToastAndroid.show(
//   //         'Start date should be before end date',
//   //         ToastAndroid.LONG,
//   //       );
//   //     }
//   //   } catch (e) {
//   //     console.warn('err', e);
//   //   }
//   // };
//   //  const generateDirectionToPatient=()=>{
//   // const dose=medicationFormData[0]?.value??'';
//   // const dosageForm=medicationFormData[2]?.value??'';
//   // const frequency = medicationFormData[3]?.value??'';
//   // const duration= medicationFormData[4]?.value??'';
//   // const start= medicationFormData[7].value || moment().format('YYYY-MM-DD');

//   //  let doseText = '';

//   //   if (dosageForm.includes('syrup')) {
//   //     doseText = `${dose} ${dosageForm.toUpperCase()}`;
//   //   } else if (dosageForm.includes('mg')) {
//   //     doseText = `${dose} tablet${dose > 1 ? 's' : ''}`;
//   //   } else if (dosageForm.includes('capsule')) {
//   //     doseText = `${dose} capsule${dose > 1 ? 's' : ''}`;
//   //   } else {
//   //     doseText = `${dose} ${dosageForm}`;
//   //   }

//   // if (dose && dosageForm && frequency && duration && start) {
//   //   if(dosageForm==="SYRUP"){
//   // return `${dose}ml ${dosageForm} ${frequency} For ${duration} day Starting from ${start}`;
//   // }
//   // return `${dose} ${dosageForm} ${frequency} For ${duration} day Starting from ${start}`
//   // }
//   // return medicationFormData[9]?.value ?? '';

//   //       };
//   // const generateDirectionToPatient = () => {
//   //   const dose = medicationFormData[0]?.value ?? '';
//   //   const dosageForm = medicationFormData[2]?.value ?? '';
//   //   const frequency = medicationFormData[3]?.value ?? '';
//   //   const duration = medicationFormData[4]?.value ?? '';
//   //   const start = medicationFormData[7]?.value || moment().format('YYYY-MM-DD');

//   //   if (!(dose && dosageForm && frequency && duration && start)) {
//   //     return ''; //  No fallback to old direction
//   //   }

//   //   if (dosageForm.toLowerCase() === 'syrup' || dosageForm.toLowerCase() === 'syp' || dosageForm.toLowerCase() === 'susp') {
//   //     return `${dose}ml ${dosageForm} ${frequency} For ${duration} day Starting from ${start}`;
//   //   }

//   //   if (dosageForm.includes('mg')) {
//   //     return `${dose} tablet${
//   //       dose > 1 ? 's' : ''
//   //     } ${frequency} For ${duration} day Starting from ${start}`;
//   //   }

//   //   if (dosageForm.includes('capsule')) {
//   //     return `${dose} capsule${
//   //       dose > 1 ? 's' : ''
//   //     } ${frequency} For ${duration} day Starting from ${start}`;
//   //   }

//   //   return `${dose} ${dosageForm} ${frequency} For ${duration} day Starting from ${start}`;
//   // };

//   const generateDirectionToPatient = (formData = medicationFormData) => {
//     const dose = formData[0]?.value ?? '';
//     const dosageForm = formData[2]?.value ?? '';
//     const frequency = formData[3]?.value ?? '';
//     const duration = formData[4]?.value ?? '';
//     const start = formData[7]?.value || moment().format('YYYY-MM-DD');

//     if (!(dose && dosageForm && frequency && duration && start)) {
//       return '';
//     }

//     if (
//       dosageForm.toLowerCase() === 'syrup' ||
//       dosageForm.toLowerCase() === 'syp' ||
//       dosageForm.toLowerCase() === 'susp'
//     ) {
//       return `${dose}ml ${dosageForm} ${frequency} For ${duration} day Starting from ${start}`;
//     }

//     if ((dosageForm || '').toLowerCase().includes('mg')) {
//       return `${dose} tablet${
//         dose > 1 ? 's' : ''
//       } ${frequency} For ${duration} day Starting from ${start}`;
//     }

//     if ((dosageForm || '').toLowerCase().includes('capsule')) {
//       return `${dose} capsule${
//         dose > 1 ? 's' : ''
//       } ${frequency} For ${duration} day Starting from ${start}`;
//     }

//     return `${dose} ${dosageForm} ${frequency} For ${duration} day Starting from ${start}`;
//   };

//   const onSubmit = () => {
//     try {
//       const requiredIndexes = [0, 1, 2, 3, 5, 6, 7]; // indexes of required fields (excluding end date [8], direction to patient [9], direction to pharmacist [10], comments [11])

//       const hasEmptyRequiredField = requiredIndexes.some(
//         idx =>
//           medicationFormData[idx]?.value === 0 ||
//           medicationFormData[idx]?.value?.length === 0,
//       );

//       if (hasEmptyRequiredField || medicineName.length === 0) {
//         ToastAndroid.show(
//           'All required fields must be filled',
//           ToastAndroid.LONG,
//         );
//         return;
//       }

//       // If EndDate is provided, validate it against StartDate
//       const startDate = medicationFormData[7].value;
//       const endDate = medicationFormData[8].value;
//       if (endDate && moment(endDate).diff(startDate, 'days') < 1) {
//         ToastAndroid.show(
//           'Start date should be before end date',
//           ToastAndroid.LONG,
//         );
//         return;
//       }

//       // Proceed with creating the data object
//       let patient = props.currentPatient;

//       let data = {
//         Id:
//           props.currentPatient && props.selectedMedicationIndex !== -1
//             ? patient.medications[props.selectedMedicationIndex].Id
//             : null,
//         MedicineId: medicineId,
//         MedicationListId: medicineId,
//         DrugName: medicineName,
//         RemainingQTY: 0,
//         Date: '2021-12-29T00:00:00',
//         ProviderName: mmkvStorage.getString('loggedInUsername') ?? '',
//         DirectionToProivder: medicationFormData[10]?.value ?? '',
//         DirectionToPatient: medicationFormData[9]?.value ?? '',
//         Quantity: medicationFormData[5]?.value,
//         Comments: medicationFormData[11]?.value ?? '',
//         Dose: medicationFormData[0]?.value,
//         Route: medicationFormData[1]?.value,
//         DosageForm: medicationFormData[2]?.value,
//         Frequency: medicationFormData[3]?.value,
//         Refill: medicationFormData[6]?.value,
//         NoteId: 0,
//         Issued: true,
//         UnitPrice: 22.8,
//         EnteredBy: 0,
//         EnteredByName: 'Ali',
//         EnteredOn: moment().toISOString(),
//         UpdatedBy: 0,
//         UpdatedOn: moment().toISOString(),
//         StartDate: startDate,
//         EndDate: endDate ?? null,
//         QtyInStock: 0,
//         isNew: true,
//       };

//       if (props.currentPatient && props.selectedMedicationIndex !== -1) {
//         patient.medications[props.selectedMedicationIndex] = data;
//       } else {
//         if (patient.medications) {
//           patient.medications.push(data);
//         } else {
//           patient.medications = [data];
//         }
//       }

//       props.updateCurrentPatient(patient);
//       props.onGoBack();
//     } catch (e) {
//       console.warn('err', e);
//     }
//   };

//   return (
//     <ScrollView style={{flex: 1}}>
//       <DatePicker
//         modal
//         open={isDatePickerVisible}
//         mode={'date'}
//         theme={'light'}
//         // maximumDate={new Date('2005-11-02')}
//         date={new Date()}
//         // androidVariant="iosClone"
//         onConfirm={val => onDateSelected(val)}
//         onCancel={() => {
//           setIsDatePickerVisible(false);
//         }}
//       />
//       <View
//         style={{
//           backgroundColor: '#F3F3F3',
//           paddingVertical: 6,
//           paddingHorizontal: 10,
//           marginBottom: 10,
//         }}>
//         <Text preset="bold" style={{fontSize: 14}}>
//           Patient Medications
//         </Text>
//       </View>
//       <View
//         style={{
//           borderWidth: 1,
//           borderColor: '#A1AEC1',
//           // height: 38,
//           backgroundColor: 'white',
//           borderRadius: 6,
//           flexDirection: 'row',
//           alignItems: 'center',
//           marginBottom: filteredData.length > 0 ? 0 : 20,
//         }}>
//         <TextInput
//           value={searchedStr}
//           onChangeText={onChangeText}
//           style={{
//             color: '#94A3B8',
//             fontSize: 12,
//             fontFamily: typography.primary.normal,
//             flex: 1,
//             paddingHorizontal: 10,
//             justifyContent: 'center',
//           }}
//           placeholder="Search Medicine"
//           placeholderTextColor={'#94A3B8'}
//           // editable={!loadingMedicines}
//         />
//         <Icon icon="searchIcon" size={23} style={{marginRight: 10}} />
//       </View>
//       {filteredData.length > 0 && (
//         <View
//           style={{
//             backgroundColor: '#F3F3F3',
//             borderRadius: 12,
//             marginBottom: 20,
//           }}>
//           <FlatList
//             data={filteredData}
//             keyExtractor={item =>
//               item.MedicationListId?.toString() || item.Name
//             }
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 //             onPress={() => {
//                 //               medicineName = item.Name;
//                 //               setSearchedStr(item.Name);
//                 //               medicineId = item.MedicationListId;
//                 //               setFilteredData([]);
//                 //               // ✅ Add this block to auto-set the dosage form unit (e.g., mg, ml, DROP)
//                 //               const dosageFormIndex = medicationFormData.findIndex(
//                 //                 field => field.title === 'Dosage Form',
//                 //               );
//                 //               // if (dosageFormIndex !== -1) {
//                 //               //   medicationFormData[dosageFormIndex].value =
//                 //               //     item.DosageValueUnitName || '';
//                 //               // }
//                 //               if (dosageFormIndex !== -1) {
//                 //                 const lowerName = item.Name?.toLowerCase() || '';
//                 //                 const matchedDosage = dosageForms.find(df =>
//                 //                   lowerName.includes(df.shortName.toLowerCase()),
//                 //                 );

//                 //                 medicationFormData[dosageFormIndex].value = matchedDosage
//                 //                   ? matchedDosage.shortName
//                 //                   : item.DosageValueUnitName || '';
//                 //               }

//                 //               updateQuantity();
//                 //                 // ✅ Auto-update Direction to Patient
//                 // const directionIndex = medicationFormData.findIndex(
//                 //   field => field.title === 'Direction to Patient',
//                 // );
//                 // if (directionIndex !== -1) {
//                 //   medicationFormData[directionIndex].value = generateDirectionToPatient();
//                 // }

//                 //               //  // ✅ Auto-set Quantity to "1" if not TAB or CAP
//                 //               //   const dosageUnit = (item.DosageValueUnitName || '').toUpperCase();
//                 //               //   const isTabOrCap =
//                 //               //     dosageUnit.startsWith('TAB') || dosageUnit.startsWith('CAP');

//                 //               //   if (!isTabOrCap) {
//                 //               //     const quantityIndex = medicationFormData.findIndex(
//                 //               //       field => field.title === 'Quantity',
//                 //               //     );
//                 //               //     if (quantityIndex !== -1) {
//                 //               //       medicationFormData[quantityIndex].value = '1';
//                 //               //     }
//                 //               //   }
//                 //               setRefresh(prev => !prev); // if you’re using a trigger to refresh
//                 //             }}
//                 onPress={() => {
//                   medicineName = item.Name;
//                   setSearchedStr(item.Name);
//                   medicineId = item.MedicationListId;
//                   setFilteredData([]);

//                   // Create a shallow copy of the form data to work with
//                   const updatedData = [...medicationFormData];

//                   // ✅ Step 1: Update Dosage Form based on shortName match
//                   const dosageFormIndex = updatedData.findIndex(
//                     field => field.title === 'Dosage Form',
//                   );
//                   if (dosageFormIndex !== -1) {
//                     const matchedDosage = dosageForms.find(df =>
//                       // item.Name?.toLowerCase().includes(
//                       //   df.shortName.toLowerCase(),
//                       // ),
//                       item?.Name?.toLowerCase?.().includes(
//                         df?.shortName?.toLowerCase?.(),
//                       ),
//                     );
//                     updatedData[dosageFormIndex].value = matchedDosage
//                       ? matchedDosage.shortName
//                       : item.DosageValueUnitName || '';
//                   }

//                   // ✅ Step 2: Update Direction To Patient based on latest form values
//                   const directionIndex = updatedData.findIndex(
//                     field => field.title === 'Direction To Patient',
//                   );
//                   if (directionIndex !== -1) {
//                     updatedData[directionIndex].value =
//                       generateDirectionToPatient(updatedData);
//                   }

//                   // ✅ Step 3: Apply the updates and trigger UI refresh
//                   medicationFormData = updatedData;
//                   setRefreshData(prev => !prev);
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 12,
//                     padding: 6,
//                     paddingHorizontal: 20,
//                   }}>
//                   {item.Name}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       )}
//       <FlatList
//         data={medicationFormData}
//         renderItem={({item, index}) => (
//           <View style={{marginBottom: 8}}>
//             <TouchableOpacity
//               disabled={item.type === 'comments' || item.type === 'counter'}
//               style={{
//                 ...styles.listSubContainer,
//                 height: item.type === 'comments' ? undefined : 46,
//               }}
//               onPress={() => onItemPressed(item, index)}>
//               {item.type === 'comments' ? (
//                 <View>
//                   <Text
//                     preset="bold"
//                     style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
//                     {item.title}:
//                   </Text>
//                   <TextInput
//                     value={item.value}
//                     multiline
//                     onChangeText={val => {
//                       medicationFormData[index].value = val;
//                       if ([0, 2, 3, 4].includes(index)) {
//                         medicationFormData[9].value =
//                           generateDirectionToPatient();
//                       }
//                       setRefreshData(!refreshData);
//                     }}
//                     placeholder="Enter directions"
//                     style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}
//                   />
//                   {/* <Text
//                     preset="bold"
//                     style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
//                     Direction To Pharmacist:
//                   </Text>
//                   <TextInput
//                     placeholder="Enter directions"
//                     style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}
//                   />
//                   <Text
//                     preset="bold"
//                     style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
//                     Comments:
//                   </Text>
//                   <TextInput
//                     placeholder="Enter comments"
//                     style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}
//                   /> */}
//                 </View>
//               ) : (
//                 <>
//                   <Text
//                     style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
//                     {item.title} {item.value ? `- (${item.value})` : ''}
//                   </Text>
//                   <View
//                     style={{
//                       justifyContent: 'center',
//                       marginRight: 16,
//                     }}>
//                     {item.type === 'counter' && (
//                       <TouchableOpacity
//                         style={{height: 20}}
//                         onPress={() => onChangeItemCount(item, index, 'add')}>
//                         <EntypoIcon
//                           name="chevron-up"
//                           color="#80858A"
//                           size={20}
//                           style={{}}
//                         />
//                       </TouchableOpacity>
//                     )}
//                     {item.type !== 'date' ? (
//                       <TouchableOpacity
//                         disabled={item.type !== 'counter'}
//                         onPress={() =>
//                           onChangeItemCount(item, index, 'substract')
//                         }>
//                         <EntypoIcon
//                           name="chevron-down"
//                           color="#80858A"
//                           size={20}
//                           style={{}}
//                         />
//                       </TouchableOpacity>
//                     ) : (
//                       <Icon icon="calendarIcon" size={20} />
//                     )}
//                   </View>
//                 </>
//               )}
//             </TouchableOpacity>
//             {index === dropdownIndex && showDropdown && (
//               <View style={{backgroundColor: '#F3F3F3', borderRadius: 12}}>
//                 <FlatList
//                   data={dropdownList}
//                   renderItem={({item: _itm}) => (
//                     <TouchableOpacity
//                       onPress={() => onDropdownItemPressed(_itm)}>
//                       <Text
//                         style={{
//                           fontSize: 12,
//                           padding: 6,
//                           paddingHorizontal: 20,
//                         }}>
//                         {item.title === 'Route'
//                           ? _itm.Route
//                           : item.title === 'Frequency'
//                           ? _itm.Frequency
//                           : JSON.stringify(_itm)}
//                       </Text>
//                     </TouchableOpacity>
//                   )}
//                 />
//               </View>
//             )}
//           </View>
//         )}
//       />
//       <TouchableOpacity
//         style={{
//           height: 42,
//           width: '100%',
//           backgroundColor: '#2196F3',
//           justifyContent: 'center',
//           alignItems: 'center',
//           marginTop: 15,
//           marginBottom: 6,
//         }}
//         onPress={() => onSubmit()}>
//         <Text preset="bold" style={{color: 'white', fontSize: 14}}>
//           ADD MEDICINE
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   listSubContainer: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: 'rgba(0,0,0,0.16)',
//     paddingVertical: 11,
//     borderRadius: 6,

//     justifyContent: 'space-between',
//   },
// });

import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from './Text';
import {typography} from 'app/theme';
import {Icon} from './Icon';
import DatePicker from 'react-native-date-picker';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {dosageForms} from 'app/constant/DosageForms';
import {mmkvStorage} from 'app/utils/UserContext';

let dropdownList: string[] = [];
let medicineName = '';
let medicationFormData = [];
let medicationFormDataBackup = [
  {title: 'Dose', value: 1, type: 'counter'},
  {title: 'Route', value: 'ORAL', type: 'dropdown', list: ['INJECT', 'ORAL']},
  {
    title: 'Dosage Form',
    value: 'TABLET',
    type: 'dropdown',
    list: ['SYRUP', 'TABLET', 'CAPSULE'],
  },
  {
    title: 'Frequency',
    value: '',
    type: 'dropdown',
    list: ['Once Daily', 'Twice Daily', 'Thrice Daily'],
  },
  {title: 'Duration', value: 1, type: 'counter'},
  {title: 'Quantity', value: 1, type: 'counter'},
  {
    title: 'Refill',
    value: '',
    type: 'dropdown',
    list: ['Once Daily', 'Twice Daily', 'Thrice Daily'],
  },
  {
    title: 'Start Date',
    value: '',
    type: 'date',
  },
  {
    title: 'End Date',
    value: '',
    type: 'date',
  },
  {
    title: 'Direction To Patient',
    value: '',
    type: 'comments',
  },
  {
    title: 'Direction To Pharmacist',
    value: '',
    type: 'comments',
  },
  {
    title: 'Comments',
    value: '',
    type: 'comments',
  },
];
let medicineId = -1;
let dateType = -1;

export default function AddMedicationForm(props: any) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(-1);
  const [refreshData, setRefreshData] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchedStr, setSearchedStr] = useState('');
  useEffect(() => {
    try {
      console.warn(
        'props.selectedMedicationIndex',
        props.selectedMedicationIndex,
      );
      if (props.currentPatient && props.selectedMedicationIndex !== -1) {
        medicationFormData = JSON.parse(
          JSON.stringify(medicationFormDataBackup),
        );
        let medicationsData =
          props.currentPatient.medications[props.selectedMedicationIndex];
        medicineName = medicationsData.DrugName ? medicationsData.DrugName : '';
        medicineId = medicationsData.MedicationListId
          ? medicationsData.MedicationListId
          : '';
        setSearchedStr(medicineName);
        medicationFormData[5].value = medicationsData.Quantity
          ? medicationsData.Quantity
          : 0;
        medicationFormData[9].value = medicationsData.DirectionToPatient
          ? medicationsData.DirectionToPatient
          : '';
        medicationFormData[10].value = medicationsData.DirectionToProivder
          ? medicationsData.DirectionToProivder
          : '';
        medicationFormData[11].value = medicationsData.Comments
          ? medicationsData.Comments
          : '';
        medicationFormData[0].value = medicationsData.Dose
          ? parseInt(medicationsData.Dose)
          : 1;
        medicationFormData[1].value = medicationsData.Route
          ? medicationsData.Route
          : '';
        medicationFormData[2].value = medicationsData.DosageForm
          ? medicationsData.DosageForm
          : '';
        medicationFormData[3].value = medicationsData.Frequency
          ? medicationsData.Frequency
          : '';
        medicationFormData[7].value = medicationsData.StartDate
          ? medicationsData.StartDate
          : '';
        medicationFormData[8].value = medicationsData.EndDate
          ? medicationsData.EndDate
          : '';
        medicationFormData[6].value = medicationsData.Refill
          ? medicationsData.Refill
          : '';
        setRefreshData(!refreshData);
        // medicationFormData[4].value = moment(allergyData.AllergenDate)
        //   ? moment(allergyData.AllergenDate).format('YYYY-MM-DD')
        //   : '';
        console.warn(
          'first',
          medicationFormData[5].value,
          medicationsData.Quantity,
        );
      } else {
        medicationFormData = JSON.parse(
          JSON.stringify(medicationFormDataBackup),
        );
        // Add the start date bydefault to the visit date
        medicationFormData[7].value = moment().format('YYYY-MM-DD');
        setRefreshData(!refreshData);
        console.warn('medicationFormData', medicationFormData);
      }
    } catch (e) {
      console.warn('err', e);
    }
  }, []);

  const onItemPressed = (item: any, index: number) => {
    if (index === 7 || index === 8) {
      dateType = index;
      setIsDatePickerVisible(true);
      return;
    }
    if (showDropdown && index === dropdownIndex) {
      setShowDropdown(false);
      return;
    }
    setDropdownIndex(index);
    if (item.title === 'Route') {
      dropdownList = global.medicineRoutesData ? global.medicineRoutesData : [];
    } else if (item.title === 'Frequency') {
      dropdownList = global.medicineFrequencyData
        ? global.medicineFrequencyData
        : [];
    } else if (item.title === 'Dosage Form') {
      dropdownList = dosageForms.map(item => item.shortName);
    } else {
      dropdownList = item.list;
    }
    setShowDropdown(true);
  };

  const onDropdownItemPressed = (item: any) => {
    medicationFormData[dropdownIndex].value =
      dropdownIndex === 1
        ? item.Route
        : dropdownIndex === 3
        ? item.Frequency
        : item;

    setShowDropdown(false);

    // If Dosage Form or Frequency changed, update quantity
    if (dropdownIndex === 2 || dropdownIndex === 3) {
      updateQuantity();
      setRefreshData(prev => !prev); // trigger re-render
    }
    if ([0, 2, 3, 4].includes(dropdownIndex)) {
      medicationFormData[9].value = generateDirectionToPatient();
      setRefreshData(prev => !prev);
    }

    setShowDropdown(false);
    setRefreshData(prev => !prev); // trigger re-render
  };

  // const onChangeText = (queryStr: string) => {
  //   setSearchedStr(queryStr);
  //   try {
  //     let data = global.medicineListData;
  //     let filteredData = [];
  //     if (data) {
  //       filteredData = data.filter(item => item.Name.includes(queryStr));
  //     }
  //     console.warn('sss', filteredData);
  //     setFilteredData(filteredData);
  //     // setDropdownIndex(0);
  //     // setShowDropdown(true);
  //   } catch (e) {}
  // };
  const onChangeText = (queryStr: string) => {
    setSearchedStr(queryStr);
    try {
      let data = global.medicineListData;
      console.log('OOOOOOOOOO:', data);
      console.log('queryStr:', queryStr);
      let filteredData = [];
      if (data) {
        filteredData = data.filter(item =>
          item.Name.toLowerCase().includes(queryStr.toLowerCase()),
        );
      }
      setFilteredData(filteredData);
    } catch (e) {
      console.warn('Search error:', e);
    }
  };
  // ..........................................................
  const frequencyToNumber = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'oncedaily':
      case 'onetimedaily':
      case 'Bed Time':
        return 1;
      case '2timesaday':
        return 2;
      case '3timesaday':
        return 3;
      case '4timesaday':
        return 4;
      default:
        return 1; // fallback
    }
  };

  const updateQuantity = () => {
    const dose = Number(medicationFormData[0].value) || 1;
    const frequencyStr = medicationFormData[3].value || '';
    const duration = Number(medicationFormData[4].value) || 1;

    // Get the actual unit (DosageValueUnitName)
    const dosageUnit = (medicationFormData[2].value || '').toLowerCase();

    const frequency = frequencyToNumber(frequencyStr);

    // ✅ Consider 'mg' or any unit that implies tablet/capsule
    const isTabOrCap =
      dosageUnit.includes('mg') ||
      dosageUnit.includes('tab') ||
      dosageUnit.includes('cap');

    const quantity = isTabOrCap ? dose * frequency * duration : 1;

    medicationFormData[5].value = quantity;
  };

  // .....................................................
  const onChangeItemCount = (item: any, index: number, action: string) => {
    let _value = medicationFormData[index].value;
    if (typeof _value === 'number') {
      if (action === 'add') {
        // ✅ If Duration, cap at 3
        if (item.title === 'Duration') {
          medicationFormData[index].value = _value < 3 ? _value + 1 : 3;
        } else {
          medicationFormData[index].value = _value + 1;
        }
      } else {
        medicationFormData[index].value = _value > 1 ? _value - 1 : 1;
      }
    }

    if (item.title === 'Duration') {
      const duration = medicationFormData[index].value;
      const startDateValue =
        medicationFormData[7].value || moment().format('YYYY-MM-DD');
      const endDate = moment(startDateValue)
        .add(duration, 'days')
        .format('YYYY-MM-DD');
      medicationFormData[8].value = endDate;
    }
    // ✅ Recalculate quantity on Dose / Frequency / Duration change
    if (['Dose', 'Frequency', 'Duration'].includes(item.title)) {
      updateQuantity();
      medicationFormData[9].value = generateDirectionToPatient();
    } //.......................................................

    setRefreshData(!refreshData);
  };
  const onDateSelected = (val: Date) => {
    // setDob(date);
    medicationFormData[dateType].value = val.toDateString();
    setIsDatePickerVisible(false);
  };
  // const onSubmit = () => {
  //   try {
  //     if (
  //       medicationFormData.some(
  //         item => item.value === 0 || item.value?.length === 0,
  //       ) ||
  //       medicineName.length === 0
  //     ) {
  //       ToastAndroid.show('All fields are required', ToastAndroid.LONG);
  //       return;
  //     }
  //     let diff = moment(medicationFormData[8].value).diff(
  //       medicationFormData[7].value,
  //       'days',
  //     );
  //     console.warn('diff', diff);
  //     if (diff >= 1) {
  //       // go onw
  //       let patient = props.currentPatient;
  //       // patient.diagnosis?.PatientWiseList=[]
  //       let data = {
  //         // Id: 72,
  //         // PatientMedicationId: 78,
  //         Id:
  //           props.currentPatient && props.selectedMedicationIndex !== -1
  //             ? patient.medications[props.selectedMedicationIndex].Id
  //             : null,
  //         MedicineId: medicineId,
  //         MedicationListId: medicineId,
  //         // PatientId: props.currentPatient.patient.PatientId,
  //         // OrderNumber: 'PH-21-000068',
  //         // RxNumber: 'RX-000068',
  //         DrugName: medicineName,
  //         RemainingQTY: 0,
  //         Date: '2021-12-29T00:00:00',
  //         ProviderName: mmkvStorage.getString('loggedInUsername') ?? '',
  //         DirectionToProivder: medicationFormData[10].value,
  //         DirectionToPatient: medicationFormData[9].value,
  //         Quantity: medicationFormData[5].value,
  //         //Custom Added
  //         Comments: medicationFormData[11].value,
  //         Dose: medicationFormData[0].value,
  //         Route: medicationFormData[1].value,
  //         DosageForm: medicationFormData[2].value,
  //         Frequency: medicationFormData[3].value,
  //         Refill: medicationFormData[6].value,
  //         //Custom Added
  //         NoteId: 0,
  //         Issued: true,
  //         UnitPrice: 22.8,
  //         // PatientName: 'Test-1 Test-1',
  //         // MRNo: '01-01-000006',
  //         // TokenDate: null,
  //         EnteredBy: 0,
  //         EnteredByName: 'Ali',
  //         EnteredOn: moment().toISOString(),
  //         UpdatedBy: 0,
  //         UpdatedOn: moment().toISOString(),
  //         StartDate: medicationFormData[7].value,
  //         EndDate: medicationFormData[8].value,
  //         QtyInStock: 0,
  //         isNew: true,
  //         // Alert: false,
  //       };
  //       if (props.currentPatient && props.selectedMedicationIndex !== -1) {
  //         patient.medications[props.selectedMedicationIndex] = data;
  //       } else {
  //         if (patient.medications) {
  //           patient.medications.push(data);
  //         } else {
  //           patient.medications = [data];
  //         }
  //       }
  //       props.updateCurrentPatient(patient);
  //       props.onGoBack();
  //     } else {
  //       ToastAndroid.show(
  //         'Start date should be before end date',
  //         ToastAndroid.LONG,
  //       );
  //     }
  //   } catch (e) {
  //     console.warn('err', e);
  //   }
  // };

  const generateDirectionToPatient = () => {
    const dose = medicationFormData[0]?.value ?? '';
    const dosageForm = medicationFormData[2]?.value ?? '';
    const frequency = medicationFormData[3]?.value ?? '';
    const duration = medicationFormData[4]?.value ?? '';
    const start = medicationFormData[7]?.value || moment().format('YYYY-MM-DD');
    if (!(dose && dosageForm && frequency && duration && start)) {
      return '';
    }

    if (
      dosageForm.toLowerCase() === 'syrup' ||
      dosageForm.toLowerCase() === 'syp' ||
      dosageForm.toLowerCase() === 'susp'
    ) {
      return `${dose}ml ${dosageForm} ${frequency} For ${duration} day Starting from ${start}`;
    }

    if ((dosageForm || '').toLowerCase().includes('mg')) {
      return `${dose} tablet${
        dose > 1 ? 's' : ''
      } ${frequency} For ${duration} day Starting from ${start}`;
    }

    if ((dosageForm || '').toLowerCase().includes('capsule')) {
      return `${dose} capsule${
        dose > 1 ? 's' : ''
      } ${frequency} For ${duration} day Starting from ${start}`;
    }

    return `${dose} ${dosageForm} ${frequency} For ${duration} day Starting from ${start}`;
  };

  const onSubmit = () => {
    try {
      const requiredIndexes = [0, 1, 2, 3, 5, 6, 7]; // indexes of required fields (excluding end date [8], direction to patient [9], direction to pharmacist [10], comments [11])

      const hasEmptyRequiredField = requiredIndexes.some(
        idx =>
          medicationFormData[idx]?.value === 0 ||
          medicationFormData[idx]?.value?.length === 0,
      );

      if (hasEmptyRequiredField || medicineName.length === 0) {
        ToastAndroid.show(
          'All required fields must be filled',
          ToastAndroid.LONG,
        );
        return;
      }

      // If EndDate is provided, validate it against StartDate
      const startDate = medicationFormData[7].value;
      const endDate = medicationFormData[8].value;
      if (endDate && moment(endDate).diff(startDate, 'days') < 1) {
        ToastAndroid.show(
          'Start date should be before end date',
          ToastAndroid.LONG,
        );
        return;
      }

      // Proceed with creating the data object
      let patient = props.currentPatient;

      let data = {
        Id:
          props.currentPatient && props.selectedMedicationIndex !== -1
            ? patient.medications[props.selectedMedicationIndex].Id
            : null,
        MedicineId: medicineId,
        MedicationListId: medicineId,
        DrugName: medicineName,
        RemainingQTY: 0,
        Date: '2021-12-29T00:00:00',
        ProviderName: mmkvStorage.getString('loggedInUsername') ?? '',
        DirectionToProivder: medicationFormData[10]?.value ?? '',
        DirectionToPatient: medicationFormData[9]?.value ?? '',
        Quantity: medicationFormData[5]?.value,
        Comments: medicationFormData[11]?.value ?? '',
        Dose: medicationFormData[0]?.value,
        Route: medicationFormData[1]?.value,
        DosageForm: medicationFormData[2]?.value,
        Frequency: medicationFormData[3]?.value,
        Refill: medicationFormData[6]?.value,
        NoteId: 0,
        Issued: true,
        UnitPrice: 22.8,
        EnteredBy: 0,
        EnteredByName: 'Ali',
        EnteredOn: moment().toISOString(),
        UpdatedBy: 0,
        UpdatedOn: moment().toISOString(),
        StartDate: startDate,
        EndDate: endDate ?? null,
        QtyInStock: 0,
        isNew: true,
      };

      if (props.currentPatient && props.selectedMedicationIndex !== -1) {
        patient.medications[props.selectedMedicationIndex] = data;
      } else {
        if (patient.medications) {
          patient.medications.push(data);
        } else {
          patient.medications = [data];
        }
      }

      props.updateCurrentPatient(patient);
      props.onGoBack();
    } catch (e) {
      console.warn('err', e);
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      <DatePicker
        modal
        open={isDatePickerVisible}
        mode={'date'}
        theme={'light'}
        // maximumDate={new Date('2005-11-02')}
        date={new Date()}
        // androidVariant="iosClone"
        onConfirm={val => onDateSelected(val)}
        onCancel={() => {
          setIsDatePickerVisible(false);
        }}
      />
      <View
        style={{
          backgroundColor: '#F3F3F3',
          paddingVertical: 6,
          paddingHorizontal: 10,
          marginBottom: 10,
        }}>
        <Text preset="bold" style={{fontSize: 14}}>
          Patient Medications
        </Text>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: '#A1AEC1',
          // height: 38,
          backgroundColor: 'white',
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: filteredData.length > 0 ? 0 : 20,
        }}>
        <TextInput
          value={searchedStr}
          onChangeText={onChangeText}
          style={{
            color: '#94A3B8',
            fontSize: 12,
            fontFamily: typography.primary.normal,
            flex: 1,
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}
          placeholder="Search Medicine"
          placeholderTextColor={'#94A3B8'}
        />
        <Icon icon="searchIcon" size={23} style={{marginRight: 10}} />
      </View>
      {filteredData.length > 0 && (
        <View
          style={{
            backgroundColor: '#F3F3F3',
            borderRadius: 12,
            marginBottom: 20,
          }}>
          <FlatList
            data={filteredData}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  medicineName = item.Name;
                  setSearchedStr(item.Name);
                  medicineId = item.MedicationListId;
                  setFilteredData([]);
                  // // ✅ Add this block to auto-set the dosage form unit (e.g., mg, ml, DROP)
                  // const dosageFormIndex = medicationFormData.findIndex(
                  //   field => field.title === 'Dosage Form',
                  // );
                  // if (dosageFormIndex !== -1) {
                  //   medicationFormData[dosageFormIndex].value =
                  //     item.DosageValueUnitName || '';
                  // }
                  const updatedData = [...medicationFormData];
                  // ✅ Step 1: Update Dosage Form based on shortName match
                  const dosageFormIndex = updatedData.findIndex(
                    field => field.title === 'Dosage Form',
                  );
                  if (dosageFormIndex !== -1) {
                    const matchedDosage = dosageForms.find(df =>
                      // item.Name?.toLowerCase().includes(
                      //   df.shortName.toLowerCase(),
                      // ),
                      item?.Name?.toLowerCase?.().includes(
                        df?.shortName?.toLowerCase?.(),
                      ),
                    );
                    updatedData[dosageFormIndex].value = matchedDosage
                      ? matchedDosage.shortName
                      : item.DosageValueUnitName || '';
                  }
                  // ✅ Step 2: Update Direction To Patient based on latest form values
                  const directionIndex = updatedData.findIndex(
                    field => field.title === 'Direction To Patient',
                  );
                  if (directionIndex !== -1) {
                    updatedData[directionIndex].value =
                      generateDirectionToPatient(updatedData);
                  }
                  updateQuantity();
                  //  // ✅ Auto-set Quantity to "1" if not TAB or CAP
                  //   const dosageUnit = (item.DosageValueUnitName || '').toUpperCase();
                  //   const isTabOrCap =
                  //     dosageUnit.startsWith('TAB') || dosageUnit.startsWith('CAP');

                  //   if (!isTabOrCap) {
                  //     const quantityIndex = medicationFormData.findIndex(
                  //       field => field.title === 'Quantity',
                  //     );
                  //     if (quantityIndex !== -1) {
                  //       medicationFormData[quantityIndex].value = '1';
                  //     }
                  //   }
                  setRefreshData(prev => !prev); // if you’re using a trigger to refresh
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    padding: 6,
                    paddingHorizontal: 20,
                  }}>
                  {item.Name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <FlatList
        data={medicationFormData}
        renderItem={({item, index}) => (
          <View style={{marginBottom: 8}}>
            <TouchableOpacity
              disabled={item.type === 'comments' || item.type === 'counter'}
              style={{
                ...styles.listSubContainer,
                height: item.type === 'comments' ? undefined : 46,
              }}
              onPress={() => onItemPressed(item, index)}>
              {item.type === 'comments' ? (
                <View>
                  <Text
                    preset="bold"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
                    {item.title}:
                  </Text>
                  <TextInput
                    value={item.value}
                    multiline
                    onChangeText={val => {
                      medicationFormData[index].value = val;
                      if ([0, 2, 3, 4].includes(index)) {
                        medicationFormData[9].value =
                          generateDirectionToPatient();
                      }
                      setRefreshData(!refreshData);
                    }}
                    placeholder="Enter directions"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}
                  />
                  {/* <Text
                    preset="bold"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
                    Direction To Pharmacist:
                  </Text>
                  <TextInput
                    placeholder="Enter directions"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}
                  />
                  <Text
                    preset="bold"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
                    Comments:
                  </Text>
                  <TextInput
                    placeholder="Enter comments"
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}
                  /> */}
                </View>
              ) : (
                <>
                  <Text
                    style={{color: '#80858A', fontSize: 12, paddingLeft: 16}}>
                    {item.title} {item.value ? `- (${item.value})` : ''}
                  </Text>
                  <View
                    style={{
                      justifyContent: 'center',
                      marginRight: 16,
                    }}>
                    {item.type === 'counter' && (
                      <TouchableOpacity
                        style={{height: 20}}
                        onPress={() => onChangeItemCount(item, index, 'add')}>
                        <EntypoIcon
                          name="chevron-up"
                          color="#80858A"
                          size={20}
                          style={{}}
                        />
                      </TouchableOpacity>
                    )}
                    {item.type !== 'date' ? (
                      <TouchableOpacity
                        disabled={item.type !== 'counter'}
                        onPress={() =>
                          onChangeItemCount(item, index, 'substract')
                        }>
                        <EntypoIcon
                          name="chevron-down"
                          color="#80858A"
                          size={20}
                          style={{}}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Icon icon="calendarIcon" size={20} />
                    )}
                  </View>
                </>
              )}
            </TouchableOpacity>
            {index === dropdownIndex && showDropdown && (
              <View style={{backgroundColor: '#F3F3F3', borderRadius: 12}}>
                <FlatList
                  data={dropdownList}
                  renderItem={({item: _itm}) => (
                    <TouchableOpacity
                      onPress={() => onDropdownItemPressed(_itm)}>
                      <Text
                        style={{
                          fontSize: 12,
                          padding: 6,
                          paddingHorizontal: 20,
                        }}>
                        {item.title === 'Route'
                          ? _itm.Route
                          : item.title === 'Frequency'
                          ? _itm.Frequency
                          : JSON.stringify(_itm)}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        )}
      />
      <TouchableOpacity
        style={{
          height: 42,
          width: '100%',
          backgroundColor: '#2196F3',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 15,
          marginBottom: 6,
        }}
        onPress={() => onSubmit()}>
        <Text preset="bold" style={{color: 'white', fontSize: 14}}>
          ADD MEDICINE
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listSubContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
    paddingVertical: 11,
    borderRadius: 6,

    justifyContent: 'space-between',
  },
});
