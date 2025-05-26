import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from './Text';
import {Icon} from './Icon';
import {
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {typography} from 'app/theme';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {mmkvStorage} from 'app/utils/UserContext';
import {isTablet} from 'react-native-device-info';

export default function SoapObjectiveItem(props: any) {
  const [vitalsData, setVitalsData] = useState([
    {
      icon: 'pulseIcon',
      title: 'Pulse',
      value: '',
      unit: 'BPM',
      bgColor: '#F4F4F4',
    },
    {
      icon: 'tempIcon',
      title: 'Temp',
      value: '',
      unit: 'F',
      bgColor: '#F4F4F4',
    },
    {
      icon: 'bpSysIcon',
      title: 'BP Systolic',
      value: '',
      unit: 'mmHg',
      bgColor: '#FFE7DF',
    },
    {
      icon: 'sp02Icon',
      title: 'SpO2',
      value: '',
      unit: '%',
      bgColor: '#F4F4F4',
    },
    {
      icon: 'bpDia',
      title: 'BP Diastolic',
      value: '',
      unit: 'mmHg',
      bgColor: '#E0FFDB',
    },
    {
      icon: 'weightIcon',
      title: 'Weight',
      value: '',
      unit: 'KG',
      bgColor: '#F4F4F4',
    },
    {
      icon: 'bmiIcon',
      title: 'BMI',
      value: '',
      unit: 'kg/m*m',
      bgColor: '#F4F4F4',
    },
    {
      icon: 'heightIcon',
      title: 'Height',
      value: '',
      unit: 'F',
      bgColor: '#F4F4F4',
    },
    {
      icon: 'waistCircumIcon',
      title: 'Waist Circumference',
      value: '',
      unit: 'CM',
      bgColor: '#F4F4F4',
    },
  ]);
  const [vitalActiveEditIndex, setVitalActiveEditIndex] = useState(-1);
  const [pateintHistoryData, setPateintHistoryData] = useState([]);

  useEffect(() => {
    try {
      if (props.currentPatient && props.currentPatient.vitals) {
        let patientData = JSON.parse(JSON.stringify(props.currentPatient));
        patientData.vitals.sort((a, b) => {
          let now = moment();
          return now.diff(moment(a.VitalDate)) - now.diff(moment(b.VitalDate));
        });
        props.updateCurrentPatient(patientData);

        let _vitals = patientData.vitals[0]?.Data;
        if (_vitals) {
          console.warn('_vitalss', _vitals);
          let newVitalsData = [...vitalsData];
          vitalsData.forEach((item, index) => {
            for (let i = 0; i < _vitals.length; i++) {
              if (_vitals[i].Name === item.title) {
                newVitalsData[index].value = _vitals[i].Value;
                newVitalsData[index].unit = _vitals[i].Unit;
                break;
              }
            }
          });
          setVitalsData(newVitalsData);
        }
        if (props.currentPatient.history) {
          let _history = JSON.parse(
            JSON.stringify(props.currentPatient.history),
          );
          const groupedData: {[key: string]: any[]} = _history.reduce(
            (prevValue: {[key: string]: any[]}, item: any) => {
              const key = item.QuestionGroupName;

              if (!prevValue[key]) {
                prevValue[key] = [];
              }

              prevValue[key].push(item);

              return prevValue;
            },
            {} as {[key: string]: any[]},
          );

          const dataArray: {title: string; data: any[]}[] = Object.keys(
            groupedData,
          ).map(key => ({
            title: key,
            data: groupedData[key],
          }));
          setPateintHistoryData(dataArray);
        }
      }
    } catch (e) {
      console.warn('err::', e);
    }
  }, []);

  const onEditPressed = (index: number) => {
    try {
      if (vitalActiveEditIndex === index) {
        ///
        let _vitals = props.currentPatient.vitals;
        let tempVitalsData = [...vitalsData];
        let isPrevVitalUpdated = false;
        for (let i = 0; i < _vitals[0]?.Data.length; i++) {
          console.warn('checking ', _vitals[0]?.Data[i].Name);
          if (_vitals[0]?.Data[i].Name === tempVitalsData[index].title) {
            _vitals[0].Data[i].Value = tempVitalsData[index].value;
            isPrevVitalUpdated = true;
            console.warn('updating ', _vitals[0]?.Data[i]);
            break;
          }
        }
        if (!isPrevVitalUpdated) {
          _vitals[0]?.Data.push({
            Name: tempVitalsData[index].title,
            Value: tempVitalsData[index].value,
            Unit: tempVitalsData[index].unit,
          });
        }
        props.updateCurrentPatient({
          ...props.currentPatient,
          vitals: _vitals,
        });
        setVitalActiveEditIndex(-1);
      } else {
        setVitalActiveEditIndex(index);
      }
    } catch (e) {}
  };

  const onVitalChange = (val: string) => {
    let _vitalsData = [...vitalsData];
    _vitalsData[vitalActiveEditIndex].value = val;
    setVitalsData(_vitalsData);
  };

  const onSelectItem = (
    item: string,
    index: number,
    type: string,
    dataIndex: number,
  ) => {
    try {
      if (type === 'history') {
        let temp = [...pateintHistoryData];
        console.warn('temp[index]', temp[index], index);
        if (temp[index]?.data[dataIndex]?.selectedAnswers) {
          let indToFind = temp[index]?.data[
            dataIndex
          ]?.selectedAnswers.findIndex(ite => ite === item);
          if (indToFind !== -1) {
            temp[index]?.data[dataIndex]?.selectedAnswers.splice(indToFind, 1);
          } else {
            temp[index].data[dataIndex].selectedAnswers = [
              ...temp[index]?.data[dataIndex]?.selectedAnswers,
              item,
            ];
          }
        } else {
          temp[index].data[dataIndex].selectedAnswers = [item];
        }
        setPateintHistoryData(temp);
        //////////////////// Updating main context ///////////////////////
        let patientHistData = JSON.parse(
          JSON.stringify(props.currentPatient.history),
        );
        let indToFind = patientHistData.findIndex(
          it =>
            it.QuestionGroupName ===
              temp[index]?.data[dataIndex]?.QuestionGroupName &&
            it.QuestionName === temp[index]?.data[dataIndex]?.QuestionName &&
            it.Id === temp[index]?.data[dataIndex]?.Id,
        );
        console.warn('main indToFind', indToFind);
        if (indToFind !== -1) {
          if (patientHistData[indToFind]?.selectedAnswers) {
            let innerIndToFind = patientHistData[
              indToFind
            ]?.selectedAnswers.findIndex(ite => ite === item);
            if (innerIndToFind !== -1) {
              patientHistData[indToFind]?.selectedAnswers.splice(
                innerIndToFind,
                1,
              );
            } else {
              patientHistData[indToFind].selectedAnswers = [
                ...patientHistData[indToFind]?.selectedAnswers,
                item,
              ];
            }
          } else {
            patientHistData[indToFind].selectedAnswers = [item];
          }
          props.updateCurrentPatient({
            ...props.currentPatient,
            history: patientHistData,
          });
        }
        //////////////////// Updating main context ///////////////////////
      } else {
        let data = props.currentPatient?.diagnosis;
        if (data?.PatientWiseList[index].selectedAnswers) {
          let indToFind = data.PatientWiseList[index].selectedAnswers.findIndex(
            ite => ite === item,
          );
          if (indToFind !== -1) {
            data.PatientWiseList[index].selectedAnswers.splice(indToFind, 1);
          } else {
            data.PatientWiseList[index].selectedAnswers = [
              ...data?.PatientWiseList[index].selectedAnswers,
              item,
            ];
          }
        } else {
          data.PatientWiseList[index].selectedAnswers = [item];
        }
        props.updateCurrentPatient({
          ...props.currentPatient,
          diagnosis: data,
        });
      }
    } catch (e) {
      console.warn('err', e, index);
    }
  };

  const checkIfItemExistsInList = (
    index: number,
    itemToCheck: string,
    type: string,
    dataIndex: number,
  ) => {
    try {
      if (type === 'history') {
        let temp = [...pateintHistoryData];
        let data = temp[index]?.data[dataIndex]?.selectedAnswers;
        if (data.includes(itemToCheck)) {
          console.warn('first');
          return true;
        } else {
          // console.warn('first', data[index]);
          return false;
        }
      } else {
        let data =
          props.currentPatient?.diagnosis.PatientWiseList[index]
            .selectedAnswers;

        if (data.includes(itemToCheck)) {
          console.warn('first');
          return true;
        } else {
          // console.warn('first', data[index]);
          return false;
        }
      }
    } catch (e) {
      // console.warn('err checking ::', e, index);
      return false;
    }
  };

  const ListSubContainerText = (props: {value: string}) => {
    return (
      <View style={styles.listSubContainer}>
        <Text
          preset="default"
          style={{
            color: '#4B465C',
            fontSize: 11,
          }}>
          {props.value}
        </Text>
      </View>
    );
  };
  const ListSubItemForDetails = (props: {
    data: any;
    type: string;
    itemIndex: number;
  }) => {
    let dataToMap =
      props.type === 'history'
        ? props.data?.data
        : [
            {
              QuestionName: 'Problem',
              QuestionAnswer: props.data.Problem,
            },
            {
              QuestionName: 'Severity',
              QuestionAnswer: props.data.Severity,
            },
          ];

    return (
      <>
        <ListSubContainerText
          value={`Last updated By ${
            props.type !== 'history'
              ? props.data.UpdatedBy
                ? props.data.UpdatedBy
                : mmkvStorage.getString('loggedInUsername')
              : props.data?.data[0]
              ? props.data?.data[0].UpdatedBy
                ? props.data?.data[0].UpdatedBy
                : mmkvStorage.getString('loggedInUsername')
              : mmkvStorage.getString('loggedInUsername')
          } - ${
            props.type !== 'history'
              ? props.data?.UpdatedOn
                ? moment(props.data?.UpdatedOn).format('DD/MM/YYYY')
                : ''
              : props.data?.data[0]?.EnteredOn
              ? moment(props.data?.data[0]?.EnteredOn).format('DD/MM/YYYY')
              : ''
          }`}
        />
        <View style={styles.listSubContainer}>
          <View
            style={{
              backgroundColor: '#2196F3',
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 16,
              maxWidth: widthPercentageToDP(23),
            }}>
            <Text
              preset="bold"
              style={{
                color: 'white',
                fontSize: 10,
              }}>
              {props.type === 'history'
                ? props.data.title
                : props.data.Chronicity}
            </Text>
          </View>
          <View style={{flex: 1, marginLeft: wp(1)}}>
            {dataToMap.map((item, index) => (
              <>
                {item.QuestionAnswer?.length > 0 && (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      // alignItems: 'center',
                    }}>
                    <Text
                      preset="bold"
                      style={{
                        fontSize: isTablet() ? 12 : widthPercentageToDP(2.5),
                        maxWidth: widthPercentageToDP(17),
                      }}>
                      {item.QuestionName}{' '}
                    </Text>
                    <FlatList
                      style={{
                        width: widthPercentageToDP(48),
                      }}
                      numColumns={8}
                      columnWrapperStyle={{flexWrap: 'wrap'}}
                      data={item.QuestionAnswer.split(',')}
                      renderItem={({item}) => (
                        <>
                          {item && (
                            <Text
                              preset="default"
                              style={{
                                fontSize: isTablet()
                                  ? 12
                                  : widthPercentageToDP(2.5),
                                fontFamily: checkIfItemExistsInList(
                                  props.itemIndex,
                                  item,
                                  props.type,
                                  index,
                                )
                                  ? typography.primary.bold
                                  : typography.primary.normal,
                              }}
                              onPress={() =>
                                onSelectItem(
                                  item,
                                  props.itemIndex,
                                  props.type,
                                  index,
                                )
                              }>
                              {item},
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>
                )}
              </>
            ))}
          </View>
        </View>
      </>
    );
  };
  console.warn(
    'first',
    props.innerExpandedItem,
    props.currentPatient?.diagnosis,
  );
  return (
    <>
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
            Vitals
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (props.innerExpandedItem !== 'vital') {
                props.setInnerExpandedItem('vital');
              } else {
                props.setInnerExpandedItem('');
              }
            }}>
            <Icon icon={'eyeIcon'} size={24} style={{marginLeft: 6}} />
          </TouchableOpacity>
          {/* <Icon icon={'blueAddIcon'} size={20} style={{marginLeft: 6}} /> */}
          {props.innerExpandedItem === 'vital' && (
            <TouchableOpacity
              onPress={props.onViewAllPressed}
              style={{
                height: 18,
                width: 71,
                position: 'absolute',
                right: 20,
                borderWidth: 2,
                borderColor: '#23AAFA',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                flexDirection: 'row',
                borderRadius: 4,
                // paddingHorizontal: 10,
              }}>
              <Text
                preset="bold"
                style={{
                  color: '#23AAFA',
                  fontSize: 9,
                  lineHeight: 13,
                }}>
                VIEW ALL
              </Text>
              <EntypoIcon name="chevron-right" color={'#23AAFA'} size={12} />
            </TouchableOpacity>
          )}
        </View>
        {props.innerExpandedItem === 'vital' && (
          <View
            style={{
              backgroundColor: 'white',
              borderTopWidth: 0.5,
              borderBottomWidth: 0.5,
              borderColor: '#56B4FF',
              alignItems: 'center',
              paddingTop: 6,
              paddingHorizontal: 4,
            }}>
            <FlatList
              // horizontal
              numColumns={2}
              data={vitalsData}
              columnWrapperStyle={{justifyContent: 'space-between'}}
              renderItem={({item, index}) => (
                <View
                  style={{
                    // height: 36,
                    backgroundColor: item.bgColor,
                    borderRadius: 3,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: index === 8 ? '99.5%' : '49%',
                    marginBottom: 5,
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: '86%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingBottom: 4,
                    }}>
                    <Icon
                      icon={item.icon}
                      size={
                        isTablet()
                          ? widthPercentageToDP(2)
                          : widthPercentageToDP(5)
                      }
                    />
                    <View style={{marginLeft: wp(1)}}>
                      <Text
                        //   preset=""
                        style={{
                          paddingTop: 8,
                          color: 'black',
                          fontSize: isTablet() ? 12 : widthPercentageToDP(2.6),
                          width:
                            item.title === 'Waist Circumference'
                              ? widthPercentageToDP(55)
                              : widthPercentageToDP(25),
                          lineHeight: 10,
                          fontFamily: typography.primary.normal,
                          paddingLeft: 3,
                        }}>
                        {item.title} ({item.unit})
                      </Text>
                      {/* <Text
                      preset="bold"
                      style={{
                        color: 'black',
                        fontSize: 10,
                        lineHeight: 16,
                      }}>
                      {item.value}
                    </Text> */}
                      <TextInput
                        editable={vitalActiveEditIndex === index}
                        value={item.value}
                        placeholder="Enter"
                        placeholderTextColor={'grey'}
                        maxLength={6}
                        style={{
                          color: 'black',
                          fontSize: isTablet() ? 12 : widthPercentageToDP(2.4),
                          // lineHeight: 16,
                          fontFamily: typography.primary.bold,
                          height: 20,
                          paddingVertical: 0,
                          // color:'grey'
                        }}
                        onChangeText={onVitalChange}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => onEditPressed(index)}
                    style={{height: 20, width: 18}}>
                    <Icon
                      icon={
                        vitalActiveEditIndex === index ? 'check' : 'editIcon'
                      }
                      size={isTablet() ? 20 : widthPercentageToDP(4.5)}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
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
            Physical Exam
          </Text>
          <TouchableOpacity onPress={() => props.onPhysicalExamPressed(0)}>
            <Icon icon={'eyeIcon'} size={24} style={{marginLeft: 6}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.onPhysicalExamPressed(1)}>
            <Icon icon={'blueAddIcon'} size={20} style={{marginLeft: 6}} />
          </TouchableOpacity>
        </View>
        {/* <ListSubContainerText value="Last updated By Noureen anjum - 1/17/2024 3:25:41 AM" /> */}
        {/* <FlatList
          data={physicalExamsData}
          renderItem={({item}) => <ListSubItemForDetails data={item} />}
        /> */}
        {/* <View style={styles.listSubContainer}></View> */}
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
            Diagnosis
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (props.innerExpandedItem !== 'diagnosis') {
                props.setInnerExpandedItem('diagnosis');
              } else {
                props.setInnerExpandedItem('');
              }
            }}>
            <Icon icon={'eyeIcon'} size={24} style={{marginLeft: 6}} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.onDiagnosisPressed(); //.....
            }}>
            <Icon icon={'blueAddIcon'} size={20} style={{marginLeft: 6}} />
          </TouchableOpacity>
        </View>
        {props.innerExpandedItem === 'diagnosis' && (
          <FlatList
            data={props.currentPatient?.diagnosis?.PatientWiseList}
            renderItem={({item, index}) => (
              <ListSubItemForDetails itemIndex={index} data={item} type="" />
            )}
          />
        )}
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
            Patient History
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (props.innerExpandedItem !== 'history') {
                props.setInnerExpandedItem('history');
              } else {
                props.setInnerExpandedItem('');
              }
            }}>
            <Icon icon={'eyeIcon'} size={24} style={{marginLeft: 6}} />
          </TouchableOpacity>
          {/* <Icon icon={'blueAddIcon'} size={20} style={{marginLeft: 6}} /> */}
        </View>
        {props.innerExpandedItem === 'history' && (
          <FlatList
            data={pateintHistoryData}
            renderItem={({item, index}) => (
              <ListSubItemForDetails
                itemIndex={index}
                data={item}
                type="history"
              />
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listSubContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#56B4FF',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
});
