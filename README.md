# 🍗 Food Ordering System (Final Project)

Aplikasi Web **Fullstack** untuk pemesanan makanan online.
Proyek ini menghubungkan **Customer** yang ingin memesan makanan dengan **Owner Resto** yang mengelola menu dan pesanan.

Dibangun dengan arsitektur **Client–Server** menggunakan:

* **React.js + Vite** (Frontend)
* **Python Pyramid** (Backend)

---

## 👥 Tim Pengembang & Pembagian Tugas

### 🧑‍💻 Team Lead & Backend Engineer
**Romualdus Hary Prabowo** 

**Tanggung Jawab:**

* Desain Database (PostgreSQL)
* Pengembangan REST API
* Autentikasi (JWT)
* Logika Transaksi
* Keamanan Sistem

### 🎨 Frontend Developer – Grup A (Checkout & Transaction)

* Rifki Pratama Br Sihotang
* Hanifah Hasanah

**Tanggung Jawab:**

* Halaman Cart (Keranjang)
* Fitur Checkout
* Integrasi API Order

### 🧩 Frontend Developer – Grup B (Auth & Admin / Owner)

* Jefri Wahyu Fernando Sembiring
* Grace Exauditha Nababan

**Tanggung Jawab:**

* Halaman Login & Register
* Dashboard Admin / Owner
* Manajemen Menu (CRUD)

---

## 🛠️ Tech Stack

### Backend

* **Language:** Python
* **Framework:** Pyramid
* **Database:** PostgreSQL
* **ORM:** SQLAlchemy
* **Authentication:** JWT & Bcrypt

### Frontend

* **Framework:** React.js + Vite
* **Styling:** CSS Modules
* **HTTP Client:** Axios

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
```

---

### 2️⃣ Setup Backend (Server)

Masuk ke folder **backend**:

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

Edit file `app.py` dan `seed.py`, lalu sesuaikan `DB_URL`.

Contoh:

```python
postgresql://postgres:passwordkalian@localhost:5432/food_order_db
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

Buka **terminal baru**, lalu masuk ke folder frontend:

```bash
cd frontend
```

#### a. Install Dependencies

```bash
npm install
```

#### b. Jalankan Aplikasi

```bash
npm run dev
```

Frontend berjalan di:

```
http://localhost:5173
```

---

## 📖 Alur Penggunaan Aplikasi

### 👤 Customer

1. Register / Login
2. Melihat menu yang tersedia
3. Menambahkan menu ke Cart
4. Checkout

   * Status awal: **Pending**
5. Melihat perubahan status pesanan

   * `Pending → Process → Ready`

---

### 🧑‍🍳 Owner

1. Login sebagai Owner
2. Mengelola Menu (Tambah / Edit / Hapus)
3. Melihat pesanan masuk
4. Mengubah status pesanan

---

## 📡 API Documentation (Cheatsheet)

**Base URL**

```
http://localhost:6543
```

### 🔐 Authentication

| Method | Endpoint        | Deskripsi       |
| ------ | --------------- | --------------- |
| POST   | `/api/register` | Registrasi user |
| POST   | `/api/login`    | Login & JWT     |

### 🍽️ Menu

| Method | Endpoint          | Deskripsi        | Auth |
| ------ | ----------------- | ---------------- | ---- |
| GET    | `/api/menus`      | Ambil semua menu | ❌    |
| POST   | `/api/menus`      | Tambah menu      | ✅    |
| DELETE | `/api/menus/{id}` | Hapus menu       | ✅    |

### 🧾 Order

| Method | Endpoint                  | Deskripsi             | Auth |
| ------ | ------------------------- | --------------------- | ---- |
| POST   | `/api/orders`             | Checkout              | ✅    |
| PUT    | `/api/orders/{id}/status` | Update status (Owner) | ✅    |

---

## ⚠️ Catatan Penting

Jika Backend dan Frontend dijalankan di **perangkat atau jaringan berbeda**,
ganti `localhost` di frontend dengan **IP Backend**.

Contoh:

```
http://192.168.1.5:6543
```

---

## ©️ Copyright

© 2025 – Tim **Food Ordering System - Pengembangan Aplikasi Web - Kelas RA - INSTITUT TEKNOLOGI SUMATERA**

---
