import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            fetchOrders(JSON.parse(savedUser).id);
        } else {
            alert('Silakan login terlebih dahulu!');
            navigate('/');
        }
    }, [navigate]);

    const fetchOrders = async (userId) => {
        try {
            setLoading(true);
            const response = await api.get(`/orders/user/${userId}`);
            if (response.data.status === 'success') {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Gagal memuat riwayat pesanan');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: '#ffa726', text: 'Menunggu' },
            processing: { color: '#42a5f5', text: 'Diproses' },
            ready: { color: '#66bb6a', text: 'Siap' },
            delivered: { color: '#26a69a', text: 'Selesai' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span 
                className="status-badge" 
                style={{ backgroundColor: config.color }}
            >
                {config.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleBackToMenu = () => {
        navigate('/menu');
    };

    return (
        <div className="order-history-container">
            <div className="history-header">
                <button onClick={handleBackToMenu} className="btn-back">
                    <i className="fas fa-arrow-left"></i> Kembali ke Menu
                </button>
                <h1>Riwayat Pesanan</h1>
                <div className="user-info">
                    <span>Halo, <b>{user ? user.name : 'Guest'}</b></span>
                </div>
            </div>

            {loading ? (
                <div className="loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Memuat riwayat pesanan...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="empty-history">
                    <i className="fas fa-receipt"></i>
                    <h2>Belum Ada Pesanan</h2>
                    <p>Anda belum pernah melakukan pemesanan</p>
                    <button onClick={handleBackToMenu} className="btn-shop">
                        Mulai Belanja
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <span className="order-id">Order #{order.id}</span>
                                    <span className="order-date">
                                        {formatDate(order.order_date)}
                                    </span>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>
                            
                            <div className="order-items">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-quantity">x{item.quantity}</span>
                                        <span className="item-price">
                                            Rp {(item.price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    <span>Total:</span>
                                    <span className="total-price">
                                        Rp {order.total_price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;