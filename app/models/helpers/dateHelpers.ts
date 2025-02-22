import moment from 'moment';

import {
  differenceInCalendarYears,
  differenceInYears,
  intervalToDuration,
  parse,
} from 'date-fns';

export function ageCalculator(dateOfBirth: string) {
  let months = moment().diff(dateOfBirth, 'months');
  if (months > 12) {
    const year =
      (months - (months % 12)) / 12 ? (months - (months % 12)) / 12 + 'Y ' : '';
    const month = months % 12 ? (months % 12) + 'M' : '';
    return year + month;
  } else {
    return months ? months + 'M' : '';
  }
}

export function calculateFullAge(dob) {
  try {
    // console.log('hellow');
    const birthDate = parse(dob, 'dd/MM/yyyy hh:mm:s a', new Date());
    const {years, months, days} = intervalToDuration({
      start: birthDate,
      end: new Date(),
    });
    return years + 'Y';
  } catch (e) {
    return 18 + 'Y' + 10 + 'M';
  }
}
