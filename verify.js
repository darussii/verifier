(async () => {
  const status = document.getElementById("status");
  status.innerText = "🔍 Verifizierung wird gestartet...";

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("user_id");

  if (!userId) {
    status.innerText = "❌ Ungültiger Link – keine Discord-ID angegeben.";
    return;
  }

  try {
    // FingerprintJS initialisieren
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;

    // IP und Länderkennung abrufen
    const ipRes = await axios.get("https://ipapi.co/json/");
    const { ip, country_code } = ipRes.data;

    const allowedCountries = ["DE", "AT", "CH", "FR", "NL", "PL", "SE", "IT", "ES"];
    if (!allowedCountries.includes(country_code)) {
      status.innerText = "❌ Zugriff nur aus bestimmten Ländern erlaubt.";
      return;
    }

    // Lokale Duplikatsprüfung (optional, rein clientseitig!)
    const usedFingerprints = JSON.parse(localStorage.getItem("usedFingerprints") || "[]");
    const isDuplicate = usedFingerprints.includes(fingerprint);

    if (!isDuplicate) {
      usedFingerprints.push(fingerprint);
      localStorage.setItem("usedFingerprints", JSON.stringify(usedFingerprints));
    }

    // Webhook an Discord senden
    await axios.post("https://discord.com/api/webhooks/1369341129346125844/9S4mytUGjuIGA5kz7HBCzvl96e-6teGT5yPzW03N3kNIRP7EQUoEGMqAiQGJT58HqUck", {
      content: `${isDuplicate ? "⚠️ **Doppelter Fingerprint!**\n" : ""}📥 Neue Verifizierung:
> 👤 Discord-ID: ${userId}
> 🧬 Fingerprint: ${fingerprint}
> 🌍 IP: ${ip}
> 🏳️ Land: ${country_code}`
    });

    status.innerText = isDuplicate
      ? "⚠️ Verifiziert – Fingerprint mehrfach erkannt!"
      : "✅ Verifizierung abgeschlossen.";

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Fehler bei der Verifizierung. Bitte erneut versuchen.";
  }
})();
