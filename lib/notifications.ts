 import { getToken } from 'firebase/messaging'
import { getFirebaseMessaging } from './firebase'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://intizom-ai-backend.onrender.com'

export async function requestNotificationPermission() {
  try {
    if (typeof window === 'undefined') {
      return null
    }

    if (!('Notification' in window)) {
      console.log(
        'Bu browser notificationni qo‘llab-quvvatlamaydi.'
      )
      return null
    }

    const permission =
      await Notification.requestPermission()

    if (permission !== 'granted') {
      console.log(
        'Notification ruxsati berilmadi.'
      )
      return null
    }

    const messaging =
      await getFirebaseMessaging()

    if (!messaging) {
      console.log(
        'Firebase Messaging ishlamaydi.'
      )
      return null
    }

    const vapidKey =
      process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

    if (!vapidKey) {
      console.error(
        'NEXT_PUBLIC_FIREBASE_VAPID_KEY topilmadi.'
      )
      return null
    }

    const registration =
      await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      )

    const token = await getToken(
      messaging,
      {
        vapidKey,
        serviceWorkerRegistration:
          registration,
      }
    )

    if (!token) {
      console.log(
        'FCM token olinmadi.'
      )
      return null
    }

    console.log(
      'FCM TOKEN:',
      token
    )

    // ==========================================
    // LOGIN TOKENNI OLISH
    // ==========================================

    const authToken =
      localStorage.getItem('intizom-token') ||
      localStorage.getItem('token')

    if (!authToken) {
      console.warn(
        'Login token topilmadi. FCM token backendga yuborilmadi.'
      )

      return token
    }

    // ==========================================
    // FCM TOKENNI BACKENDGA SAQLASH
    // ==========================================

    const response = await fetch(
      `${API_URL}/api/notifications/token`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${authToken}`,
        },

        body: JSON.stringify({
          token,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error(
        'FCM token backendga saqlanmadi:',
        data
      )

      return token
    }

    console.log(
      'FCM token MongoDB ga saqlandi:',
      data
    )

    // LocalStorage ham saqlab qo‘yamiz
    localStorage.setItem(
      'intizom-fcm-token',
      token
    )

    return token
  } catch (error) {
    console.error(
      'Notification setup error:',
      error
    )

    return null
  }
}