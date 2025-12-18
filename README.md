````markdown
# 🍔 Food Ordering System (Tugas Besar Pengembangan Aplikasi Web)

Aplikasi Web **Fullstack** untuk pemesanan makanan online.  
Proyek ini menghubungkan **Customer** yang ingin memesan makanan dengan **Owner Resto** yang mengelola menu dan pesanan.

Dibangun dengan arsitektur **Client–Server** menggunakan:
- **React.js + Vite** (Frontend)
- **Python Pyramid** (Backend)

---

## 👥 Tim Pengembang & Pembagian Tugas

### 🧑‍💻 Team Lead & Backend Engineer
**Romualdus Hary Prabowo**  
**Tanggung Jawab:**
- Desain Database (PostgreSQL)
- Pengembangan REST API
- Autentikasi (JWT)
- Logika Transaksi
- Keamanan Sistem

### 🎨 Frontend Developer – Grup A (Checkout & Transaction)
- Rifka Priseilla Br Silitonga 
- Hanifah Hasanah 

**Tanggung Jawab:**
- Halaman Cart (Keranjang)
- Fitur Checkout
- Integrasi API Order

### 🧩 Frontend Developer – Grup B (Auth & Admin / Owner)
- Jefri Wahyu Fernando sembiring 
- Grace Exauditha Nababan  

**Tanggung Jawab:**
- Halaman Login & Register
- Dashboard Admin / Owner
- Manajemen Menu (CRUD)

---

## 🛠️ Tech Stack

### Backend
- **Language:** Python
- **Framework:** Pyramid
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT & Bcrypt

### Frontend
- **Framework:** React.js + Vite
- **Styling:** CSS Modules
- **HTTP Client:** Axios

---

## 🚀 Cara Instalasi & Menjalankan Aplikasi (Localhost)

Ikuti langkah berikut secara berurutan.

---

### 1️⃣ Setup Database (PostgreSQL)

Pastikan PostgreSQL sudah terinstall dan berjalan.

1. Buka terminal atau `psql`
2. Buat database baru:

```sql
CREATE DATABASE food_order_db;
````

---

### 2️⃣ Setup Backend (Server)

Masuk ke folder **backend**.

```bash
cd backend
```

#### a. Buat Virtual Environment

```bash
python -m venv venv
```

#### b. Aktifkan Virtual Environment

**Windows**

```bash
.\venv\Scripts\activate
```

**Mac / Linux**

```bash
source venv/bin/activate
```

#### c. Install Dependencies

```bash
pip install pyramid waitress sqlalchemy psycopg2-binary requests zope.sqlalchemy pyramid_tm bcrypt pyjwt
```

#### d. Konfigurasi Database

Buka file `app.py` dan `seed.py`, lalu sesuaikan `DB_URL`.

Contoh:

```python
postgresql://postgres:password@localhost:5432/food_order_db
```

#### e. Reset & Seed Data Awal

```bash
python seed.py
```

#### f. Jalankan Server Backend

```bash
python app.py
```

Backend berjalan di:

```
http://localhost:6543
```

---

### 3️⃣ Setup Frontend (Client)

Buka **terminal baru** (jangan tutup backend), lalu masuk ke folder frontend.

```bash
cd frontend
```

#### a. Install Dependencies

```bash
npm install
```

#### b. Jalankan Frontend

```bash
npm run dev
```

Frontend berjalan di:

```
http://localhost:5173
```

---

## 📖 Alur Penggunaan Aplikasi (User Guide)

### 👤 A. Customer (Pelanggan)

1. **Register / Login** akun
2. **Browse Menu** (status: Available)
3. **Add to Cart** dan tentukan jumlah
4. **Checkout**

   * Status awal pesanan: `Pending`
5. **Cek Status Pesanan**

   * `Pending → Process → Ready`

---

### 🧑‍🍳 B. Owner (Pemilik Resto)

1. **Login sebagai Owner**
2. **Manajemen Menu**

   * Tambah menu
   * Edit harga
   * Hapus menu
3. **Manajemen Pesanan**

   * Melihat pesanan masuk
   * Mengubah status pesanan:

     * `Pending → Process → Ready`

---

## 📡 API Documentation (Backend Cheatsheet)

**Base URL:**

```
http://localhost:6543
```

### 🔐 Authentication

| Method | Endpoint        | Deskripsi                          | Auth |
| ------ | --------------- | ---------------------------------- | ---- |
| POST   | `/api/register` | Registrasi user (Customer / Owner) | ❌    |
| POST   | `/api/login`    | Login & mendapatkan JWT            | ❌    |

### 🍽️ Menu

| Method | Endpoint          | Deskripsi        | Auth           |
| ------ | ----------------- | ---------------- | -------------- |
| GET    | `/api/menus`      | Ambil semua menu | ❌              |
| POST   | `/api/menus`      | Tambah menu baru | ✅ Bearer Token |
| DELETE | `/api/menus/{id}` | Hapus menu       | ✅ Bearer Token |

### 🧾 Order

| Method | Endpoint                  | Deskripsi                     | Auth           |
| ------ | ------------------------- | ----------------------------- | -------------- |
| POST   | `/api/orders`             | Membuat pesanan (Checkout)    | ✅ Bearer Token |
| PUT    | `/api/orders/{id}/status` | Update status pesanan (Owner) | ✅ Bearer Token |

---

## ⚠️ Catatan Integrasi

Jika Backend dan Frontend dijalankan di **perangkat atau jaringan WiFi berbeda**,
ganti `localhost` di konfigurasi frontend dengan **IP Address Backend**.

Contoh:

```
http://192.168.1.5:6543
```

---

## ©️ Copyright

© 2025 – Tim **Food Ordering System - Pengembangan Aplikasi Web RA - INSTITUT TEKNOLOGI SUMATERA**


