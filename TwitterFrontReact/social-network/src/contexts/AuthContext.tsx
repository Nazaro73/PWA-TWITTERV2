"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "../services/api"

interface User {
  id: string
  pseudo: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (pseudo: string, password: string) => Promise<void>
  logout: () => void
  register: (pseudo: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(JSON.parse(userData))
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [])

  const login = async (pseudo: string, password: string) => {
    try {
      const response = await api.post("/user/login", { pseudo, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (pseudo: string, password: string) => {
    try {
      await api.post("/user", { pseudo, password })
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
    setIsAuthenticated(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>{children}</AuthContext.Provider>
  )
}

