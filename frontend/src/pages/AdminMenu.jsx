import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', category: 'Makanan' });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // 1. Ambil Data (GET)
    const fetchMenus = async () => {
        try {
            const response = await fetch('http://localhost:6543/api/menus');
            const data = await response.json();
            setMenus(data);
        } catch (error) {
            console.error("Gagal ambil data:", error);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'owner' || !token) {
            alert("Akses Ditolak!");
            navigate('/');
        } else {
            fetchMenus();
        }
    }, [navigate, token]);

    // 2. Tambah Menu (POST)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:6543/api/menus', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            setShowForm(false);
            fetchMenus(); 
        }
    };

    // 3. Hapus Menu (DELETE)
    const handleDelete = async (id) => {
        if (window.confirm("Yakin mau hapus menu ini, Bos?")) {
            await fetch(`http://localhost:6543/api/menus/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchMenus(); 
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ marginBottom: '20px' }}>Dashboard Pak Bos 👑</h1>
            
            <button 
                onClick={() => setShowForm(true)} 
                style={{ background: '#27ae60', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '30px' }}
            >
                + Tambah Menu Baru
            </button>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Nama Menu</th>
                        <th>Harga</th>
                        <th>Kategori</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {menus.map((menu) => (
                        <tr key={menu.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{menu.name}</td>
                            <td>Rp{menu.price.toLocaleString()}</td>
                            <td>{menu.category}</td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(menu.id)} 
                                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    🗑️ Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Pop-up Tambah Menu */}
            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '300px' }}>
                        <h3>Tambah Menu Baru</h3>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Nama:</label><br/>
                            <input type="text" style={{ width: '100%' }} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Harga:</label><br/>
                            <input type="number" style={{ width: '100%' }} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label>Kategori:</label><br/>
                            <select style={{ width: '100%' }} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                <option value="Makanan">Makanan</option>
                                <option value="Minuman">Minuman</option>
                            </select>
                        </div>
                        <button type="submit" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '10px', width: '100%', borderRadius: '5px', cursor: 'pointer' }}>Simpan</button>
                        <button type="button" onClick={() => setShowForm(false)} style={{ background: '#bdc3c7', border: 'none', padding: '5px', width: '100%', marginTop: '5px', borderRadius: '5px', cursor: 'pointer' }}>Batal</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;