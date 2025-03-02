"use client"

import type React from "react"

import { useState } from "react"
import { PostService } from "../services/api"

interface PostFormProps {
  onPostCreated: () => void
}

const PostForm = ({ onPostCreated }: PostFormProps) => {
  const [titre, setTitre] = useState("")
  const [texte, setTexte] = useState("")
  const [url_image, setUrlImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titre.trim() || !texte.trim()) {
      setError("Le titre et le texte sont obligatoires")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await PostService.createPost({
        titre,
        texte,
        url_image: url_image.trim() || undefined,
      })

      // Réinitialiser le formulaire
      setTitre("")
      setTexte("")
      setUrlImage("")

      // Notifier le parent que le post a été créé
      onPostCreated()
    } catch (err) {
      setError("Une erreur est survenue lors de la création du post")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-header bg-white">
        <h5 className="mb-0">Créer un nouveau post</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Titre du post"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Qu'avez-vous en tête ?"
              rows={3}
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="url"
              className="form-control"
              placeholder="URL de l'image (optionnel)"
              value={url_image}
              onChange={(e) => setUrlImage(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? "Publication en cours..." : "Publier"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostForm

