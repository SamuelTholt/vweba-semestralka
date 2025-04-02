import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  const [count, setCount] = useState(0)

  return (
    <HomePage />
  )
}

export default App
