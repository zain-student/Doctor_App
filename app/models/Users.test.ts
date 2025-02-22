import { UserModel } from "./User"

const data = {
  "UserId": 30248,
  "UserName": "Shameer",
  "UserPassword": "75cdd7a5c90231a7082a6abe7f143ed5225df0e78871a6325490885a3dfbe531",
  "FullName": "Shameer khan Jokhio",
  "RoleId": 22
}
const site = UserModel.create(data)

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

