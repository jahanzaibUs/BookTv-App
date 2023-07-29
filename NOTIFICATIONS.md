# Push Notifications with expo-notifications

The `expo-notifications` provides an API to fetch push notification tokens and to present, schedule, receive and respond to notifications.

- [Expo Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/#listening-to-notification-events)
- [Expo Testing Tool](https://expo.dev/notifications)

## Listening to Events

> ❌ Listeners WILL NOT WORK if remote debugging is on.

### NotificationResponse - User Interaction

```json
{
  "actionIdentifier": "expo.modules.notifications.actions.DEFAULT",
  "notification": {
    "date": 1657771924.1332746,
    "request": {
      "content": {
        "summaryArgumentCount": 0,
        "targetContentIdentifier": null,
        "threadIdentifier": "",
        "attachments": [],
        "categoryIdentifier": "",
        "summaryArgument": null,
        "data": { "url": "http://www.booktvhk.com" },
        "title": "Bentornato!",
        "subtitle": null,
        "badge": null,
        "launchImageName": "",
        "sound": null,
        "body": "Welcome to BookTV"
      },
      "identifier": "578D1CF3-6BC2-460A-8420-EA2EEB133CF0",
      "trigger": {
        "payload": {
          "body": { "url": "http://www.booktvhk.com" },
          "aps": {
            "thread-id": "",
            "category": "",
            "alert": {
              "body": "Welcome to BookTV",
              "launch-image": "",
              "title": "Bentornato!",
              "subtitle": ""
            }
          },
          "scopeKey": "@gianthousedev/booktv",
          "projectId": "67980e04-e0b5-48e5-bd30-8f9d25dad643",
          "experienceId": "@gianthousedev/booktv"
        },
        "type": "push",
        "class": "UNPushNotificationTrigger"
      }
    }
  }
}
```

### Notification Received (Background)

```json
{
  "UIApplicationLaunchOptionsRemoteNotificationKey": {
    "aps": {
      "alert": [{}],
      "category": "",
      "sound": "default",
      "thread-id": ""
    },
    "body": { "route": "event" },
    "experienceId": "@gianthousedev/booktv",
    "projectId": "67980e04-e0b5-48e5-bd30-8f9d25dad643",
    "scopeKey": "@gianthousedev/booktv"
  }
}
```

### Notification Received (Foreground)

```json
{
  "date": 1657771924.1332746,
  "request": {
    "trigger": {
      "class": "UNPushNotificationTrigger",
      "type": "push",
      "payload": {
        "experienceId": "@gianthousedev/booktv",
        "projectId": "67980e04-e0b5-48e5-bd30-8f9d25dad643",
        "scopeKey": "@gianthousedev/booktv",
        "aps": {
          "alert": {
            "subtitle": "",
            "title": "Bentornato!",
            "launch-image": "",
            "body": "Welcome to BookTV"
          },
          "category": "",
          "thread-id": ""
        },
        "body": { "url": "http://www.booktvhk.com" }
      }
    },
    "identifier": "578D1CF3-6BC2-460A-8420-EA2EEB133CF0",
    "content": {
      "body": "Welcome to BookTV",
      "sound": null,
      "launchImageName": "",
      "badge": null,
      "subtitle": null,
      "title": "Bentornato!",
      "data": { "url": "http://www.booktvhk.com" },
      "summaryArgument": null,
      "categoryIdentifier": "",
      "attachments": [],
      "threadIdentifier": "",
      "targetContentIdentifier": null,
      "summaryArgumentCount": 0
    }
  }
}
```

## Testing with Command Line

```sh
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '{
  "ids": [
    "29172b30-73e5-4904-86b1-15aaeedf7457"
  ]
}'

curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "ExponentPushToken[*********]",
  "title":"hello",
  "body": "world"
}'
```
