# 💼 Salary Management System

> **Sistem manajemen gaji modern** dengan alur approval berbasis role yang dibangun menggunakan **Laravel**, **Inertia.js**, dan **Spatie Laravel-Permission**

---

## 🚀 Quick Start Guide

### 📦 1. Clone & Setup Project

```bash
git clone <repository-url>
cd <nama-folder>
```

### ⚡ 2. Install Dependencies

```bash
# Backend dependencies
composer install

# Frontend dependencies
npm install
```

### ⚙️ 3. Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

> 💡 **Tip**: Jangan lupa konfigurasi database connection di file `.env`

### 🗄️ 4. Database Setup

```bash
php artisan migrate --seed
```

### 🔗 5. Storage Link

```bash
php artisan storage:link
```

### 🚀 6. Run Project

```bash
composer run dev
```

> 🌟 **Info**: Command ini akan menjalankan Laravel development server secara otomatis

---

## 👥 Default Accounts

Setelah seeding berhasil, gunakan akun berikut untuk login:

| 🎭 Role     | 📧 Email                                      | 🔑 Password |
| ----------- | --------------------------------------------- | ----------- |
| 🏢 Director | [director@mail.com](mailto:director@mail.com) | `password`  |
| 👔 Manager  | [manager@mail.com](mailto:manager@mail.com)   | `password`  |
| 💰 Finance  | [finance@mail.com](mailto:finance@mail.com)   | `password`  |
