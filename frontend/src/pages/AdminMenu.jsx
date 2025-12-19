import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = () => {
    const [menus, setMenus] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('menu');
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [newMenu, setNewMenu] = useState({ 
        name: '', price: '', category: 'Makanan', image_url: '' 
    });

    const navigate = useNavigate();
    const token = localStorage.getItem('token'); 
    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    };

    const user = JSON.parse(localStorage.getItem('user'));
    
    useEffect(() => {
        // SAYA MATIKAN SEMENTARA AGAR TIDAK MENTAL/BERKEDIP
        // if (!user || user.role !== 'owner') {
        //    alert("Akses Ditolak! Khusus Owner.");
        //    navigate('/menu');
        //    return;
        // }
        fetchMenus();
        fetchOrders();
    }, [user, navigate]);

    const fetchMenus = async () => {
        try {
            const response = await api.get('/menus');
            setMenus(response.data.data);
        } catch (error) { console.error("Gagal ambil menu:", error); }
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders', authConfig); 
            
            console.log("Data Order:", response.data); 
            setOrders(response.data.data || []);
        } catch (error) { 
            console.error("Gagal ambil order:", error);
            if (error.response && error.response.status === 401) {
                // SAYA MATIKAN SEMENTARA AGAR TIDAK MENTAL/BERKEDIP
                // localStorage.clear();
                // navigate('/');
            }
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus }, authConfig);
            fetchOrders();
        } catch (error) { 
            alert("Gagal update status order."); 
        }
    };

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

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...newMenu, price: parseInt(newMenu.price) };
        try {
            if (isEdit) {
                //Edit menu
                await api.put(`/menus/${currentId}`, payload, authConfig);
            } else {
                //Menambah menu
                await api.post('/menus', payload, authConfig);
            }
            setShowModal(false);
            fetchMenus();
        } catch (error) { 
            alert("Gagal menyimpan menu."); 
        }
    };

    return (
        <div className="adm-container">
            <header className="adm-header">
                <div className="adm-header-left">
                    <h1>Owner Dashboard</h1>
                    <div className="adm-tab-navigation">
                        <button className={`adm-tab-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Kelola Menu</button>
                        <button className={`adm-tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            Pesanan Masuk {orders.filter(o => o.status === 'Pending').length > 0 && <span className="adm-notif-badge"></span>}
                        </button>
                    </div>
                </div>
                <div className="adm-actions">
                    {activeTab === 'menu' && <button className="adm-btn-add" onClick={() => openModal()}>+ Tambah Menu</button>}
                    <button className="adm-btn-logout-top" onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</button>
                </div>
            </header>

            <main className="adm-content">
                {activeTab === 'menu' && (
                    <section className="adm-menu-management">
                        <div className="adm-menu-grid">
                            {menus.map((menu) => (
                                <div key={menu.id} className="adm-menu-card">
                                    <div className="adm-menu-img-wrapper">
                                        <img src={menu.image_url || 'https://placehold.co/300x200'} alt={menu.name} className="adm-menu-image" />
                                    </div>
                                    <div className="adm-menu-details">
                                        <span className="adm-category-badge">{menu.category}</span>
                                        <h3>{menu.name}</h3>
                                        <p className="adm-menu-price">Rp {menu.price.toLocaleString()}</p>
                                        <div className="adm-card-actions">
                                            <button className="adm-btn-edit" onClick={() => openModal(menu)}>Edit</button>
                                            <button className="adm-btn-delete" onClick={async () => {
                                                if (window.confirm("Hapus menu ini?")) {
                                                    // PERBAIKAN TYPO: api.delete (bukan detelet)
                                                    api.delete(`/menus/${menu.id}`, authConfig)
                                                        .then(() => fetchMenus())
                                                        .catch(() => alert("Gagal menghapus menu."));
                                                }
                                            }}>Hapus</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'orders' && (
                    <section className="adm-order-management">
                        <div className="adm-table-responsive">
                            <table className="adm-orders-table">
                                <thead>
                                    <tr><th>ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Aksi</th></tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? orders.map((order) => (
                                        <tr key={order.id} className="adm-order-row">
                                            <td>#{order.id}</td>
                                            <td><strong>{order.customer_name}</strong></td>
                                            <td>{order.items_summary}</td>
                                            <td>Rp {order.total_price?.toLocaleString()}</td>
                                            <td><span className={`adm-status-tag ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                            <td>
                                                <div className="adm-quick-actions">
                                                    {order.status === 'Pending' && <button className="adm-act-btn btn-cook" onClick={() => updateOrderStatus(order.id, 'Processing')}>🔥 Masak</button>}
                                                    {order.status === 'Processing' && <button className="adm-act-btn btn-ready" onClick={() => updateOrderStatus(order.id, 'Ready')}>✅ Ready</button>}
                                                    <button className="adm-act-btn btn-cancel-order" onClick={() => updateOrderStatus(order.id, 'Cancelled')}>❌</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6" className="adm-no-orders">Belum ada pesanan masuk.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {showModal && (
                <div className="adm-modal-overlay">
                    <div className="adm-modal-content">
                        <h2>{isEdit ? 'Update Menu' : 'Tambah Menu Baru'}</h2>
                        <form onSubmit={handleMenuSubmit}>
                            <div className="adm-form-group"><label>Nama</label><input type="text" required value={newMenu.name} onChange={(e) => setNewMenu({...newMenu, name: e.target.value})} /></div>
                            <div className="adm-form-group"><label>Harga (Rp)</label><input type="number" required value={newMenu.price} onChange={(e) => setNewMenu({...newMenu, price: e.target.value})} /></div>
                            <div className="adm-form-group">
                                <label>Kategori</label>
                                <select value={newMenu.category} onChange={(e) => setNewMenu({...newMenu, category: e.target.value})}>
                                    <option value="Makanan">Makanan</option><option value="Minuman">Minuman</option><option value="Snack">Snack</option>
                                </select>
                            </div>
                            <div className="adm-form-group"><label>URL Gambar</label><input type="text" value={newMenu.image_url} onChange={(e) => setNewMenu({...newMenu, image_url: e.target.value})} /></div>
                            <div className="adm-modal-actions">
                                <button type="button" className="adm-btn-cancel-modal" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="adm-btn-save">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;