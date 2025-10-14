const { goals } = require('mineflayer-pathfinder');

/**
 * Follow a configured list of waypoints through the Nether. Each waypoint is
 * approached using the pathfinder so we can reuse the same routine in other worlds.
 * @param {import('mineflayer').Bot} bot
 * @param {Record<string, any>} config
 */
module.exports = async function travelNether(bot, config) {
  console.log('[AI] Traveling through Nether...');
  if (!bot.pathfinder || typeof bot.pathfinder.goto !== 'function') {
    console.warn('[AI] Pathfinder plugin not available; cannot travel.');
    return;
  }

  const waypoints = Array.isArray(config?.netherPath) ? config.netherPath : [];
  if (waypoints.length === 0) {
    console.log('[AI] No Nether waypoints configured.');
    return;
  }

  for (const [index, waypoint] of waypoints.entries()) {
    const [x, y, z] = waypoint;
    if ([x, y, z].some(value => typeof value !== 'number')) {
      continue;
    }

    const goal = new goals.GoalNear(x, y, z, 1);
    try {
      await bot.pathfinder.goto(goal);
      console.log(`[AI] Reached Nether waypoint ${index + 1}/${waypoints.length}.`);
    } catch (error) {
      console.warn(`[AI] Failed to reach Nether waypoint at ${x},${y},${z}:`, error.message);
      break;
    }
  }

  bot.pathfinder.setGoal(null);
};
