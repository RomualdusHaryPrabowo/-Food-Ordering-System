import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]);
    const navigate = useNavigate();

    const fetchMenus = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6543/api/menus');
            const data = await response.json();
            setMenus(data);
        } catch (error) {
            console.error("Gagal load menu:", error);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!user || user.role !== 'owner' || !token) {
            alert("Lu bukan Owner atau belum login!");
            navigate('/');
        } else {
            fetchMenus();
    }, [navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard Pak Bos</h1>
        </div>
    );
};

export default AdminMenu;