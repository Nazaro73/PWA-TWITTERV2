import { precacheAndRoute } from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import { NetworkFirst } from "workbox-strategies"
import { CacheableResponsePlugin } from "workbox-cacheable-response"
import { ExpirationPlugin } from "workbox-expiration"
import { openDB } from "idb"

const API_ROOT = "http://localhost:5000"
const API_CACHE = "microblog-api-cache"
const POSTS_CACHE = "microblog-posts-cache"

// Pré-charger les fichiers essentiels
precacheAndRoute(self.__WB_MANIFEST)

// Cache pour les posts
registerRoute(
  ({ url }) => url.pathname.startsWith("/posts"),
  new NetworkFirst({
    cacheName: POSTS_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50, // Nombre maximum d'entrées dans le cache
        maxAgeSeconds: 5 * 60, // Cache de 5 minutes
      }),
    ],
  }),
)

// Cache général pour l'API
registerRoute(
  ({ url }) => url.origin === API_ROOT,
  new NetworkFirst({
    cacheName: API_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
)

// Gestion de la base de données IndexedDB pour le stockage hors ligne
const DB_NAME = "microblog-db"
const STORE_NAME = "posts"

const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" })
      }
    },
  })
  return db
}

// Écouter les requêtes de synchronisation en arrière-plan
self.addEventListener("sync", async (event) => {
  if (event.tag === "sync-posts") {
    const db = await initDB()
    const pendingPosts = await db.getAll(STORE_NAME)

    for (const post of pendingPosts) {
      try {
        const response = await fetch(`${API_ROOT}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${post.token}`,
          },
          body: JSON.stringify(post.data),
        })

        if (response.ok) {
          await db.delete(STORE_NAME, post.id)
        }
      } catch (error) {
        console.error("Erreur lors de la synchronisation:", error)
      }
    }
  }
})

self.addEventListener("push", (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    console.log("📨 Notification reçue:", data)

    // Configuration des options de notification
    const options = {
      body: data.texte || "Nouveau contenu sur MicroBlog",
      icon: "/microblog-192x192.png",
      badge: "/notification-badge.png",
      data: {
        url: data.url || "/",
        userId: data.userId,
        postId: data.postId,
      },
      actions: [
        {
          action: "open",
          title: "Voir",
        },
        {
          action: "close",
          title: "Fermer",
        },
      ],
      vibrate: [100, 50, 100],
      tag: "new-post", // Pour regrouper les notifications similaires
      renotify: true,
    }

    // Titre personnalisé pour le nouveau post
    const title = data.titre || "Nouveau post"

    self.registration.showNotification(title, options)
  } catch (error) {
    console.error("❌ Erreur lors du traitement de la notification:", error)
  }
})

// Gestion du clic sur la notification
self.addEventListener("notificationclick", (event) => {
  console.log("🔔 Notification cliquée:", event.notification.data)
  event.notification.close()

  // Gestion des actions spécifiques
  let urlToOpen = "/"

  if (event.action === "open" && event.notification.data) {
    const { userId, postId } = event.notification.data
    if (postId) {
      urlToOpen = `/post/${postId}`
    } else if (userId) {
      urlToOpen = `/user/${userId}`
    }
  }

  // Gestion de l'ouverture de l'URL
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Vérifie si un onglet est déjà ouvert sur cette URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus()
          }
        }
        // Si aucun onglet n'est trouvé, en ouvre un nouveau
        return clients.openWindow(urlToOpen)
      }),
  )
})

// Cache pour les routes API
registerRoute(
  ({ url }) => url.pathname.startsWith("/subscription"),
  new NetworkFirst({
    cacheName: "subscription-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
)

