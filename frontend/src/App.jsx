import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Saat aplikasi dibuka, langsung tampilkan halaman Login */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;