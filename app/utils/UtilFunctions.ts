import DeviceInfo from 'react-native-device-info';

export const getDoctorNameFromPatient = (patient: any) => {
  try {
    if (patient.physicalExams[0].EnteredBy) {
      return patient.physicalExams[0].EnteredBy;
    }
    return '';
  } catch (e) {
    return '';
  }
};

export const getPhysicalExamFromPatients = () => {
  try {
    if (global.patientsBackup) {
      let itemToFind = global.patientsBackup.find(
        item => item.physicalExams.length > 0,
      );
      if (itemToFind) {
        return itemToFind.physicalExams;
      }
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const getPresentCompFromPatients = () => {
  try {
    if (global.patientsBackup) {
      let itemToFind = global.patientsBackup.find(
        item => item.presentingComplain.length > 0,
      );
      if (itemToFind) {
        return itemToFind.presentingComplain;
      }
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const createDeepCopy = (data: any) => {
  return JSON.parse(JSON.stringify(data ? data : []));
};
