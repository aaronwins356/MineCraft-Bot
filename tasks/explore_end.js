const { goals } = require('mineflayer-pathfinder');

/**
 * Travel to configured End POIs and keep scouting the surrounding area.
 * @param {import('mineflayer').Bot} bot
 * @param {Record<string, any>} config
 */
module.exports = async function exploreEnd(bot, config) {
  console.log('[AI] Exploring the End...');
  if (!bot.pathfinder || typeof bot.pathfinder.goto !== 'function') {
    console.warn('[AI] Pathfinder plugin not available; cannot explore.');
    return;
  }

  const destinations = [];
  if (Array.isArray(config?.end?.gateway)) {
    destinations.push(config.end.gateway);
  }
  if (Array.isArray(config?.end?.portalRoom)) {
    destinations.push(config.end.portalRoom);
  }

  if (destinations.length === 0) {
    console.log('[AI] No End exploration targets configured.');
    return;
  }

  for (const [index, coords] of destinations.entries()) {
    const [x, y, z] = coords;
    if ([x, y, z].some(value => typeof value !== 'number')) {
      continue;
    }

    try {
      await bot.pathfinder.goto(new goals.GoalNear(x, y, z, 2));
      console.log(`[AI] Surveyed End location ${index + 1}/${destinations.length}.`);
    } catch (error) {
      console.warn(`[AI] Failed to explore End location at ${x},${y},${z}:`, error.message);
    }
  }

  bot.pathfinder.setGoal(null);
};
