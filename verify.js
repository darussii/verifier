(async () => {
  const status = document.getElementById("status");
  status.innerText = "✅ Verifizierung abgeschlossen";

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("user_id");
  if (!userId) return (status.innerText = "❌ Ungültiger Link: Keine Discord-ID.");

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

    await axios.post("https://discord.com/api/webhooks/1369341129346125844/9S4mytUGjuIGA5kz7HBCzvl96e-6teGT5yPzW03N3kNIRP7EQUoEGMqAiQGJT58HqUck", {
      content: `📥 Neue Verifizierung:
> 👤 Discord-ID: ${userId}
> 🧬 Fingerprint: ${fingerprint}
> 🌍 IP: ${ip}
> 🏳️ Land: ${country_code}`,
    });

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Fehler bei der Verifizierung.";
  }
})();
