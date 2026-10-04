importScripts(
  'https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js'
)

importScripts(
  'https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js'
)

firebase.initializeApp({
  apiKey: 'AIzaSyDxXrBH1DYrMahY_gsJtyfGbSl5YtodZDY',
  authDomain: 'intizom-ai-b13c1.firebaseapp.com',
  projectId: 'intizom-ai-b13c1',
  storageBucket: 'intizom-ai-b13c1.firebasestorage.app',
  messagingSenderId: '821620621170',
  appId: '1:821620621170:web:dfa42408fdd9deac6fe7eb',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Background message:',
    payload
  )

  const notificationTitle =
    payload.notification?.title || 'INTIZOM AI'

  const notificationOptions = {
    body:
      payload.notification?.body ||
      'INTIZOM AI sizga yangi eslatma yubordi.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  }

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})