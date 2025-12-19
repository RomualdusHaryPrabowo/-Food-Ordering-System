import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]);
    const [showModal, setShowModal] = useState(false); // State untuk kontrol Pop-up
    const [newMenu, setNewMenu] = useState({ name: '', price: '', category: 'Makanan', image_url: '' }); // State form
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Cek Role & Ambil Data saat halaman dibuka
    useEffect(() => {
        // Proteksi: Jika bukan owner, tendang balik ke menu biasa
        if (!user || user.role !== 'owner') {
            alert("Akses Ditolak! Halaman ini khusus Owner.");
            navigate('/menu');
            return;
        }
        fetchMenus();
    }, [user, navigate]);

    const fetchMenus = async () => {
        try {
            const response = await api.get('/menus');
            setMenus(response.data.data);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    // 2. Handle Tambah Menu (POST)
    const handleAddMenu = async (e) => {
        e.preventDefault();
        try {
            // Kirim data ke backend
            // Pastikan harga dikirim sebagai number/integer
            const payload = { ...newMenu, price: parseInt(newMenu.price) };
            
            await api.post('/menus', payload);
            
            alert("Menu berhasil ditambahkan!");
            setShowModal(false); // Tutup modal
            setNewMenu({ name: '', price: '', category: 'Makanan', image_url: '' }); // Reset form
            fetchMenus(); // Refresh daftar menu
            
        } catch (error) {
            console.error(error);
            alert("Gagal menambah menu.");
        }
    };

    // 3. Handle Hapus Menu (DELETE)
    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus menu ini?")) {
            try {
                await api.delete(`/menus/${id}`);
                alert("Menu dihapus.");
                fetchMenus(); // Refresh daftar
            } catch (error) {
                console.error(error);
                alert("Gagal menghapus menu.");
            }
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div>
                    <h1>Dashboard Menu</h1>
                    <p>Kelola menu restoran Anda di sini.</p>
                </div>
                <div style={{display:'flex', gap:'10px'}}>
                    <button className="btn-add" onClick={() => setShowModal(true)}>
                        + Tambah Menu Baru
                    </button>
                    <button className="btn-cancel" onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/');
                    }}>Logout</button>
                </div>
            </header>

            {/* List Menu Grid */}
            <div className="menu-grid">
                {menus.map((menu) => (
                    <div key={menu.id} className="menu-card">
                        <img 
                            src={menu.image_url || 'https://placehold.co/300x200?text=No+Image'} 
                            alt={menu.name} 
                            className="menu-image" 
                            onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=Error'; }}
                        />
                        <div className="menu-details">
                            <span style={{background:'#eee', padding:'2px 5px', borderRadius:'4px', fontSize:'12px'}}>{menu.category}</span>
                            <h3>{menu.name}</h3>
                            <p className="menu-price">Rp {menu.price.toLocaleString()}</p>
                            
                            {/* Tombol Hapus */}
                            <button className="btn-delete" onClick={() => handleDelete(menu.id)}>
                                Hapus Menu
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL / POP-UP FORM */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Tambah Menu Baru</h2>
                        <form onSubmit={handleAddMenu}>
                            <div className="form-group">
                                <label>Nama Makanan</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newMenu.name}
                                    onChange={(e) => setNewMenu({...newMenu, name: e.target.value})}
                                    placeholder="Contoh: Nasi Goreng Spesial"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Harga (Rp)</label>
                                <input 
                                    type="number" 
                                    required 
                                    value={newMenu.price}
                                    onChange={(e) => setNewMenu({...newMenu, price: e.target.value})}
                                    placeholder="Contoh: 25000"
                                />
                            </div>

                            <div className="form-group">
                                <label>Kategori</label>
                                <select 
                                    value={newMenu.category}
                                    onChange={(e) => setNewMenu({...newMenu, category: e.target.value})}
                                >
                                    <option value="Makanan">Makanan</option>
                                    <option value="Minuman">Minuman</option>
                                    <option value="Snack">Snack</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>URL Gambar (Opsional)</label>
                                <input 
                                    type="text" 
                                    value={newMenu.image_url}
                                    onChange={(e) => setNewMenu({...newMenu, image_url: e.target.value})}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="btn-save">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;