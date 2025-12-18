import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Register from './pages/Register';  
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;