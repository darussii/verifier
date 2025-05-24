(async () => {
  const status = document.getElementById("status");
  status.innerText = "🔍 Verifizierung wird gestartet...";

  const params = new URLSearchParams(window.location.search);
  const userId = params.get("user_id");

  if (!userId) {
    status.innerText = "❌ Ungültiger Link – keine Discord-ID.";
    return;
  }

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const components = result.components;

    const fullFingerprint = {
      visitorId: result.visitorId,
      userId,
      platform: components.platform?.value || "unbekannt",
      userAgent: components.userAgent?.value || "unbekannt",
      screenRes: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const res = await axios.post("/.netlify/functions/verify", fullFingerprint);

    status.innerText = res.data.message || "✅ Verifizierung abgeschlossen!";
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Fehler bei der Verifizierung.";
  }
})();
