importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js"
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

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle =
    payload.notification.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification.body || "Background Message body.",
    icon: "/firebase-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

console.log("Firebase Messaging SW Loaded");
