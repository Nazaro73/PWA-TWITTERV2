import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import NotificationSubscriber from "./NotificationSubscriber"

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-twitter me-2"></i>
          MicroBlog
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Accueil
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to={`/user/${user.id}`}>
                  Mon profil
                </Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            {user && (
              <>
                <NotificationSubscriber />
                <span className="text-white">Bonjour, {user.pseudo}</span>
                <button className="btn btn-outline-light" onClick={logout}>
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

