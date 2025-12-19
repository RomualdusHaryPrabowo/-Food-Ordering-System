import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // Import CSS khusus Register

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Tambahan status loading
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Aktifkan loading saat tombol ditekan
        
        try {
            await api.post('/register', { 
                name: name,
                email: email, 
                password: password,
                role: 'customer' 
            });
            
            
            setShowSuccess(true); // Tampilkan pop-up sukses    
            
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Gagal mendaftar. Silakan coba lagi.');
            }
        } finally {
            setLoading(false); // Matikan loading selesai atau gagal
        }
    };
    const handleClosePopup = () => {
        setShowSuccess(false);
        navigate('/');
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h1>Buat Akun Baru</h1>
                    <p>Isi data diri Anda untuk mulai memesan makanan lezat.</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleRegister}>
                    {/* Input Nama */}
                    <div className="form-group">
                        <label htmlFor="name">Nama Lengkap</label>
                        <div className="input-with-icon">
                            <input 
                                type="text" 
                                id="name"
                                placeholder="Masukkan nama Anda"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required 
                            />
                            <i className="fas fa-user"></i>
                        </div>
                    </div>

                    {/* Input Email */}
                    <div className="form-group">
                        <label htmlFor="email">Alamat Email</label>
                        <div className="input-with-icon">
                            <input 
                                type="email" 
                                id="email"
                                placeholder="contoh@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                            <i className="fas fa-envelope"></i>
                        </div>
                    </div>

                    {/* Input Password */}
                    <div className="form-group">
                        <label htmlFor="password">Kata Sandi</label>
                        <div className="input-with-icon">
                            <input 
                                type="password" 
                                id="password"
                                placeholder="Buat kata sandi aman"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <i className="fas fa-lock"></i>
                        </div>
                    </div>

                    <button type="submit" className="btn-register" disabled={loading}>
                        {loading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="login-redirect">
                    <p>Sudah punya akun? <Link to="/">Masuk disini</Link></p>
                </div>
                {showSuccess && (
                <div className="modal-overlay">
                    <div className="modal-content success-modal">
                        <div className="icon-circle">
                            <i className="fas fa-check"></i>
                        </div>
                        <h2>Registrasi Berhasil!</h2>
                        <p>Akun Anda telah dibuat. Silakan login untuk melanjutkan pesanan.</p>
                        <button onClick={handleClosePopup} className="btn-popup-ok">
                            Login Sekarang
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Register;