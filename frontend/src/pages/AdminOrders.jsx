import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    // Fungsi untuk cek orderan ke server
    const checkNewOrders = async () => {
        try {
            const response = await api.get('/orders/incoming');
            setOrders(response.data.data);
            
            // OPSI TAMBAHAN: Bisa pasang suara notifikasi disini jika orders.length bertambah
        } catch (error) {
            console.error("Gagal mengambil order:", error);
        }
    };

    // POLLING: Jalan setiap 5 detik
    useEffect(() => {
        // Panggil pertama kali
        checkNewOrders();

        // Pasang interval (Auto Refresh)
        const intervalId = setInterval(() => {
            checkNewOrders(); 
        }, 5000); // 5000ms = 5 detik

        // Bersihkan interval saat pindah halaman
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>👨‍🍳 Dapur / Order Masuk</h1>
            <p>Halaman ini akan update otomatis jika user checkout.</p>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {orders.length === 0 ? <p>Belum ada pesanan baru...</p> : null}

                {orders.map(order => (
                    <div key={order.id} style={{ border: '2px solid #ff9800', padding: '15px', borderRadius: '10px', width: '300px', background: '#fff' }}>
                        <div style={{ borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
                            <h3 style={{ margin: 0 }}>Meja/User: {order.customer}</h3>
                            <small>Jam: {order.time}</small>
                        </div>
                        
                        <ul style={{ paddingLeft: '20px' }}>
                            {order.items.map((item, idx) => (
                                <li key={idx}>
                                    <b>{item.qty}x</b> {item.menu_name}
                                </li>
                            ))}
                        </ul>
                        
                        <div style={{ marginTop: '10px', textAlign: 'right' }}>
                            <strong>Total: Rp {order.total.toLocaleString()}</strong>
                        </div>
                        
                        <button style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                            ✅ Proses / Selesai
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;