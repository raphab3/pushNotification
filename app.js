// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCg6YEiauUXa9MN1F5Yng1q6ubU2Ca_0uw',
  authDomain: 'maeduca-ab166.firebaseapp.com',
  projectId: 'maeduca-ab166',
  storageBucket: 'maeduca-ab166.appspot.com',
  messagingSenderId: '563909314968',
  appId: '1:563909314968:web:658c1291620eff395c43ed',
  measurementId: 'G-LYC8F2RKMH',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
console.log("Firebase initialized - KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");

const messaging = firebase.messaging()

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope)
      messaging.useServiceWorker(registration) // Use the registered service worker
    })
    .catch((err) => {
      console.error('Service Worker registration failed:', err)
    })
}

document.getElementById('requestPermission').addEventListener('click', () => {
  console.log('Requesting permission...')
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.')
      getToken()
    } else {
      console.log('Unable to get permission to notify.')
    }
  })
})

function getToken() {
  messaging
    .getToken({
      vapidKey:
        'BIVpqS5Lbbi8Fb4MPj_wGOMLkzWc03KbXGV2a4peMl9ObctEXM3oWxwFyOy-0puZbXUjwrco-OszaEq2MaX0T_c',
    })
    .then((currentToken) => {
      if (currentToken) {
        console.log('Token:', currentToken)
        document.getElementById('tokenArea').textContent =
          `Token: ${currentToken}`
        // Send the token to your server here
      } else {
        console.log(
          'No registration token available. Request permission to generate one.',
        )
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err)
    })
}

messaging.onMessage((payload) => {
  console.log('Message received. ', payload)
  // You can handle the message here, e.g., show a notification
})
