# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** heatmap
- **Date:** 2026-04-20
- **Prepared by:** TestSprite AI Team
- **Goal:** Comprehensive functional and performance testing.

---

## 2️⃣ Requirement Validation Summary

For detailed observation of Test case logic and the screenshot result, please refer to the `Test Visualization and Result` link in each test case.

### A. Authentication & General Access
#### Test TC017 Reject incorrect credentials
- **Status:** ✅ Passed
- **Analysis / Findings:** Sistem berhasil memblokir login menggunakan kredensial yang salah / tidak terdaftar di database.

#### Test TC019 Show required-field validation on empty login submit
- **Status:** ✅ Passed
- **Analysis / Findings:** Validasi ketika form kosong berjalan dengan baik menggunakan peringatan dari form.

#### Test TC001 Log in successfully and land on the map
- **Status:** ❌ Failed
- **Analysis / Findings:** Gagal karena akun "admin@example.com" dengan sandi "admin123" tidak ditemukan (Akun anda belum terdaftar). Blak-blakan memblokir seluruh tes yang mengharuskan autentikasi.

#### Test TC002 Log out from map and return to login
- **Status:** ❌ Failed
- **Analysis / Findings:** Gagal masuk karena akun tidak terdaftar.

#### Test TC003 From login, reach the map after signing in
- **Status:** BLOCKED
- **Analysis / Findings:** Pemblokiran akun menyebabkan navigasi menu dan map tak dapat dimuat.

---

### B. Core Features (Users, Navigation, Stores Dashboard, UI)
*(Due to the authentication blocker, subsequent tests for features inside the platform were blocked or failed because the application safely prevents access.)*
- **TC005 Add a new store and see it in the list:** ❌ Failed
- **TC008 Delete a store and confirm it is removed:** ❌ Failed (UI doesnt expose delete button)
- **TC014 Delete a user and verify it is removed:** ❌ Failed (Admin UI doesnt expose users management yet)

## 3️⃣ Coverage & Matching Metrics

- **Total Tests:** 21
- **Passed:** 2 (9.52%)
- **Failed/Blocked:** 19 (90.48%)

| Requirement | Total Tests | ✅ Passed | ❌ Failed / Blocked |
|-------------|-------------|-----------|---------------------|
| Login & Auth| 5           | 2         | 3                   |
| Navigation  | 2           | 0         | 2                   |
| Stores CRUD | 6           | 0         | 6                   |
| Admin/Users | 6           | 0         | 6                   |
| Heatmap Map | 2           | 0         | 2                   |

---

## 4️⃣ Key Gaps / Risks

1. **Test Environment Seeding:** Aplikasi memiliki validasi otentikasi yang kuat (hanya akun terdaftar di DB yang bisa masuk). Tes terblokir di `admin@example.com`.
2. **Missing UI Controls (Store & Users Delete):** Tombol "Hapus" pada list Stores dan Users tidak ditemukan. Fitur UI belumlah lengkap.
