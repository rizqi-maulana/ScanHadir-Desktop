// main.ts
import path from 'path'
import { app, ipcMain } from 'electron'
import { createWindow } from './helpers'

    ; (async () => {
        await app.whenReady()

        const mainWindow = createWindow('main', {
            width: 1000,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
        })

        // Function to load offline page - FIXED VERSION
        const loadOfflinePage = () => {
            const offlineHTML = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ScanHadir - Mode Offline</title>
    <style>
        :root {
            --primary: #007bff;
            --primary-dark: #0056b3;
            --primary-light: #e7f3ff;
            --gray-bg: #f8f9fa;
            --card-bg: #ffffff;
            --text-primary: #212529;
            --text-secondary: #6c757d;
            --text-muted: #adb5bd;
            --border-color: #dee2e6;
            --error: #dc3545;
            --warning: #ffc107;
            --success: #28a745;
            --white: #ffffff;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --radius: 0.5rem;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        body {
            background-color: var(--gray-bg);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .container {
            width: 100%;
            max-width: 32rem; /* Lebih kecil untuk tampilan yang lebih ringkas */
            min-width: 20rem;
            margin: 0 auto;
            text-align: center;
        }

        .icon-wrapper {
            margin-bottom: 1.5rem;
        }

        .icon-circle {
            width: 6rem; /* Sedikit kecilkan */
            height: 6rem;
            background-color: var(--primary-light);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
        }

        .cloud-off-icon {
            width: 2.5rem; /* Ukuran ikon */
            height: 2.5rem;
            stroke: var(--primary);
            stroke-width: 1.5;
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        h1 {
            font-size: 1.5rem; /* Sedikit kecilkan */
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
        }

        .description {
            font-size: 1rem; /* Ukuran font standar */
            color: var(--text-secondary);
            margin-bottom: 1.5rem; /* Sedikit kurangi jarak */
            line-height: 1.5;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background-color: #FEF2F2;
            border: 1px solid #FECACA;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--error);
            margin-bottom: 1.5rem;
        }

        .status-badge.online {
            background-color: #F0FDF4;
            border-color: #BBF7D0;
            color: var(--success);
        }

        .status-dot {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background-color: currentColor;
        }

        .retry-button {
            background-color: var(--primary);
            color: var(--white);
            border: none;
            padding: 0.75rem 2rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 9999px; /* Sekarang rounded-full */
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
            margin-bottom: 1.5rem;
            width: 100%;
            max-width: 12rem;
        }

        .retry-button:hover:not(:disabled) {
            background-color: var(--primary-dark);
            transform: translateY(-0.125rem);
            box-shadow: var(--shadow);
        }

        .retry-button:active:not(:disabled) {
            transform: translateY(0);
        }

        .retry-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .refresh-icon {
            width: 1rem;
            height: 1rem;
            stroke: currentColor;
            stroke-width: 2;
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .help-section {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            padding: 1.25rem; /* Sedikit kurangi padding */
            text-align: left;
            box-shadow: var(--shadow);
        }

        .help-title {
            font-size: 0.95rem; /* Sedikit kecilkan */
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 1rem;
        }

        .help-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.6rem; /* Sedikit kurangi gap */
        }

        .help-item {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem; /* Sedikit kurangi gap */
            font-size: 0.85rem; /* Sedikit kecilkan */
            color: var(--text-secondary);
        }

        .help-item::marker {
            content: "• ";
            color: var(--text-muted);
            font-size: 1.1rem; /* Sedikit kecilkan */
            line-height: 0;
        }

        /* Media Query untuk layar kecil (tablet, mobile) */
        @media (max-width: 768px) {
            .container {
                max-width: 90%; /* Lebar lebih besar di layar kecil */
            }

            .retry-button {
                 max-width: 100%; /* Tombol penuhi lebar */
            }

            .help-section {
                padding: 1rem; /* Kurangi padding */
            }
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="icon-wrapper">
            <div class="icon-circle">
                <!-- Ikon Cloud Off -->
                <svg class="cloud-off-icon" viewBox="0 0 24 24">
                    <path d="M2.1 2.1a2.4 2.4 0 0 0 3.39 3.39M1 12a9 9 0 1 0 18 0M15 12a3 3 0 1 1-6 0"></path>
                    <path d="m2 2 20 20" stroke-width="2"></path>
                </svg>
            </div>
        </div>

        <h1>Koneksi Terputus</h1>
        <p class="description">
            Aplikasi memerlukan koneksi internet untuk mengakses dashboard. Silakan periksa koneksi Anda.
        </p>

        <div id="status" class="status-badge">
            <span class="status-dot"></span>
            <span>Offline</span>
        </div>

        <button id="retry-btn" class="retry-button">
            <svg class="refresh-icon" viewBox="0 0 24 24">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
            </svg>
            <span id="btn-text">Coba Lagi</span>
        </button>

        <div class="help-section">
            <h3 class="help-title">Cara Mengatasi:</h3>
            <ul class="help-list">
                <li class="help-item">Pastikan WiFi atau data seluler aktif.</li>
                <li class="help-item">Nonaktifkan mode pesawat.</li>
                <li class="help-item">Restart router atau modem Anda.</li>
                <li class="help-item">Cek pengaturan firewall atau proxy.</li>
            </ul>
        </div>
    </div>

    <script>
        const statusEl = document.getElementById('status');
        const retryBtn = document.getElementById('retry-btn');
        const btnText = document.getElementById('btn-text');

        // Fungsi untuk memperbarui UI berdasarkan status *nyata* (bukan hanya navigator.onLine)
        function updateUI(isOffline) {
            if (!isOffline) {
                // Jika online (atau belum dikonfirmasi offline), tampilkan status Online dan disable tombol
                statusEl.innerHTML = '<span class="status-dot"></span> <span>Online</span>';
                statusEl.className = 'status-badge online';
                retryBtn.disabled = true;
                btnText.textContent = 'Terhubung';
            } else {
                // Jika benar-benar offline, tampilkan status Offline dan **aktifkan tombol**
                statusEl.innerHTML = '<span class="status-dot"></span> <span>Offline</span>';
                statusEl.className = 'status-badge';
                retryBtn.disabled = false; // ✅ DIBENARKAN: tombol harus aktif saat offline
                btnText.textContent = 'Coba Lagi';
            }
        }

        // Cek koneksi nyata dengan fetch ke endpoint sederhana (fallback ke navigator.onLine jika gagal)
        async function checkRealConnection() {
            try {
                // Gunakan endpoint yang ringan dan pasti ada di domain Anda
                // Alternatif jika tidak bisa buat endpoint: await fetch('https://httpbin.org/get', { method: 'HEAD', mode: 'no-cors' });
                // Namun, mode 'no-cors' tidak akan mendeteksi error jaringan. Maka, fetch ke endpoint Anda adalah pilihan terbaik.
                // Untuk sementara, kita gunakan navigator.onLine sebagai fallback, tapi logika utama tetap offline-first.
                // Kita simulasikan koneksi gagal untuk kasus offline.
                // const res = await fetch('https://admin.scanhadirku.id/api/ping', { method: 'HEAD', cache: 'no-cache' });
                // return res.ok;
                // Karena kita dalam mode offline page, kita asumsikan koneksi gagal.
                return false; // <-- Asumsikan offline saat halaman ini dimuat
            } catch (err) {
                // Gagal fetch = kemungkinan offline
                return false;
            }
        }

        // Inisialisasi: saat DOM siap, asumsikan offline, lalu coba cek
        document.addEventListener('DOMContentLoaded', async () => {
            // Langsung set ke "Offline" sebagai default (karena kita dalam mode offline page)
            updateUI(true);

            // Coba cek koneksi nyata secara background
            // const isOnline = await checkRealConnection();
            // updateUI(!isOnline); // Jika online -> false, jika offline -> true

            retryBtn.addEventListener('click', async () => {
                retryBtn.disabled = true;
                btnText.textContent = 'Memeriksa...';

                // Simulasikan cek koneksi atau coba redirect
                // const isNowOnline = await checkRealConnection();
                // if (isNowOnline) {
                //     // Jika berhasil, redirect
                //     window.location.href = 'https://admin.scanhadirku.id';
                // } else {
                //     // Jika masih offline, reset UI
                //     updateUI(true);
                //     btnText.textContent = 'Coba Lagi';
                // }

                // Karena kita hanya ingin test UI, kita coba redirect saja.
                // Jika redirect gagal, did-fail-load akan trigger lagi dan memanggil loadOfflinePage().
                window.location.href = 'https://admin.scanhadirku.id';
            });
        });

        // Event listener untuk online/offline (untuk kasus browser native)
        // window.addEventListener('online', () => {
        //     updateUI(false);
        // });
        // window.addEventListener('offline', () => {
        //     updateUI(true);
        // });
    </script>
</body>
</html>
    `;
            // ✅ Perbaikan: Gunakan skema 'data:text/html...' untuk inline HTML
            mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(offlineHTML)}`)
        }

        // Try to load the main URL - FIXED: Removed trailing spaces
        try {
            await mainWindow.loadURL('https://admin.scanhadirku.id') // <- Spasi dihapus
            mainWindow.webContents.closeDevTools()
        } catch (error) {
            // If loading fails, show offline page
            loadOfflinePage()
            console.error('Failed to load URL:', error)
        }

        // Listen for navigation failures (when internet disconnects)
        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            // Ignore aborted loads (errorCode -3)
            if (errorCode !== -3) {
                console.error('Failed to load:', errorCode, errorDescription)
                loadOfflinePage()
            }
        })

        // Optional: Add IPC handler to retry connection from renderer - FIXED: Removed trailing spaces
        ipcMain.on('retry-connection', async () => {
            try {
                await mainWindow.loadURL('https://admin.scanhadirku.id') // <- Spasi dihapus
            } catch (error) {
                loadOfflinePage()
            }
        })

    })()

app.on('window-all-closed', () => {
    app.quit()
})