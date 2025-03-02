"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { NotificationService } from "../services/NotificationService"

const NotificationSubscriber = () => {
  const { user } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkNotificationStatus = async () => {
      if (!user) return

      try {
        // Vérifie si les notifications sont supportées
        if ("Notification" in window && "serviceWorker" in navigator) {
          setIsSupported(true)

          // Vérifie l'état de l'abonnement sur le serveur
          const subscribed = await NotificationService.checkSubscription(user.id)
          setIsSubscribed(subscribed)
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkNotificationStatus()
  }, [user])

  const subscribeToNotifications = async () => {
    if (!user) return

    try {
      setIsLoading(true)

      // Demande la permission pour les notifications
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        throw new Error("Permission refusée")
      }

      // Récupère l'enregistrement du service worker
      const registration = await navigator.serviceWorker.ready

      // S'abonne au service de push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // Normalement, vous devriez récupérer la clé VAPID depuis votre serveur
        applicationServerKey: "BB2nCOXK_TU4O4KeNXf-diD7JfYO16jwRsE41YSMqP3oRfaLaEtmGPMvmAeUAuGz_tiEy-8vGktbQGXwfzdDGbw",
      })

      // Envoie l'abonnement au serveur
      await NotificationService.subscribe(subscription, user.id)

      setIsSubscribed(true)
      alert("Vous êtes maintenant abonné aux notifications!")
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error)
      alert("Erreur lors de l'abonnement aux notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribeFromNotifications = async () => {
    if (!user) return

    try {
      setIsLoading(true)

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        // Ici vous pourriez ajouter une route pour désabonner côté serveur si nécessaire
        setIsSubscribed(false)
        alert("Désabonnement réussi")
      }
    } catch (error) {
      console.error("Erreur lors du désabonnement:", error)
      alert("Erreur lors du désabonnement")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported || !user) {
    return null
  }

  if (isLoading) {
    return <div className="spinner-border spinner-border-sm" role="status" />
  }

  return (
    <button
      className={`btn ${isSubscribed ? "btn-danger" : "btn-primary"} btn-sm`}
      onClick={isSubscribed ? unsubscribeFromNotifications : subscribeToNotifications}
      disabled={isLoading}
    >
      {isSubscribed ? (
        <>
          <i className="bi bi-bell-slash me-1"></i>
          Désactiver les notifications
        </>
      ) : (
        <>
          <i className="bi bi-bell me-1"></i>
          Activer les notifications
        </>
      )}
    </button>
  )
}

export default NotificationSubscriber

