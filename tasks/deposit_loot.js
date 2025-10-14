const { goals } = require('mineflayer-pathfinder');

/**
 * Move towards the configured base and drop non-essential loot so inventory
 * stays clean. Deposits only occur when the bot is carrying items.
 * @param {import('mineflayer').Bot} bot
 * @param {Record<string, any>} config
 */
module.exports = async function depositLoot(bot, config) {
  console.log('[AI] Depositing loot...');
  if (!bot.pathfinder || typeof bot.pathfinder.goto !== 'function') {
    console.warn('[AI] Pathfinder plugin not available; cannot deposit loot.');
    return;
  }

  const baseSpawn = Array.isArray(config?.base?.spawn) ? config.base.spawn : null;
  if (!baseSpawn) {
    console.log('[AI] No base spawn configured; skipping deposit step.');
    return;
  }

  const [x, y, z] = baseSpawn;
  if ([x, y, z].some(value => typeof value !== 'number')) {
    console.warn('[AI] Invalid base spawn coordinates.');
    return;
  }

  try {
    await bot.pathfinder.goto(new goals.GoalNear(x, y, z, config?.base?.depositRadius || 3));
  } catch (error) {
    console.warn('[AI] Unable to reach base for depositing loot:', error.message);
    return;
  }

  const inventoryItems = typeof bot.inventory?.items === 'function' ? bot.inventory.items() : [];
  const droppableItems = inventoryItems.filter(item => !item.name.includes('sword') && !item.name.includes('pickaxe'));

  for (const item of droppableItems) {
    try {
      await bot.tossStack(item);
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.warn(`[AI] Failed to toss ${item.displayName}:`, error.message);
    }
  }
};
