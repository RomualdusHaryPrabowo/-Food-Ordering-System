import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // Kalau gak ada token, tendang ke login
    if (!userData || !token) {
        return <Navigate to="/" replace />;
    }

    const user = JSON.parse(userData);

    // Kalau role gak sesuai, tendang ke menu biasa
    if (roleRequired && user.role !== roleRequired) {
        return <Navigate to="/menu" replace />;
    }

    return children;
};

export default ProtectedRoute;