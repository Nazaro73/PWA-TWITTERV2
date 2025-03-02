import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:5000",
})

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export interface Post {
  id: string
  titre: string
  url_image?: string
  texte: string
  userId: string
  pseudo: string
  createdAt?: string
}

export const PostService = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get("/posts")
    return response.data
  },

  createPost: async (postData: { titre: string; url_image?: string; texte: string }): Promise<Post> => {
    const token = localStorage.getItem("token")
    const response = await api.post("/posts", postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  getUserPosts: async (userId: string): Promise<Post[]> => {
    const response = await api.get(`/posts/user/${userId}`)
    return response.data
  },
}