// index.prisma.js
// BONUS — Refactor ke Prisma ORM
// Tugas Kecil 1 — Web Advanced Development
//
// File ini dipakai HANYA untuk bagian bonus.
// Selesaikan index.js (in-memory) dulu sebelum mengerjakan ini.
//
// Untuk menjalankan bonus:
//   1. npm install @prisma/client prisma
//   2. npx prisma init
//   3. Edit prisma/schema.prisma (lihat komentar di bawah)
//   4. Buat database & jalankan: npx prisma migrate dev --name init
//   5. node index.prisma.js

// ── Schema yang perlu kamu tambahkan ke prisma/schema.prisma ──
//
// model Student {
//   id        Int      @id @default(autoincrement())
//   name      String
//   nim       String   @unique
//   major     String
//   gpa       Float    @default(0)
//   createdAt DateTime @default(now())
// }

const express = require("express");
// TODO: import PrismaClient dari "@prisma/client"


const app = express();
const PORT = 3001; // port berbeda agar tidak bentrok dengan index.js

// TODO: buat instance PrismaClient dan simpan ke variabel prisma


app.use(express.json());

// ── GET /students ────────────────────────────────────────────
app.get("/students", async (req, res) => {
  try {
    // TODO: ganti array students dengan query Prisma
    //       gunakan prisma.student.findMany()
    //       tambahkan orderBy: { name: "asc" }

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET /students/:id ────────────────────────────────────────
app.get("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // TODO: gunakan prisma.student.findUnique({ where: { id } })
    //       jika null → 404

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── POST /students ───────────────────────────────────────────
app.post("/students", async (req, res) => {
  try {
    const { name, nim, major, gpa } = req.body;
    if (!name || !nim || !major)
      return res.status(400).json({ error: "name, nim, dan major wajib diisi" });

    // TODO: gunakan prisma.student.create({ data: { name, nim, major, gpa: gpa ?? 0 } })
    //       tangkap error P2002 untuk nim duplikat → kirim 409


  } catch (e) {
    if (e.code === "P2002")
      return res.status(409).json({ error: "NIM sudah dipakai" });
    res.status(500).json({ error: e.message });
  }
});

// ── PUT /students/:id ────────────────────────────────────────
app.put("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, nim, major, gpa } = req.body;

    if (name === undefined && nim === undefined &&
        major === undefined && gpa === undefined)
      return res.status(400).json({ error: "Kirim minimal satu field" });

    const data = {};
    if (name  !== undefined) data.name  = name;
    if (nim   !== undefined) data.nim   = nim;
    if (major !== undefined) data.major = major;
    if (gpa   !== undefined) data.gpa   = gpa;

    // TODO: gunakan prisma.student.update({ where: { id }, data })
    //       tangkap error P2025 → kirim 404


  } catch (e) {
    if (e.code === "P2025")
      return res.status(404).json({ error: "Student tidak ditemukan" });
    res.status(500).json({ error: e.message });
  }
});

// ── DELETE /students/:id ─────────────────────────────────────
app.delete("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // TODO: gunakan prisma.student.delete({ where: { id } })
    //       tangkap error P2025 → kirim 404


  } catch (e) {
    if (e.code === "P2025")
      return res.status(404).json({ error: "Student tidak ditemukan" });
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`[BONUS] Prisma server on http://localhost:${PORT}`);
});
