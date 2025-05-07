(async () => {
  const status = document.getElementById("status");
  status.innerText = "🔍 Verifizierung wird gestartet...";

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("user_id");

  if (!userId) return (status.innerText = "❌ Ungültiger Link!");

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const components = result.components;

    const fullFingerprint = {
      visitorId: result.visitorId,
      userId,
      platform: components.platform?.value,
      userAgent: components.userAgent?.value,
      screenRes: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const res = await axios.post("http://<DEINE_SERVER_IP_ODER_DOMAIN>:8131/verify", fullFingerprint);

    status.innerText = res.data.message || "✅ Verifizierung abgeschlossen!";
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Fehler bei der Verifizierung.";
  }
})();
