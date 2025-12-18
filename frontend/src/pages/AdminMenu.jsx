import { useState, useEffect, useCallback } from 'react';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]);
    
    // Gunakan useCallback biar fungsi ini gak dibikin ulang tiap render
    const fetchMenus = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:6543/api/menus');
            const data = await response.json();
            setMenus(data);
        } catch (error) {
            console.error("Gagal ambil data:", error);
        }
    }, []);

    useEffect(() => {
        // Panggil di sini
        fetchMenus();
    }, [fetchMenus]); // Dependency array ini kuncinya!

    return (
        <div>
            <h1>Dashboard Pak Bos 👑</h1>
            {menus.length > 0 ? (
                <ul>
                    {menus.map(m => <li key={m.id}>{m.name}</li>)}
                </ul>
            ) : <p>Lagi narik data...</p>}
        </div>
    );
};

export default AdminMenu;