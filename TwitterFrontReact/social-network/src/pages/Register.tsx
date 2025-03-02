"use client"

import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Register = () => {
  const [pseudo, setPseudo] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!pseudo.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Tous les champs sont obligatoires")
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await register(pseudo, password)
      navigate("/login")
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setError("Ce pseudo est déjà utilisé")
      } else {
        setError("Une erreur est survenue lors de l'inscription")
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="row">
      <div className="col-md-6 col-lg-4 mx-auto">
        <div className="card">
          <div className="card-body">
            <div className="text-center mb-4">
              <h2 className="card-title">Inscription</h2>
              <p className="text-muted">Créez votre compte</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="pseudo" className="form-label">
                  Pseudo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="pseudo"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mot de passe
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isLoading}>
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </button>

              <div className="text-center">
                <p>
                  Déjà un compte ? <Link to="/login">Se connecter</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

