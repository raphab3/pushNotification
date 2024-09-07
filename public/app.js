// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCg6YEiauUXa9MN1F5Yng1q6ubU2Ca_0uw",
  authDomain: "maeduca-ab166.firebaseapp.com",
  projectId: "maeduca-ab166",
  storageBucket: "maeduca-ab166.appspot.com",
  messagingSenderId: "563909314968",
  appId: "1:563909314968:web:658c1291620eff395c43ed",
  measurementId: "G-LYC8F2RKMH",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let messaging;
try {
  messaging = firebase.messaging();
  console.log("Firebase Messaging initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Messaging:", error);
}

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" }
      );
      console.log("Service Worker registered with scope:", registration.scope);

      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }

      return registration;
    } catch (err) {
      console.error("Service Worker registration failed:", err);
    }
  } else {
    console.log("Service workers are not supported in this browser");
  }
}

async function requestPermissionAndGetToken() {
  console.log("Checking permission...");
  let permission = Notification.permission;

  if (permission !== "granted") {
    console.log("Requesting permission...");
    try {
      permission = await Notification.requestPermission();
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  }

  console.log("Permission:", permission);
  if (permission === "granted") {
    console.log("Notification permission granted.");
    await getToken();
  } else {
    console.log("Unable to get permission to notify.");
    localStorage.setItem("fcmPermission", "denied");
  }
}

async function getToken() {
  if (!messaging) {
    console.error("Firebase Messaging is not initialized");
    return;
  }

  try {
    const currentToken = await messaging.getToken({
      vapidKey:
        "BIVpqS5Lbbi8Fb4MPj_wGOMLkzWc03KbXGV2a4peMl9ObctEXM3oWxwFyOy-0puZbXUjwrco-OszaEq2MaX0T_c",
    });
    if (currentToken) {
      console.log("Token:", currentToken);
      document.getElementById(
        "tokenArea"
      ).textContent = `Token: ${currentToken}`;
      localStorage.setItem("fcmToken", currentToken);
      localStorage.setItem("fcmPermission", "granted");
      // Send the token to your server here
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
      localStorage.removeItem("fcmToken");
    }
  } catch (err) {
    console.error("An error occurred while retrieving token:", err);
    localStorage.removeItem("fcmToken");
  }
}

// Setup message listener
if (messaging) {
  messaging.onMessage((payload) => {
    console.log("Foreground message received:", payload);
    // Handle the message here (e.g., show a notification)
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/firebase-logo.png",
    };
    new Notification(notificationTitle, notificationOptions);
  });
}

// Initialize everything when the page loads
window.addEventListener("load", async () => {
  console.log("Page loaded, initializing FCM...");
  await registerServiceWorker();

  const storedPermission = localStorage.getItem("fcmPermission");
  const storedToken = localStorage.getItem("fcmToken");

  if (storedPermission === "granted" && storedToken) {
    console.log("Permission already granted and token exists");
    document.getElementById("tokenArea").textContent = `Token: ${storedToken}`;
  } else {
    await requestPermissionAndGetToken();
  }
});

console.log("Script loaded and initialized");
