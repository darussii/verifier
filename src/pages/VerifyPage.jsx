import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";

export default function VerifyPage() {
  const [status, setStatus] = useState("Lade...");

  useEffect(() => {
    const runVerification = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("user_id");
        if (!userId) {
          setStatus("❌ Ungültiger Link: Keine Discord-ID übergeben.");
          return;
        }

        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const fingerprint = result.visitorId;

        const ipRes = await axios.get("https://ipapi.co/json/");
        const { ip, country_code } = ipRes.data;

        const allowedCountries = [
          "AL","AD","AT","BY","BE","BA","BG","CH","CY","CZ","DE","DK",
          "EE","ES","FI","FR","GB","GR","HR","HU","IE","IS","IT","LT",
          "LU","LV","MC","MD","ME","MK","MT","NL","NO","PL","PT","RO",
          "RS","RU","SE","SI","SK","SM","UA","VA"
        ];

        if (!allowedCountries.includes(country_code)) {
          setStatus("❌ Zugriff nur aus Europa erlaubt.");
          return;
        }

        // ✉️ Webhook senden
        const webhookUrl = "https://discord.com/api/webhooks/1369341129346125844/9S4mytUGjuIGA5kz7HBCzvl96e-6teGT5yPzW03N3kNIRP7EQUoEGMqAiQGJT58HqUck";
        await axios.post(webhookUrl, {
          content: `✅ Neue Verifizierung:\n- Discord ID: \\`${userId}\\`\n- IP: \\`${ip}\\`\n- Land: \\`${country_code}\\`\n- Fingerprint: \\`${fingerprint}\\``
        });

        setStatus("✅ Verifizierung erfolgreich! Du kannst zurück zu Discord.");
      } catch (error) {
        console.error("Verifizierungsfehler:", error);
        setStatus("❌ Fehler bei der Verifizierung. Bitte versuche es später erneut.");
      }
    };

    runVerification();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-2xl font-bold mb-4">🔐 Verifizierung</h1>
      <p className="text-lg bg-white p-6 rounded-xl shadow-md">{status}</p>
    </div>
  );
}
