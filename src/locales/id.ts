import en from './en'

type Translation = typeof en

const id: Translation = {
  common: {
    success: 'Operasi berhasil',
    error: 'Terjadi kesalahan',
  },

  success: {
    created: 'Data berhasil dibuat',
    retrieved: 'Data berhasil diambil',
    updated: 'Data berhasil diperbarui',
    deleted: 'Data berhasil dihapus',
    restored: 'Data berhasil dipulihkan',
  },

  errors: {
    badRequest: 'Permintaan tidak valid',
    forbidden: 'Anda tidak memiliki izin untuk mengakses sumber daya ini',
    internalServer: 'Terjadi kesalahan pada server',
    notFound: 'Data tidak ditemukan',
    unauthorized: 'Akses tidak diizinkan',
  },

  auth: {
    loginFailed: 'Email atau kata sandi salah',
    loginNikFailed: 'NIk atau kata sandi salah',
    emailUsed: 'Email sudah terdaftar',
    nikUsed: 'NIK sudah terdaftar',
    phoneUsed: 'Nomor telepon sudah terdaftar',
    loginSuccess: 'Login berhasil',
    registerSuccess: 'Pengguna berhasil didaftarkan',
  },

  user: {
    notFound: 'Pengguna tidak ditemukan',
    profileUpdated: 'Profil berhasil diperbarui',
    profilePictureUpdated: 'Foto profil berhasil diperbarui',
    inCompleteDetail: 'Pengguna belum mengisi data lengkap',
  },

  questionnaire: {
    duplicateOrder: 'Urutan berganda ditemukan',
    inCompleteAnswer: 'Mohon jawab semua pertanyaan yang tersedia',
    exceededAnswer:
      'Jawaban yang dikirim melebihi jumlah pertanyaan yang tersedia',
    notFound: 'Kuesioner tidak ditemukan',
    questionNotFound: 'Pertanyaan dengan id {id} tidak ditemukan',
  },
}

export default id
