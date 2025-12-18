import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', category: 'Makanan' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMenus = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:6543/api/menus');
            const data = await response.json();
            // Pengaman agar .map tidak error jika data bukan array
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
        try {
            const res = await fetch('http://localhost:6543/api/menus', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchMenus();
                setFormData({ name: '', price: '', category: 'Makanan' });
            }
        } catch (error) {
            console.error("Gagal tambah menu:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin mau hapus menu ini, Bos?")) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(`http://localhost:6543/api/menus/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchMenus();
        } catch (error) {
            console.error("Gagal hapus menu:", error);
        }
    };

    if (loading) return <div className="loading-screen">Memuat Data Restoran...</div>;

    return (
        <div className="admin-container">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-content">
                    <h2 className="navbar-logo">Owner Dashboard</h2>
                    <div className="navbar-links">
                        <span onClick={() => navigate('/menu')}>🏠 Toko</span>
                        <span className="active">📋 Menu</span>
                        <span className="logout" onClick={() => { localStorage.clear(); navigate('/'); }}>🚪 Logout</span>
                    </div>
                </div>
            </nav>

            <div className="content-wrapper">
                {/* FORM SECTION (STATIS DI ATAS) */}
                <section className="form-section">
                    <h3>Tambah Menu Baru</h3>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="Nama Menu" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                            <input 
                                type="number" 
                                placeholder="Harga (Rp)" 
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || ''})} 
                                required 
                            />
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Makanan">Makanan</option>
                                <option value="Minuman">Minuman</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-submit-gradient">Tambah Produk</button>
                    </form>
                </section>

                {/* TABLE SECTION */}
                <section className="table-section">
                    <h3>Daftar Menu</h3>
                    <div className="table-card">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>Harga</th>
                                    <th>Kategori</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menus.length > 0 ? (
                                    menus.map((m) => (
                                        <tr key={m.id}>
                                            <td>{m.name}</td>
                                            <td>Rp {m.price?.toLocaleString()}</td>
                                            <td><span className="category-badge">{m.category}</span></td>
                                            <td>
                                                <button className="btn-edit-small">Edit</button>
                                                <button className="btn-delete-small" onClick={() => handleDelete(m.id)}>Hapus</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>Menu masih kosong, Bos.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminMenu;