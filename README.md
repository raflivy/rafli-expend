# 💰 Personal Expense Tracker

Aplikasi web modern untuk mengelola pengeluaran pribadi dengan antarmuka mobile-first yang intuitif dan fitur lengkap untuk tracking keuangan personal.

## ✨ Fitur Utama

- 🔐 **Password Protection** - Akses aman dengan proteksi password
- 📱 **Mobile-First Design** - UI/UX yang dioptimalkan untuk mobile
- 📊 **Dashboard Interaktif** - Overview pengeluaran dengan statistik real-time
- 🏷️ **Kategori Custom** - Buat dan kelola kategori pengeluaran
- 💸 **CRUD Pengeluaran** - Tambah, edit, hapus pengeluaran dengan mudah
- 📈 **Laporan Lengkap** - Laporan harian, mingguan, dan bulanan
- 🎯 **Budget Management** - Set dan track budget per kategori
- 🎨 **Animasi Smooth** - Pengalaman user yang menarik dengan Framer Motion
- 📱 **Bottom Navigation** - Navigasi mobile-like dengan 3 tombol utama

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL dengan Prisma ORM
- **Authentication**: Custom password-based auth
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Utils**: date-fns
- **UI Components**: Headless UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm atau yarn

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd expendpribadi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file dan sesuaikan dengan konfigurasi database Anda:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/expendpribadi?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database dengan data awal
   npm run db:seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Akses aplikasi**
   Buka http://localhost:3000 di browser
   
   **Default login**: password `admin123`

## 📱 Cara Penggunaan

### Login
- Masukkan password untuk akses aplikasi
- Default password: `admin123`

### Dashboard
- Lihat overview pengeluaran hari ini, minggu ini
- Monitor progress budget bulanan
- Review pengeluaran terbaru

### Tambah Pengeluaran
- Klik tombol + di tengah bottom navigation
- Isi jumlah, deskripsi, kategori, dan tanggal
- Simpan pengeluaran

### Laporan
- Akses melalui tombol "Laporan" di bottom navigation
- Pilih periode: harian, mingguan, atau bulanan
- Lihat breakdown per kategori
- Kelola kategori dan budget

### Pengaturan
- Klik ikon gear di header
- Logout dari aplikasi



**Happy tracking! 💰📊**
