import express from "express";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "changeme123";
const CONTENT_PATH = path.join(process.cwd(), "content.json");

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

// GET konten untuk frontend
app.get("/api/content", async (req, res) => {
  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    const data = JSON.parse(raw);
    res.json({ ok: true, data });
  } catch (e) {
    res
      .status(500)
      .json({
        ok: false,
        message: "Gagal membaca content.json",
        error: String(e),
      });
  }
});

// Middleware auth sederhana untuk admin
function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"] || req.query.token;
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
  next();
}

// POST simpan konten dari admin panel
app.post("/api/content", requireAdmin, async (req, res) => {
  try {
    const { sections } = req.body || {};
    if (!Array.isArray(sections)) {
      return res
        .status(400)
        .json({ ok: false, message: "Bad payload: sections harus array" });
    }
    // Validasi ringan
    const sanitized = sections.map((s, idx) => ({
      id: Number(idx),
      title: String(s.title ?? "").slice(0, 200),
      body: String(s.body ?? "").slice(0, 5000),
    }));

    await fs.writeFile(
      CONTENT_PATH,
      JSON.stringify({ sections: sanitized }, null, 2),
      "utf-8"
    );
    res.json({ ok: true });
  } catch (e) {
    res
      .status(500)
      .json({ ok: false, message: "Gagal menyimpan", error: String(e) });
  }
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
