import { Client, GatewayIntentBits } from 'discord.js';
import { Worker } from 'node:worker_threads';
import path from 'node:path';

const worker = new Worker(path.resolve(__dirname, 'message-worker.js'));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  worker.postMessage({
    id: message.id,
    channelId: message.channelId,
    content: message.content,
  });
});

worker.on('message', async (action) => {
  const channel = await client.channels.fetch(action.channelId);
  if (!channel?.isTextBased() || !('messages' in channel)) return;

  if (action.delete) {
    const msg = await channel.messages.fetch(action.messageId).catch(() => null);
    await msg?.delete().catch(() => {});
  }
  if (action.reply) await channel.send(action.reply);
});

client.login(process.env.DISCORD_TOKEN);
