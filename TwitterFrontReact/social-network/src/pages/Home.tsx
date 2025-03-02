"use client"

import { useState } from "react"
import PostForm from "../components/PostForm"
import PostList from "../components/PostList"

const Home = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handlePostCreated = () => {
    // Incrémenter pour déclencher un rafraîchissement de la liste
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="row">
      <div className="col-lg-8 mx-auto">
        <PostForm onPostCreated={handlePostCreated} />
        <h4 className="mb-3">Fil d'actualité</h4>
        <PostList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}

export default Home

