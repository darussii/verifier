const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// ⛔ KEIN TOKEN im Code! Hole ihn aus den Umgebungsvariablen
const TOKEN = process.env.TOKEN;

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
