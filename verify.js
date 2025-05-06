import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";

(async () => {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("user_id");
  const status = document.getElementById("status");

  if (!userId) return status.innerText = "❌ Ungültiger Link: Keine Discord-ID.";

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;
    const ipRes = await axios.get("https://ipapi.co/json/");
    const { ip, country_code } = ipRes.data;

    const allowed = ["DE", "AT", "CH", "FR", "NL", "PL", "SE", "IT", "ES"];
    if (!allowed.includes(country_code)) {
      status.innerText = "❌ Zugriff nur aus Europa erlaubt.";
      return;
    }

    await axios.post("https://your-server.com/api/verify", {
      discord_id: userId,
      fingerprint,
      ip,
      country_code
    });

    status.innerText = "✅ Verifizierung erfolgreich!";
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Fehler bei der Verifizierung.";
  }
})();