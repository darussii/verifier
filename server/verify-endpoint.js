require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const GUILD_ID = '1357519482075218086';
const VERIFIED_ROLE_ID = '1357627445498478603';

app.use(express.json());

app.post('/verify', async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).send("❌ Kein User-ID übergeben.");

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(userId);

    if (!member) return res.status(404).send("❌ Benutzer nicht gefunden.");
    if (member.roles.cache.has(VERIFIED_ROLE_ID)) {
      return res.status(200).send("⚠️ Benutzer ist bereits verifiziert.");
    }

    await member.roles.add(VERIFIED_ROLE_ID);
    console.log(`✅ Rolle 'VERIFIED' an ${member.user.tag} vergeben.`);
    res.status(200).send("✅ Rolle vergeben.");
  } catch (err) {
    console.error("Fehler beim Verifizieren:", err);
    res.status(500).send("❌ Fehler beim Verifizieren.");
  }
});

client.once('ready', () => {
  console.log(`🤖 Bot eingeloggt als ${client.user.tag}`);
  app.listen(3000, () => {
    console.log("🌐 Express-API läuft auf http://localhost:3000");
  });
});

client.login(process.env.DISCORD_TOKEN);
