const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// 🔒 HIER DEIN BOT-TOKEN EINSETZEN
const TOKEN = "MTM1OTQ2OTc3NzI4NTkzOTM2MA.GS1UAJ.gFe2KH73ZY1kQyYI043QUNNOug4oNi42VZX_7Y";

// Rollen-IDs
const ROLE_REGELN_ID = '1358529154374439102';
const ROLE_VERIFIED_ID = '1357627445498478603';

client.once('ready', () => {
  console.log(`✅ Bot ist eingeloggt als ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const member = interaction.guild.members.cache.get(interaction.user.id);
  if (!member) return;

  if (interaction.customId === 'regeln_akzeptiert') {
    await member.roles.add(ROLE_REGELN_ID);
    await interaction.reply({ content: '✅ Du hast die Regeln akzeptiert.', ephemeral: true });
  }

  if (interaction.customId === 'verifiziert') {
    await member.roles.add(ROLE_VERIFIED_ID);
    await interaction.reply({ content: '🆔 Du wurdest erfolgreich verifiziert.', ephemeral: true });
  }
});

client.login(TOKEN);
