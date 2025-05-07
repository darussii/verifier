const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const knownFingerprints = new Set();

app.post("/verify", (req, res) => {
  const { discord_id, fingerprint, ip, country_code } = req.body;

  if (knownFingerprints.has(fingerprint)) {
    return res.status(409).json({ message: "⚠️ Fingerprint wurde bereits verwendet." });
  }

  knownFingerprints.add(fingerprint);

  const axios = require("axios");
  axios.post("https://discord.com/api/webhooks/DEIN_WEBHOOK_URL", {
    content: `📥 Neue Verifizierung:
> 👤 Discord-ID: ${discord_id}
> 🧬 Fingerprint: ${fingerprint}
> 🌍 IP: ${ip}
> 🏳️ Land: ${country_code}`,
  });

  res.json({ message: "✅ Verifizierung erfolgreich" });
});

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
