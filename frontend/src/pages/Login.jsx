import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    //state untuk menyimpan inputan user
    const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //Logika login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            //Mengirim data ke backend
            const response = await api.post('/login', { email, password });
            
            //Menyimpan token dan data user di localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            alert("Login Berhasil! Selamat datang.");
            navigate('/menu'); //Move ke halaman menu setelah login
            
        } catch (err) {
            console.error(err);
                setError('Login Gagal: Email atau Password Salah.');
        }
        };

    //Render halaman login
    return (
        <div className="login-container">
            <section className="login-image">
                <div className="image-overlay">
                    <h1>Order AJA</h1>
                    <p>Nikmati kelezatan favoritmu, kapan saja, di mana saja.</p>
                </div>
            </section>

            <section className="login-form-section">
                <div className="login-form-container">
                    <form className="login-form" onSubmit={handleLogin}>
                        <h1>Selamat Datang!</h1>
                        <h3>Silahkan masuk ke akun Anda.</h3>
                        <p className="subtitle">Kami sudah siapkan menu favorit Anda!. Cari dan lakukan pesanan.</p>
                        
                        {/* Pesan error jika gagal */}
                        {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', background:'#ffe6e6', padding:'10px', borderRadius:'5px' }}>{error}</p>}

                        {/* Input email */}
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope"></i>
                                <input 
                                    type="email" 
                                    id="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="contoh@email.com"
                                />
                            </div>
                        </div>

                        {/* Input password */}
                        <div className="input-group">
                            <label htmlFor="password">Kata Sandi</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock"></i>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan kata sandi"
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" name="remember" />
                                <label htmlFor="remember" style={{marginLeft:'5px', display:'inline'}}>Ingat saya</label>
                            </div>
                            <a href="#" className="forgot-password">Lupa kata sandi?</a>
                        </div>

                        <button type="submit" className="btn-login">Masuk</button>

                        <p className="signup-link">Belum punya akun? <a href="#">Daftar sekarang</a></p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;