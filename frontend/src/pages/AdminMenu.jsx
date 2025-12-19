import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]);
    const [formData, setFormData] = useState({ 
        name: '', 
        price: '', 
        category: 'Makanan',
        description: '', //
        image: null      //
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMenus = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:6543/api/menus');
            const data = await response.json();
            // Pengaman: Pastikan data itu array sebelum di-set
            setMenus(Array.isArray(data) ? data : (data.menus || []));
        } catch (error) {
            console.error("Gagal load data:", error);
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
        
        // Gunakan FormData karena ada upload file
        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('price', formData.price);
        dataToSend.append('category', formData.category);
        dataToSend.append('description', formData.description);
        if (formData.image) dataToSend.append('image', formData.image);

        try {
            const res = await fetch('http://localhost:6543/api/menus', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}` 
                    // Content-Type jangan diisi manual kalau pake FormData!
                },
                body: dataToSend
            });
            if (res.ok) {
                fetchMenus();
                // Reset form setelah sukses
                setFormData({ name: '', price: '', category: 'Makanan', description: '', image: null });
                e.target.reset(); // Clear input file manual
            }
        } catch (error) {
            console.error("Gagal tambah produk:", error);
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
            console.error("Gagal hapus:", error);
        }
    };

    if (loading) return <div className="loading-screen">Memuat Data Restoran...</div>;

    return (
        <div className="admin-container">
            {/* NAVBAR SECTION */}
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
                {/* FORM SECTION STATIS */}
                <section className="form-section">
                    <h3>Tambah Produk Baru</h3>
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="input-grid">
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
                                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                                required 
                            />
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Makanan">Makanan</option>
                                <option value="Minuman">Minuman</option>
                            </select>
                            
                            {/* Input File Gambar */}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setFormData({...formData, image: e.target.files[0]})} 
                            />

                            {/* Textarea Deskripsi */}
                            <textarea 
                                className="full-width" 
                                placeholder="Tulis deskripsi makanan di sini..." 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="btn-submit-gradient">Simpan Produk</button>
                    </form>
                </section>

                {/* TABLE SECTION */}
                <section className="table-section">
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
                                            <td><strong>{m.name}</strong></td>
                                            <td>Rp {m.price?.toLocaleString()}</td>
                                            <td><span className="category-badge">{m.category}</span></td>
                                            <td>
                                                <button className="btn-delete-small" onClick={() => handleDelete(m.id)}>Hapus</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>Menu masih kosong, G.</td></tr>
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