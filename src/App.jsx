import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './web/pages/HomePage'
import AboutUsPage from './web/pages/AboutUsPage'
import ContactPage from './web/pages/ContactPage';
import LoginForm from './web/components/LoginForm';
import RegisterForm from './web/components/RegisterForm';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import MenuPage from './web/pages/MenuPage';
import ReviewPage from './web/pages/ReviewPage';
import PhotoPage from './web/pages/PhotoGalleryPage';
import ProtectedRoute from './web/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<PhotoPage />} />
        <Route path='/reviews'
         element={ <ProtectedRoute> <ReviewPage/> </ProtectedRoute>}>

        </Route>
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  )
}

export default App
