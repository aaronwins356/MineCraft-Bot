const { goals } = require('mineflayer-pathfinder');

/**
 * Search for nearby Endermen and engage cautiously. The logic keeps the bot
 * mobile while attempting to attack, and aborts if no targets are available.
 * @param {import('mineflayer').Bot} bot
 * @param {Record<string, any>} config
 */
module.exports = async function huntEndermen(bot, config) {
  console.log('[AI] Hunting Endermen...');
  if (!bot.pathfinder || !goals) {
    console.warn('[AI] Pathfinder plugin not available; cannot hunt.');
    return;
  }

  const target = bot.nearestEntity(entity => entity?.name === 'enderman' && entity.isValid);
  if (!target) {
    console.log('[AI] No Endermen detected nearby.');
    return;
  }

  const followGoal = new goals.GoalFollow(target, 1);
  try {
    bot.pathfinder.setGoal(followGoal, true);
  } catch (error) {
    console.warn('[AI] Unable to follow Enderman:', error.message);
    return;
  }

  const engagementDurationMs = 8000;
  const startTime = Date.now();
  const targetEyeHeight = typeof target.height === 'number' ? target.height * 0.5 : 1.5;

  while (Date.now() - startTime < engagementDurationMs && target.isValid) {
    const distance = bot.entity.position.distanceTo(target.position);
    if (distance <= 3.2) {
      try {
        await bot.lookAt(target.position.offset(0, targetEyeHeight, 0), true);
        bot.attack(target);
      } catch (error) {
        console.warn('[AI] Attack attempt failed:', error.message);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  bot.pathfinder.setGoal(null);
};
