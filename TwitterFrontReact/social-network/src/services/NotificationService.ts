import { api } from "./api"

export const NotificationService = {
  // Vérifier si l'utilisateur est abonné
  checkSubscription: async (userId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/subscription/check/${userId}`)
      return response.data.isSubscribed
    } catch (error) {
      console.error("Erreur lors de la vérification de l'abonnement:", error)
      return false
    }
  },

  // S'abonner aux notifications
  subscribe: async (subscription: PushSubscription, userId: string): Promise<void> => {
    try {
      await api.post("/subscription/subscribe", {
        subscription,
        userId,
      })
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error)
      throw error
    }
  },
}

