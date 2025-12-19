import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedUser = localStorage.getItem('user');
        
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            alert('Silakan login terlebih dahulu!');
            navigate('/');
        }
    }, [navigate]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const increaseQuantity = (menuId) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === menuId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const decreaseQuantity = (menuId) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === menuId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = (menuId) => {
        const updatedCart = cartItems.filter(item => item.id !== menuId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }

        if (!paymentMethod) {
            alert('Pilih metode pembayaran terlebih dahulu!');
            return;
        }

        setShowPopup(true);
    };

    // Fungsi Pembayaran Terintegrasi API Backend
    const handlePayment = async () => {
        const orderData = {
            user_id: user ? user.id : 1,
            total_price: calculateTotal(),
            items: cartItems.map(item => ({
                menu_id: item.id,
                quantity: item.quantity
            }))
        };

        try {
            // Mengirim data ke POST http://localhost:6543/api/orders
            await api.post('/orders', orderData);
            
            setPaymentSuccess(true);
            setShowPopup(false);
        } catch (error) {
            console.error("Gagal mengirim pesanan:", error);
            alert("Terjadi kesalahan saat memproses pesanan ke server.");
        }
    };

    const closeSuccessPopup = () => {
        setPaymentSuccess(false);
        localStorage.removeItem('cart');
        setCartItems([]);
        navigate('/menu');
    };

    const handleBackToMenu = () => {
        navigate('/menu');
    };

    return (
        <div className="cart-container">
            <div className="cart-header">
                <button onClick={handleBackToMenu} className="btn-back">
                    <i className="fas fa-arrow-left"></i> Kembali ke Menu
                </button>
                <h1>Keranjang Belanja</h1>
                <div className="user-info">
                    <span>Halo, <b>{user ? user.name : 'Guest'}</b></span>
                </div>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <i className="fas fa-shopping-cart"></i>
                    <h2>Keranjang Kosong</h2>
                    <p>Belum ada menu yang dipilih</p>
                    <button onClick={handleBackToMenu} className="btn-shop">
                        Mulai Belanja
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img 
                                    src={item.image_url || 'https://placehold.co/100'}
                                    alt={item.name}
                                    onError={(e) => e.target.src = 'https://placehold.co/100'}
                                />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p className="item-category">{item.category}</p>
                                    <p className="item-price">Rp {item.price.toLocaleString()}</p>
                                </div>
                                <div className="item-quantity">
                                    <button onClick={() => decreaseQuantity(item.id)} className="btn-qty">-</button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button onClick={() => increaseQuantity(item.id)} className="btn-qty">+</button>
                                </div>
                                <div className="item-subtotal">
                                    <p>Rp {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="btn-remove" title="Hapus item">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="summary-row">
                            <span>Jumlah Item:</span>
                            <span><b>{cartItems.length}</b> item</span>
                        </div>
                        <div className="summary-row">
                            <span>Total Quantity:</span>
                            <span><b>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</b> pcs</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Harga:</span>
                            <span className="total-price">Rp {calculateTotal().toLocaleString()}</span>
                        </div>

                        <div className="payment-method">
                            <span className="payment-method-text">Pilih Metode Pembayaran:</span>
                            <div className="payment-options">
                                <label>
                                    <input 
                                        type="radio"
                                        name="paymentMethod"
                                        value="Dana"
                                        onChange={() => setPaymentMethod('Dana')}
                                    /> Dana
                                </label>
                                <label>
                                    <input 
                                        type="radio"
                                        name="paymentMethod"
                                        value="Gopay"
                                        onChange={() => setPaymentMethod('Gopay')}
                                    /> Gopay
                                </label>
                                <label>
                                    <input 
                                        type="radio"
                                        name="paymentMethod"
                                        value="ovo"
                                        onChange={() => setPaymentMethod('ovo')}
                                    /> OVO
                                </label>
                            </div>
                        </div>

                        <button onClick={handleCheckout} className="btn-checkout">
                            <i className="fas fa-credit-card"></i> Bayar Sekarang
                        </button>
                    </div>
                </>
            )}

            {/* Popup Nomor Pembayaran */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Nomor Pembayaran</h2>
                        <p>Metode Pembayaran: {paymentMethod}</p>
                        <p>Nomor Pembayaran: 081233445566</p>
                        <p>Total Harga: Rp {calculateTotal().toLocaleString()}</p>
                        <div className="popup-buttons">
                            <button onClick={handlePayment} className="btn-confirm-payment">
                                Bayar Sekarang
                            </button>
                            <button onClick={() => setShowPopup(false)} className="btn-close-popup">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Pembayaran Sukses */}
            {paymentSuccess && (
                <div className="payment-success-popup">
                    <div className="popup-content">
                        <div className="checkmark-circle">
                            <i className="fas fa-check"></i>
                        </div>
                        <h2>Pembayaran Anda sukses!</h2>
                        <p className="success-text">Terimakasih atas pesanannya, pesanan Anda sedang diproses.</p>
                        <button className="btn-payment-success" onClick={closeSuccessPopup}>
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;