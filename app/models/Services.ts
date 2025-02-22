import { ServiceModel } from "./Service"

const data = {
  "ServiceId": 1,
  "ServiceName": "Gharo"
}
const site = ServiceModel.create(data)

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

