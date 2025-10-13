const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const collectBlock = require('mineflayer-collectblock').plugin;
const toolPlugin = require('mineflayer-tool').plugin;
const config = require('./config.json');
const Controller = require('./controller');

const bot = mineflayer.createBot({
  host: config.server.host,
  port: config.server.port,
  username: 'EnderExpeditionAI',
  auth: config.server.auth,
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

bot.on('kicked', console.log);
bot.on('error', console.log);
