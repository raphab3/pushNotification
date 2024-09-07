importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCg6YEiauUXa9MN1F5Yng1q6ubU2Ca_0uw",
  authDomain: "maeduca-ab166.firebaseapp.com",
  projectId: "maeduca-ab166",
  storageBucket: "maeduca-ab166.appspot.com",
  messagingSenderId: "563909314968",
  appId: "1:563909314968:web:658c1291620eff395c43ed",
  measurementId: "G-LYC8F2RKMH",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.jpg",
    data: {
      click_action: payload.notification.click_action,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  const clickAction = event.notification.data.click_action;
  event.notification.close();

  if (clickAction) {
    event.waitUntil(clients.openWindow(clickAction));
  }
});
