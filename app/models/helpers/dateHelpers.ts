// import moment from 'moment';

// import {
//   differenceInCalendarYears,
//   differenceInYears,
//   intervalToDuration,
//   parse,
// } from 'date-fns';

// export function ageCalculator(dateOfBirth: string) {
//   let months = moment().diff(dateOfBirth, 'months');
//   if (months > 12) {
//     const year =
//       (months - (months % 12)) / 12 ? (months - (months % 12)) / 12 + 'Y ' : '';
//     const month = months % 12 ? (months % 12) + 'M' : '';
//     return year + month;
//   } else {
//     return months ? months + 'M' : '';
//   }
// }

// export function calculateFullAge(dob) {
//   try {
//     // console.log('hellow');
//     const birthDate = parse(dob, 'dd/MM/yyyy hh:mm:s a', new Date());
//     const {years, months, days} = intervalToDuration({
//       start: birthDate,
//       end: new Date(),
//     });
//     return years + 'Y';
//   } catch (e) {
//     return 18 + 'Y' + 10 + 'M';
//   }
// }
import moment from 'moment';

import {
  differenceInCalendarYears,
  differenceInYears,
   isValid,
  intervalToDuration,
  parse,
} from 'date-fns';

export function ageCalculator(dateOfBirth) {
  const dob = moment(dateOfBirth);
  if (!dob.isValid()) return 'N/A';

  const months = moment().diff(dob, 'months');

  if (months >= 12) {
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return `${years ? years + 'Y ' : ''}${remMonths ? remMonths + 'M' : ''}`;
  } else {
    return months ? months + 'M' : '0M';
  }
}

export function calculateFullAge(dob) {
  try {
    let birthDate;

    if (typeof dob === 'string') {
      // First, try your original format
      birthDate = parse(dob, 'dd/MM/yyyy hh:mm:ss a', new Date());

      // If invalid, try parsing as ISO
      if (!isValid(birthDate)) {
        birthDate = new Date(dob);
      }
    } else {
      birthDate = dob;
    }

    if (!isValid(birthDate)) throw new Error('Invalid DOB');

    const { years, months } = intervalToDuration({
      start: birthDate,
      end: new Date(),
    });

    return `${years}Y${months}M`;
  } catch (e) {
    return 'N/A';
  }
}
