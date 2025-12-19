import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' atau 'orders'
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [newMenu, setNewMenu] = useState({ 
        name: '', price: '', category: 'Makanan', image_url: '', is_available: true 
    });

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.role !== 'owner') {
            alert("Akses Ditolak! Khusus Owner.");
            navigate('/menu');
            return;
        }
        fetchMenus();
        fetchOrders();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await api.get('/menus');
            setMenus(response.data.data);
        } catch (error) { console.error("Gagal ambil menu:", error); }
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders'); 
            setOrders(response.data.data || []);
        } catch (error) { console.error("Gagal ambil order:", error); }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders(); 
        } catch (error) { alert("Gagal update status order."); }
    };

    const toggleAvailability = async (id, currentStatus) => {
        try {
            // Mengubah status tersedia/habis ala GoFood
            await api.put(`/menus/${id}`, { is_available: !currentStatus });
            fetchMenus();
        } catch (error) { alert("Gagal update stok."); }
    };

    const openModal = (menu = null) => {
        if (menu) {
            setIsEdit(true);
            setCurrentId(menu.id);
            setNewMenu({ ...menu });
        } else {
            setIsEdit(false);
            setNewMenu({ name: '', price: '', category: 'Makanan', image_url: '', is_available: true });
        }
        setShowModal(true);
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...newMenu, price: parseInt(newMenu.price) };
        try {
            if (isEdit) await api.put(`/menus/${currentId}`, payload);
            else await api.post('/menus', payload);
            setShowModal(false);
            fetchMenus();
        } catch (error) { alert("Gagal menyimpan menu."); }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="header-left">
                    <h1>Owner Dashboard</h1>
                    <div className="tab-navigation">
                        <button className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>📦 Kelola Menu</button>
                        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            🔔 Pesanan {orders.filter(o => o.status === 'Pending').length > 0 && <span className="notif-badge"></span>}
                        </button>
                    </div>
                </div>
                <div className="admin-actions">
                    <button className="btn-view-public" onClick={() => navigate('/menu')}>Cek Toko</button>
                    <button className="btn-logout" onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</button>
                </div>
            </header>

            <main className="admin-content">
                {activeTab === 'menu' && (
                    <section className="menu-management">
                        <div className="section-header">
                            <h2>Daftar Menu</h2>
                            <button className="btn-add" onClick={() => openModal()}>+ Tambah Menu</button>
                        </div>
                        <div className="menu-grid">
                            {menus.map((menu) => (
                                <div key={menu.id} className={`menu-card ${!menu.is_available ? 'sold-out' : ''}`}>
                                    <div className="menu-img-wrapper">
                                        <img src={menu.image_url || 'https://placehold.co/300x200'} alt={menu.name} className="menu-image" />
                                        {!menu.is_available && <div className="sold-out-tag">HABIS</div>}
                                    </div>
                                    <div className="menu-details">
                                        <div className="menu-meta">
                                            <span className="category-badge">{menu.category}</span>
                                            <label className="toggle-switch" title="Atur Stok">
                                                <input type="checkbox" checked={menu.is_available} onChange={() => toggleAvailability(menu.id, menu.is_available)} />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </div>
                                        <h3>{menu.name}</h3>
                                        <p className="menu-price">Rp {menu.price.toLocaleString()}</p>
                                        <div className="card-actions">
                                            <button className="btn-edit" onClick={() => openModal(menu)}>Edit</button>
                                            <button className="btn-delete" onClick={() => { if(window.confirm("Hapus?")) api.delete(`/menus/${menu.id}`).then(fetchMenus) }}>Hapus</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'orders' && (
                    <section className="order-management">
                        <h2>Monitor Pesanan</h2>
                        <div className="table-responsive">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Aksi Cepat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? orders.map((order) => (
                                        <tr key={order.id} className={`order-row ${order.status.toLowerCase()}`}>
                                            <td>#{order.id}</td>
                                            <td><strong>{order.customer_name}</strong></td>
                                            <td className="items-cell">{order.items_summary}</td>
                                            <td>Rp {order.total_price?.toLocaleString()}</td>
                                            <td><span className={`status-tag ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                            <td>
                                                <div className="quick-actions">
                                                    {order.status === 'Pending' && <button className="act-btn btn-cook" onClick={() => updateOrderStatus(order.id, 'Processing')}>🔥 Masak</button>}
                                                    {order.status === 'Processing' && <button className="act-btn btn-ready" onClick={() => updateOrderStatus(order.id, 'Ready')}>✅ Ready</button>}
                                                    {order.status === 'Ready' && <button className="act-btn btn-deliver" onClick={() => updateOrderStatus(order.id, 'Delivered')}>🚚 Kirim</button>}
                                                    <button className="act-btn btn-cancel-order" onClick={() => updateOrderStatus(order.id, 'Cancelled')}>❌</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" style={{textAlign:'center', padding: '40px'}}>Belum ada pesanan masuk.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{isEdit ? 'Update Menu' : 'Tambah Menu Baru'}</h2>
                        <form onSubmit={handleMenuSubmit}>
                            <div className="form-group"><label>Nama</label><input type="text" required value={newMenu.name} onChange={(e) => setNewMenu({...newMenu, name: e.target.value})} /></div>
                            <div className="form-group"><label>Harga (Rp)</label><input type="number" required min="0" value={newMenu.price} onChange={(e) => setNewMenu({...newMenu, price: e.target.value})} placeholder="Contoh: 25000" /></div>
                            <div className="form-group">
                                <label>Kategori</label>
                                <select value={newMenu.category} onChange={(e) => setNewMenu({...newMenu, category: e.target.value})}>
                                    <option value="Makanan">Makanan</option><option value="Minuman">Minuman</option><option value="Snack">Snack</option>
                                </select>
                            </div>
                            <div className="form-group"><label>URL Gambar</label><input type="text" value={newMenu.image_url} onChange={(e) => setNewMenu({...newMenu, image_url: e.target.value})} /></div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="btn-save">Simpan Perubahan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;
