import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]); // Default sudah array []
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', category: 'Makanan' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMenus = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:6543/api/menus');
            const data = await response.json();
            // Pengaman: Pastikan menus dapet data array
            setMenus(Array.isArray(data) ? data : (data.menus || []));
        } catch (error) {
            console.error("Fetch Error:", error);
            setMenus([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:6543/api/menus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            setShowForm(false);
            fetchMenus();
        }
    };

    if (loading) return <div style={{padding: '20px'}}>Sabar Bos, lagi ambil data...</div>;

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <h2 className="sidebar-logo">Owner Dashboard</h2>
                <nav className="sidebar-nav">
                    <div onClick={() => navigate('/menu')}>🏠 Lihat Toko</div>
                    <div className="active">📋 Kelola Menu</div>
                    <div className="logout" onClick={() => { localStorage.clear(); navigate('/'); }}>🚪 Logout</div>
                </nav>
            </aside>

            <main className="main-content">
                <header className="main-header">
                    <h1>Daftar Menu Restoran</h1>
                    <button className="btn-add" onClick={() => setShowForm(true)}>+ Tambah Menu</button>
                </header>

                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Harga</th>
                                <th>Kategori</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Tambahkan ?. sebelum map buat double protection */}
                            {menus?.map((m) => (
                                <tr key={m.id}>
                                    <td>{m.name}</td>
                                    <td>Rp {m.price?.toLocaleString() || 0}</td>
                                    <td><span className="badge">{m.category}</span></td>
                                    <td>
                                        <button className="btn-delete">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Input Menu Baru</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Nama Menu" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                            <input type="number" placeholder="Harga" onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} required />
                            <select onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                <option value="Makanan">Makanan</option>
                                <option value="Minuman">Minuman</option>
                            </select>
                            <div className="modal-actions">
                                <button type="submit" className="btn-save">Simpan</button>
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;