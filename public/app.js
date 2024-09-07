// Firebase configuration
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

const messaging = firebase.messaging();
const db = firebase.firestore();

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" }
      );
      console.log("Service Worker registered with scope:", registration.scope);
      return registration;
    } catch (err) {
      console.error("Service Worker registration failed:", err);
    }
  } else {
    console.log("Service workers are not supported in this browser");
  }
}

async function requestPermissionAndGetToken() {
  console.log("Requesting permission...");
  try {
    const permission = await Notification.requestPermission();
    console.log("Permission:", permission);
    if (permission === "granted") {
      console.log("Notification permission granted.");
      await getToken();
    } else {
      console.log("Unable to get permission to notify.");
    }
  } catch (error) {
    console.error("Error requesting permission:", error);
  }
}

async function getToken() {
  try {
    const currentToken = await messaging.getToken({
      vapidKey:
        "BIVpqS5Lbbi8Fb4MPj_wGOMLkzWc03KbXGV2a4peMl9ObctEXM3oWxwFyOy-0puZbXUjwrco-OszaEq2MaX0T_c",
    });
    if (currentToken) {
      console.log("Token:", currentToken);
      await sendTokenToFirestore(currentToken);
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (err) {
    console.error("An error occurred while retrieving token:", err);
  }
}

async function sendTokenToFirestore(token) {
  try {
    const user = firebase.auth().currentUser;
    if (user) {
      await db.collection("users").doc(user.uid).set(
        {
          fcm_token: token,
          updated_at: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      console.log("Token sent to Firestore successfully");
    } else {
      console.log("No user signed in, token not sent to Firestore");
    }
  } catch (error) {
    console.error("Error sending token to Firestore:", error);
  }
}

// Setup message listener for foreground messages
messaging.onMessage((payload) => {
  console.log("Foreground message received:", payload);
  showToastNotification(
    payload.notification.title,
    payload.notification.body,
    payload.notification.click_action
  );
});

function showToastNotification(title, body, clickAction) {
  Toastify({
    text: `${title}\n${body}`,
    duration: 5000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    onClick: function () {
      if (clickAction) {
        window.open(clickAction, "_blank");
      }
    },
  }).showToast();
}

// Initialize everything when the page loads
window.addEventListener("load", async () => {
  console.log("Page loaded, initializing FCM...");
  await registerServiceWorker();
  document
    .getElementById("requestPermission")
    .addEventListener("click", requestPermissionAndGetToken);
});

console.log("Script loaded and initialized");
