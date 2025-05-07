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
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;

    const ipRes = await axios.get("https://ipapi.co/json/");
    const { ip, country_code } = ipRes.data;

    const res = await axios.post("https://dein-server.de/verify-endpoint", {
      discord_id: userId,
      fingerprint,
      ip,
      country_code
    });

    status.innerText = res.data.message;
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Fehler bei der Verifizierung.";
  }
})();
