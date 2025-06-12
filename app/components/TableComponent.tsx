import {
  FlatList,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from './Text';
import {Button} from './Button';
import {typography} from 'app/theme';
import {Icon} from './Icon';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import moment from 'moment';
import {physicalExam, presentComplaint} from 'app/utils/staticDataUtil';
import {createDeepCopy} from 'app/utils/UtilFunctions';
import {mmkvStorage} from 'app/utils/UserContext';

export default function TableComponent(props: any) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [tempItem, setTempItem] = useState([]);
  const [diagnosticsData, setDiagnosticsData] = useState([
    {title: 'Grade', desc: 'Low-grade (99-100.4 °F)'},
    {title: 'Pattern', desc: 'Continuous'},

    {title: 'Duration', desc: '2 Weeks'},
    {title: 'Associated Symptoms', desc: 'Runny Nose,Cough'},
    {title: 'Measures Taken', desc: 'Paracetamol'},
    {title: 'Exposure to Extreme Heat', desc: 'No'},
  ]);

  useEffect(() => {
    // console.warn('here', global.physicalExamData.length);
    if (props.selectedIndexForaEdit === -1) {
      setTempItem(
        props.tableType === 'physicalExam'
          ? createDeepCopy(
              global.physicalExamData ? global.physicalExamData : [],
            )
          : createDeepCopy(
              global.presentComplaintData ? global.presentComplaintData : [],
            ),
      );
    }
  }, [props.selectedIndexForaEdit]);

  const onChangeDesc = (val: string, index: number) => {
    let _diagnosticsData = [...diagnosticsData];
    _diagnosticsData[index].desc = val;
    setDiagnosticsData(_diagnosticsData);
  };
  // .......................................................................................
  const onSelectItem2 = (sectionIndex: number, index: number, option: any) => {
    try {
      let data = [];
      let prevData = [];
      if (props.selectedIndexForaEdit === -1) {
        data = [...tempItem];
      } else {
        if (props.tableType === 'physicalExam') {
          prevData = [...props.currentPatient.physicalExams];
          data = [...prevData[props.selectedIndexForaEdit].Data];
        } else {
          prevData = [...props.currentPatient.presentingComplain];
          data = [...prevData[props.selectedIndexForaEdit].Data];
        }
      }
      if (data[sectionIndex].data[index].AnswerList) {
        let indexToFind = data[sectionIndex].data[index].AnswerList.findIndex(
          item => item.Name === option.Name,
        );

        // if (indexToFind !== -1) {
        //   data[sectionIndex].data[index].AnswerList.splice(indexToFind, 1);
        // } else {
        //   data[sectionIndex].data[index].AnswerList = [
        //     ...data[sectionIndex].data[index].AnswerList,
        //     {...option, AnswerOptionId: option.Id},
        //   ];
        // }
        if (indexToFind !== -1) {
          // Item already exists → remove it
          data[sectionIndex].data[index].AnswerList.splice(indexToFind, 1);
        } else {
          // Only keep one item selected per index (duration item)
          data[sectionIndex].data[index].AnswerList = [
            {...option, AnswerOptionId: option.Id},
          ];
        }
      } else {
        data[sectionIndex].data[index].AnswerList = [
          {...option, AnswerOptionId: option.Id},
        ];
      }

      if (props.selectedIndexForaEdit === -1) {
        setTempItem(data);
      } else {
        if (props.tableType === 'presentComplaint') {
          prevData[props.selectedIndexForaEdit].Data = data;
          prevData[props.selectedIndexForaEdit].isChanged = true;
          props.updateCurrentPatient({
            ...props.currentPatient,
            presentingComplain: [...prevData],
          });
        } else {
          prevData[props.selectedIndexForaEdit].Data = data;
          prevData[props.selectedIndexForaEdit].isChanged = true;
          props.updateCurrentPatient({
            ...props.currentPatient,
            physicalExams: [...prevData],
          });
        }
      }
    } catch (e) {
      console.warn('err', e);
    }
  };
  // ..............................................................
  const onSavePressed = () => {
    try {
      let data: any;
      if (props.tableType === 'presentComplaint') {
        data = props.currentPatient.presentingComplain;
      } else {
        data = props.currentPatient.physicalExams;
      }
      if (data && tempItem) {
        let _tempItem = {
          // ...tempItem,
          type: 'sectionList',
          Data: tempItem,
          EnteredBy: mmkvStorage.getString('loggedInUsername')
            ? mmkvStorage.getString('loggedInUsername')
            : 'Dr. Noureen Anjum',
          EnteredOn: moment().toISOString(),
          isChanged: true,
        };
        data.push(_tempItem);
      }
      if (props.tableType === 'presentComplaint') {
        props.updateCurrentPatient({
          ...props.currentPatient,
          presentingComplain: data,
        });
      } else {
        props.updateCurrentPatient({
          ...props.currentPatient,
          physicalExams: data,
        });
      }
      props.setShowTableComp(false);
      props.setSelectedIndexForaEdit(null);
    } catch (e) {}
  };

  // const checkIfItemExistsInList2 = (list: any[], itemToCheck: any) => {
  //   try {
  //     let exists = list.find(item => item.Name === itemToCheck.Name);
  //     if (exists) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (e) {
  //     console.warn('err', e);
  //     return false;
  //   }
  // };

  // ...............................................................
  // fever
  const checkIfItemExistsInList2 = (list: any[], itemToCheck: any) => {
    try {
      let exists = list.find(item => item.AnswerOptionId === itemToCheck.Id);
      return !!exists;
    } catch (e) {
      console.warn('err', e);
      return false;
    }
  };
  // .....................................................................
  // PresentingComplaintForm.tsx (or wherever you're rendering the FlatList)

  const groupOptionsByTimeCategory = optionList => {
    const timeCategories = ['Day', 'Weeks', 'Months'];
    const grouped = [];
    let currentGroup = null;

    optionList.forEach(option => {
      if (timeCategories.includes(option.Name)) {
        if (currentGroup) grouped.push(currentGroup);
        currentGroup = {
          QuestionName: `Duration ${option.Name}`,
          Category: option.Name,
          OptionList: [],
        };
      } else if (currentGroup) {
        currentGroup.OptionList.push(option);
      }
    });

    if (currentGroup) grouped.push(currentGroup);

    return grouped;
  };
  // ................................................................................
  const checkSectionListVisibility = () => {
    try {
      // if (props.tableType === 'physicalExam') {
      // if (
      //   props.currentPatient.physicalExams[props.selectedIndexForaEdit]
      //     .type === 'sectionList'
      // ) {
      return true;
      // }
      // } else if (
      //   props.tableType === 'presentComplaint' &&
      //   props.currentPatient.presentingComplain[props.selectedIndexForaEdit]
      //     .type === 'sectionList'
      // ) {
      return true;
      // }
      return false;
    } catch (e) {
      return false;
    }
  };

  if (!props.currentPatient) {
    return <View></View>;
  }
  if (props.tableType === 'allergy') {
    if (
      !props.currentPatient.allergies ||
      props.currentPatient.allergies?.length === 0
    ) {
      return <View></View>;
    }
  } else if (props.tableType === 'physicalExam') {
    if (!props.currentPatient.physicalExams) {
      return <View></View>;
    }
  } else {
    if (!props.currentPatient.presentingComplain) {
      return <View></View>;
    }
  }
  console.warn('here is data', props.currentPatient.patient.PatientId);
  return (
    <>
      <View style={{borderWidth: 0, borderColor: '#DBDADE', marginTop: 8}}>
        {props.selectedIndexForaEdit !== null ? (
          <>
            {props.selectedIndexForaEdit === -1 ||
            checkSectionListVisibility() ? (
              <>
                <FlatList
                  data={
                    props.selectedIndexForaEdit === -1
                      ? tempItem
                      : props.tableType === 'physicalExam'
                      ? props.currentPatient.physicalExams[
                          props.selectedIndexForaEdit
                        ].Data
                      : props.currentPatient.presentingComplain[
                          props.selectedIndexForaEdit
                        ].Data
                  }
                  renderItem={({item, index: sectionIndex}) => (
                    <>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#56B4FF',
                          marginBottom: 14,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            height: 33,
                            borderWidth: 2,
                            borderColor: '#E2E8F0',
                            marginBottom: 4,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#0067B9',
                          }}>
                          <Text
                            preset="bold"
                            style={{
                              color: 'white',
                              fontSize: 13,
                              marginLeft: 10,
                            }}>
                            {item.title}
                          </Text>
                        </View>
                        {/* For fever */}
                        {/* ......................................... */}
                        {props.selectedIndexForaEdit !== -1 && (
                          <>
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
                                  width: '32%',
                                  fontSize: 12,
                                  textAlign: 'center',
                                  color: '#475569',
                                }}>
                                Date
                              </Text>
                              <Text
                                preset="bold"
                                style={{
                                  width: '33%',
                                  fontSize: 12,
                                  textAlign: 'center',
                                  color: '#475569',
                                }}>
                                Time Taken
                              </Text>
                              <Text
                                preset="bold"
                                style={{
                                  width: '34%',
                                  fontSize: 12,
                                  textAlign: 'center',
                                  color: '#475569',
                                }}>
                                Taken By
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                borderBottomWidth: 1,
                                borderColor: '#DBDADE',
                                paddingBottom: 4,
                                backgroundColor: '#EFFBFF',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  width: '32%',
                                  fontSize: 11,
                                  textAlign: 'center',
                                  fontFamily: typography.primary.medium,
                                  color: '#4B465C',
                                }}>
                                {moment().format('DD-MM-YYYY')}
                              </Text>
                              <Text
                                style={{
                                  width: '33%',
                                  fontSize: 11,
                                  textAlign: 'center',
                                  fontFamily: typography.primary.medium,
                                  color: '#4B465C',
                                }}>
                                {moment().format('hh:MM a')}
                              </Text>
                              <Text
                                style={{
                                  width: '34%',
                                  fontSize: 11,
                                  fontFamily: typography.primary.medium,
                                  color: '#4B465C',
                                  textAlign: 'center',
                                }}>
                                Dr. Noreen Anjum
                              </Text>
                            </View>
                          </>
                        )}
                      </View>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#DBDADE',
                          marginBottom: 8,
                          borderRadius: 6,
                        }}>
                        <FlatList
                          data={item.data}
                          renderItem={({item, index}) => (
                            <>
                              {item.OptionList?.length > 0 && (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    paddingBottom: 5,
                                    paddingTop: 5,
                                    borderBottomWidth: 1,
                                    borderColor: '#DBDADE',
                                  }}>
                                  <Text
                                    preset="bold"
                                    style={{
                                      fontSize: 12,
                                      marginLeft: 10,
                                      maxWidth: widthPercentageToDP(26),
                                    }}>
                                    {item.QuestionName}:{' '}
                                  </Text>
                                  <FlatList
                                  key={2}
                                    data={item.OptionList}
                                    numColumns={2}
                                    // style={{maxWidth: widthPercentageToDP(60)}}
                                      style={{ width: '100%' }}
                                    // contentContainerStyle={{ flexDirection: 'row' }}
                                    // columnWrapperStyle={{justifyContent:'space-around'}}
                                    renderItem={({
                                      item: innerItem,
                                      index: innerInd,
                                    }) => (
                                      <View>
                                        {/* .................................................................... */}
                                        {innerItem && innerItem.Name && (
                                          <Text
                                            onPress={() =>
                                              onSelectItem2(
                                                sectionIndex,
                                                index,
                                                innerItem,
                                              )
                                            }
                                            style={{
                                              fontSize: 12,
                                              fontFamily:
                                                checkIfItemExistsInList2(
                                                  item.AnswerList,
                                                  innerItem,
                                                )
                                                  ? typography.primary.bold
                                                  : typography.primary.normal,
                                              color: 'black',
                                              marginRight: 4,
                                            }}>
                                            {innerItem.Name},
                                          </Text>
                                        )}
                                        {/* this is where our answer data is showing */}
                                        {/* ........................................................ */}
                                      </View>
                                    )}
                                  />
                                  {/* <Text style={{fontSize: 12}}>{item.desc}</Text> */}
                                </View>
                              )}
                            </>
                          )}
                        />
                      </View>
                    </>
                  )}
                />
              </>
            ) : null}
            {props.selectedIndexForaEdit === -1 && (
              <TouchableOpacity
                onPress={onSavePressed}
                style={{
                  width: '100%',
                  backgroundColor: '#48BD69',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 6.5,
                  marginBottom: 6,
                  height: 40,
                }}>
                <Text preset="bold" style={{color: 'white'}}>
                  SAVE
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#DBDADE',
                paddingTop: 6,
                borderRadius: 6,
              }}>
              <FlatList
                data={
                  props.tableType === 'allergy'
                    ? props.currentPatient.allergies
                    : props.tableType === 'physicalExam'
                    ? props.currentPatient.physicalExams
                    : props.currentPatient.presentingComplain
                }
                ListEmptyComponent={() => (
                  <Text
                    style={{alignSelf: 'center', color: 'black', fontSize: 11}}>
                    No data found
                  </Text>
                )}
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
                        width: '32%',
                        fontSize: 13,
                        textAlign: 'center',
                        color: '#4B465C',
                      }}>
                      Date
                    </Text>
                    <Text
                      preset="bold"
                      style={{
                        width: '33%',
                        fontSize: 13,
                        textAlign: 'center',
                        color: '#4B465C',
                      }}>
                      Time Taken
                    </Text>
                    <Text
                      preset="bold"
                      style={{
                        width: '34%',
                        fontSize: 13,
                        textAlign: 'center',
                        color: '#4B465C',
                      }}>
                      Taken By
                    </Text>
                  </View>
                )}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItemIndex(index);
                    }}
                    style={{
                      flexDirection: 'row',
                      // backgroundColor: 'red',
                      justifyContent: 'flex-start',
                      borderBottomWidth: 1,
                      borderBottomColor: '#DBDADE',
                      backgroundColor:
                        index === selectedItemIndex ? '#EFFBFF' : 'white',
                      borderRightWidth: index === selectedItemIndex ? 2 : 0,
                      borderLeftWidth: index === selectedItemIndex ? 2 : 0,
                      borderRightColor: '#56B4FF',
                      borderLeftColor: '#56B4FF',
                      alignItems: 'center',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        width: '33%',
                        paddingVertical: 4,
                        fontSize: 12,
                        textAlign: 'center',
                        color: '#4B465C',
                      }}>
                      {moment(item.EnteredOn).format('DD-MM-YYYY')}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        width: '33%',
                        paddingVertical: 4,
                        fontSize: 12,
                        textAlign: 'center',
                        color: '#4B465C',
                      }}>
                      {moment(item.EnteredOn).format('hh:mm a')}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        width: '34%',
                        paddingVertical: 4,
                        fontSize: 12,
                        marginRight: 12,
                        color: '#4B465C',
                      }}>
                      {props.tableType === 'allergy'
                        ? item.FirstName
                        : item.EnteredBy}
                    </Text>
                    {/* {index === selectedItemIndex && (
                      <Icon
                        icon={'eyeIcon'}
                        size={widthPercentageToDP(5)}
                        style={{marginRight: '3%'}}
                      />
                    )} */}
                  </TouchableOpacity>
                )}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 10,
              }}>
              {!props.showAllergyData && (
                <TouchableOpacity
                  style={{
                    ...styles.button,
                    backgroundColor: '#48BD69',
                  }}
                  onPress={() => {
                    try {
                      if (selectedItemIndex !== -1) {
                        if (props.tableType === 'allergy') {
                          props.onViewEditPresentComplaint(
                            props.currentPatient.allergies[selectedItemIndex],
                          );
                        } else {
                          props.onViewEditPresentComplaint(selectedItemIndex);
                        }
                      } else {
                        ToastAndroid.show(
                          'Pleas select an item first',
                          ToastAndroid.LONG,
                        );
                      }
                    } catch (e) {
                      console.warn('err', e);
                    }
                  }}>
                  <Text preset="bold" style={{color: 'white'}}>
                    Add to Note
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  ...styles.button,
                  width: props.showAllergyData ? '100%' : '48%',
                }}
                onPress={() => {
                  try {
                    if (selectedItemIndex !== -1) {
                      if (props.tableType === 'allergy') {
                        props.onViewEditPresentComplaint(
                          props.currentPatient.allergies[selectedItemIndex],
                        );
                      } else {
                        props.onViewEditPresentComplaint(selectedItemIndex);
                      }
                    } else {
                      ToastAndroid.show(
                        'Pleas select an item first',
                        ToastAndroid.LONG,
                      );
                    }
                  } catch (e) {
                    console.warn('err', e);
                  }
                }}>
                <Text preset="bold" style={{color: 'white'}}>
                  View/Edit
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '48%',
    backgroundColor: '#2196F3',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
});
