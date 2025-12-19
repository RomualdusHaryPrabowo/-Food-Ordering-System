import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false); 
    const [currentId, setCurrentId] = useState(null); 
    const [newMenu, setNewMenu] = useState({ name: '', price: '', category: 'Makanan', image_url: '' });
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.role !== 'owner') {
            alert("Akses Ditolak! Halaman ini khusus Owner.");
            navigate('/menu');
            return;
        }
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await api.get('/menus');
            setMenus(response.data.data);
        } catch (error) {
            console.error("Error fetching menus:", error);
            alert("Gagal mengambil data menu.");
        }
    };

    // Fungsi buka modal (bisa buat tambah atau edit)
    const openModal = (menu = null) => {
        if (menu) {
            setIsEdit(true);
            setCurrentId(menu.id);
            setNewMenu({ name: menu.name, price: menu.price, category: menu.category, image_url: menu.image_url });
        } else {
            setIsEdit(false);
            setNewMenu({ name: '', price: '', category: 'Makanan', image_url: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...newMenu, price: parseInt(newMenu.price) };
        
        try {
            if (isEdit) {
                await api.put(`/menus/${currentId}`, payload);
                alert("Menu berhasil diupdate!");
            } else {
                await api.post('/menus', payload);
                alert("Menu berhasil ditambahkan!");
            }
            setShowModal(false);
            fetchMenus();
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus menu ini?")) {
            try {
                await api.delete(`/menus/${id}`);
                alert("Menu dihapus.");
                fetchMenus();
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
                    <p>Logged in as: <strong>{user?.name} (Owner)</strong></p>
                </div>
                <div className="admin-actions">
                    <button className="btn-view-public" onClick={() => navigate('/menu')}>
                        Lihat Menu (User)
                    </button>
                    <button className="btn-add" onClick={() => openModal()}>
                        + Tambah Menu
                    </button>
                    <button className="btn-logout" onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        navigate('/');
                    }}>Logout</button>
                </div>
            </header>

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
                            <span className="category-badge">{menu.category}</span>
                            <h3>{menu.name}</h3>
                            <p className="menu-price">Rp {menu.price.toLocaleString()}</p>
                            
                            <div className="card-actions">
                                <button className="btn-edit" onClick={() => openModal(menu)}>Edit</button>
                                <button className="btn-delete" onClick={() => handleDelete(menu.id)}>Hapus</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEdit ? 'Update Menu' : 'Tambah Menu Baru'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nama Makanan</label>
                                <input 
                                    type="text" required value={newMenu.name}
                                    onChange={(e) => setNewMenu({...newMenu, name: e.target.value})}
                                    placeholder="Contoh: Nasi Goreng Spesial"
                                />
                            </div>
                            <div className="form-group">
                                <label>Harga (Rp)</label>
                                <input 
                                    type="number" required value={newMenu.price}
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
                                <label>URL Gambar</label>
                                <input 
                                    type="text" value={newMenu.image_url}
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
