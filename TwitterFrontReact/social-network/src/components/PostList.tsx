"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { type Post, PostService } from "../services/api"

interface PostListProps {
  userId?: string
  refreshTrigger?: number
}

const PostList = ({ userId }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        let fetchedPosts: Post[]

        if (userId) {
          fetchedPosts = await PostService.getUserPosts(userId)
        } else {
          fetchedPosts = await PostService.getAllPosts()
        }

        setPosts(fetchedPosts)
      } catch (err) {
        setError("Impossible de charger les posts")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [userId])

  if (loading) {
    return <div className="text-center my-4">Chargement des posts...</div>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (posts.length === 0) {
    return <div className="text-center my-4">Aucun post à afficher</div>
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-header bg-white d-flex align-items-center">
            <Link to={`/user/${post.userId}`} className="text-decoration-none">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: "40px", height: "40px" }}
                >
                  {post.pseudo.charAt(0).toUpperCase()}
                </div>
                <span className="fw-bold text-dark">{post.pseudo}</span>
              </div>
            </Link>
            {post.createdAt && (
              <small className="text-muted ms-auto">{new Date(post.createdAt).toLocaleDateString()}</small>
            )}
          </div>
          <div className="card-body">
            <h5 className="card-title">{post.titre}</h5>
            <p className="card-text">{post.texte}</p>
            {post.url_image && (
              <img
                src={post.url_image || "/placeholder.svg"}
                alt={post.titre}
                className="img-fluid rounded mb-2"
                style={{ maxHeight: "300px", objectFit: "cover" }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PostList

