// index.js
// Tugas Kecil 1 — Student API
// Web Advanced Development
//
// Instruksi:
//   1. Baca setiap komentar TODO dengan seksama.
//   2. Ganti baris "// TODO: ..." dengan kode yang benar.
//   3. Jangan ubah nama variabel, nama endpoint, atau struktur yang sudah ada.
//   4. Test setiap endpoint di Postman sebelum submit.
//
// Run: node index.js  →  http://localhost:3000

// Sebelum itu, tuliskan nama, NIM, di bawah ini, dan apabila sudah selesai, isi refleksi di bawah ini (dalam bentuk comment)
// Nama: ...
// NIM: ...
// Refleksi:
// blablabla
// blablabla
// blablabla
// blablabla
// blablabla

const express = require("express");
const app = express();
const PORT = 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());

// ── In-memory "database" ─────────────────────────────────────
// Data awal — jangan diubah, dipakai untuk pengujian
let students = [
  { id: 1, name: "Andi Saputra",    nim: "231001", major: "Informatika",          gpa: 3.75 },
  { id: 2, name: "Bella Kurnia",    nim: "231002", major: "Sistem Informasi",      gpa: 3.50 },
  { id: 3, name: "Candra Wijaya",   nim: "231003", major: "Informatika",          gpa: 3.20 },
];

// nextId dipakai untuk generate id otomatis saat POST
let nextId = 4;

// ── Helpers ──────────────────────────────────────────────────
const respondNotFound = (res) =>
  res.status(404).json({ error: "Student tidak ditemukan" });

const findById = (id) => students.find(({ id: studentId }) => studentId === id);

const findIndexById = (id) =>
  students.findIndex(({ id: studentId }) => studentId === id);

const isFilled = (value) => Boolean(value);

const validateCreateBody = ({ name, nim, major }) =>
  [name, nim, major].every(isFilled);

const hasAtLeastOneField = ({ name, nim, major, gpa }) =>
  [name, nim, major, gpa].some((field) => field !== undefined);

const pickDefinedFields = ({ name, nim, major, gpa }) =>
  Object.fromEntries(
    Object.entries({ name, nim, major, gpa }).filter(
      ([, value]) => value !== undefined
    )
  );

// ════════════════════════════════════════════════════════════
//  ENDPOINT 1 — GET /students
//  Kembalikan semua data mahasiswa dalam bentuk array JSON
// ════════════════════════════════════════════════════════════
app.get("/students", (req, res) => {
  res.status(200).json(students);
});

// ════════════════════════════════════════════════════════════
//  BONUS — GET /students/search?major=...
//  Filter mahasiswa berdasarkan query param major
//  Contoh: GET /students/search?major=Informatika
//  Jika tidak ada yang cocok → kembalikan array kosong []
//
//  ⚠️  Endpoint ini HARUS didefinisikan SEBELUM /students/:id
//      karena Express membaca route dari atas ke bawah —
//      "search" akan ditangkap sebagai :id kalau urutannya salah!
// ════════════════════════════════════════════════════════════
app.get("/students/search", (req, res) => {
  const { major } = req.query;

  const results = students.filter(
    ({ major: studentMajor }) => studentMajor === major
  );

  res.status(200).json(results);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 2 — GET /students/:id
//  Kembalikan satu mahasiswa berdasarkan id
//  Jika tidak ditemukan → status 404 + { error: "Student tidak ditemukan" }
// ════════════════════════════════════════════════════════════
app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = findById(id);

  if (!student) return respondNotFound(res);

  res.status(200).json(student);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 3 — POST /students
//  Tambahkan mahasiswa baru dari request body
//  Body yang dikirim: { name, nim, major, gpa }
//  Validasi: name, nim, major wajib ada — kalau tidak → 400
//  Sukses → status 201 + data mahasiswa baru
// ════════════════════════════════════════════════════════════
app.post("/students", (req, res) => {
  const { name, nim, major, gpa } = req.body;

  if (!validateCreateBody({ name, nim, major })) {
    return res
      .status(400)
      .json({ error: "name, nim, dan major wajib diisi" });
  }

  const newStudent = { id: nextId, name, nim, major, gpa: gpa ?? 0 };
  nextId++;

  students.push(newStudent);

  res.status(201).json(newStudent);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 4 — PUT /students/:id
//  Update data mahasiswa berdasarkan id
//  Field yang bisa diupdate: name, nim, major, gpa (semua opsional)
//  Minimal satu field harus dikirim → kalau tidak ada → 400
//  Jika id tidak ditemukan → 404
// ════════════════════════════════════════════════════════════
app.put("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, nim, major, gpa } = req.body;

  if (!hasAtLeastOneField({ name, nim, major, gpa })) {
    return res
      .status(400)
      .json({ error: "Minimal satu field harus diisi" });
  }

  const index = findIndexById(id);

  if (index === -1) return respondNotFound(res);

  const updates = pickDefinedFields({ name, nim, major, gpa });
  students[index] = { ...students[index], ...updates };

  res.status(200).json(students[index]);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 5 — DELETE /students/:id
//  Hapus mahasiswa berdasarkan id
//  Jika tidak ditemukan → 404
//  Sukses → status 204 (no content)
// ════════════════════════════════════════════════════════════
app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = findIndexById(id);

  if (index === -1) return respondNotFound(res);

  students.splice(index, 1);

  res.status(204).send();
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET    /students`);
  console.log(`  GET    /students/:id`);
  console.log(`  POST   /students`);
  console.log(`  PUT    /students/:id`);
  console.log(`  DELETE /students/:id`);
  console.log(`  GET    /students/search?major=... (bonus)`);
});
