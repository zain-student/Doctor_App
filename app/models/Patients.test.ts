import { PatientModel } from "./Patient"

const data = {
  "PatientId": 98165,
  "FirstName": "Ayesha",
  "LastName": "Khazan",
  "MRNNo": "01-01-0098165",
  "DOB": "8/1/2004 12:00:00 AM",
  "CNIC": "41403-8827487-8",
  "CellPhoneNumber": "03223962479",
  "Gender": "Female",
  "SiteName": "Gharo",
  "MartialStatus": "Single",
  "SpouseName": "Khazan",
  "ZakatEligible": false,
  "Country": "Pakistan",
  "City": "Thatta",
  "Province": "Sindh",
  "Address": "Memon Mohallah",
  "EnteredOn": "2023-09-14T16:06:00.653"
}
const site = PatientModel.create(data)

// test("publish date format", () => {
//   expect(episode.datePublished.textLabel).toBe("Jan 20, 2022")
//   expect(episode.datePublished.accessibilityLabel).toBe(
//     'demoPodcastListScreen.accessibility.publishLabel {"date":"Jan 20, 2022"}',
//   )
// })

// test("duration format", () => {
//   expect(episode.duration.textLabel).toBe("42:58")
//   expect(episode.duration.accessibilityLabel).toBe(
//     'demoPodcastListScreen.accessibility.durationLabel {"hours":0,"minutes":42,"seconds":58}',
//   )
// })

