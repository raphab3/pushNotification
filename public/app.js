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

function waitForServiceWorkerActivation(reg) {
  return new Promise((resolve, reject) => {
    if (reg.active) {
      resolve(reg);
    } else if (reg.installing) {
      reg.installing.addEventListener("statechange", (e) => {
        if (e.target.state === "activated") {
          resolve(reg);
        } else if (e.target.state === "redundant") {
          reject(new Error("Service worker became redundant"));
        }
      });
    } else {
      reject(new Error("Service worker not installing or active"));
    }
  });
}

async function setupServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await registerServiceWorker();
      await waitForServiceWorkerActivation(reg);
      messaging.useServiceWorker(reg);
      console.log("Service Worker is active and ready");
    } catch (err) {
      console.error("Error setting up service worker:", err);
    }
  }
}

async function requestPermissionAndGetToken() {
  console.log("Requesting permission...");
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");
    await getToken();
  } else {
    console.log("Unable to get permission to notify.");
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
      document.getElementById(
        "tokenArea"
      ).textContent = `Token: ${currentToken}`;
      // Send the token to your server here
      window.localStorage.setItem("token", currentToken);
      console.log("Token stored in localStorage");
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
}

messaging.onMessage((payload) => {
  console.log("Message received. ", payload);
  // You can handle the message here, e.g., show a notification
});

// Setup everything when the page loads
window.addEventListener("load", async () => {
  await setupServiceWorker();
  document
    .getElementById("requestPermission")
    .addEventListener("click", requestPermissionAndGetToken);
});
