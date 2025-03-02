"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import PostList from "../components/PostList"
import { api } from "../services/api"

interface User {
  id: string
  pseudo: string
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return

      setLoading(true)
      setError(null)

      try {
        // Note: Cette route n'est pas spécifiée dans les exigences de l'API,
        // mais nous supposons qu'elle existe ou que les informations de l'utilisateur
        // sont incluses dans les posts
        const response = await api.get(`/user/${userId}`)
        setUser(response.data)
      } catch (err) {
        console.error(err)
        // Si l'API ne fournit pas d'endpoint pour obtenir les détails de l'utilisateur,
        // nous pouvons extraire ces informations du premier post
        try {
          const postsResponse = await api.get(`/posts/user/${userId}`)
          if (postsResponse.data.length > 0) {
            setUser({
              id: userId,
              pseudo: postsResponse.data[0].pseudo,
            })
          } else {
            setError("Utilisateur non trouvé")
          }
        } catch (postsErr) {
          setError("Impossible de charger les informations de l'utilisateur")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (loading) {
    return <div className="text-center my-4">Chargement du profil...</div>
  }

  if (error || !user) {
    return <div className="alert alert-danger">{error || "Utilisateur non trouvé"}</div>
  }

  return (
    <div className="row">
      <div className="col-lg-8 mx-auto">
        <div className="card mb-4">
          <div className="card-body text-center">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "80px", height: "80px", fontSize: "2rem" }}
            >
              {user.pseudo.charAt(0).toUpperCase()}
            </div>
            <h3 className="card-title">{user.pseudo}</h3>
          </div>
        </div>

        <h4 className="mb-3">Posts de {user.pseudo}</h4>
        <PostList userId={userId} />
      </div>
    </div>
  )
}

export default UserProfile

