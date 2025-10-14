const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const collectBlock = require('mineflayer-collectblock').plugin;
const toolPlugin = require('mineflayer-tool').plugin;
const config = require('./config.json');
const Controller = require('./controller');

console.log('[AI] Starting Ender Expedition Bot...');
console.log(`[AI] Using authentication: ${config.server.auth}`);

async function startBot() {
  try {
    const bot = mineflayer.createBot({
      host: config.server.host,
      port: config.server.port,
      username: config.bot.username || 'EnderExpeditionAI',
      auth: config.server.auth || 'microsoft',
      version: config.server.version
    });

    bot.loadPlugin(pathfinder);
    bot.loadPlugin(collectBlock);
    bot.loadPlugin(toolPlugin);

    bot.once('spawn', () => {
      console.log('[EnderExpeditionAI] Spawned successfully.');
      bot.pathfinder.setMovements(new Movements(bot));
      Controller(bot, config);
    });

    bot.on('kicked', reason => {
      console.log('[AI] Kicked:', reason);
    });

    bot.on('error', err => {
      console.error('[AI] Error:', err);
    });

  } catch (err) {
    console.error('[AI] Failed to initialize bot:', err);
  }
}

startBot();
