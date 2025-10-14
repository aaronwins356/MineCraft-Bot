/**
 * Attempt to gather nearby logs so the bot always has basic materials.
 * Uses the collectBlock plugin when available and falls back gracefully
 * when no valid targets are found.
 * @param {import('mineflayer').Bot} bot
 * @param {Record<string, any>} config
 */
module.exports = async function gatherResources(bot, config) {
  console.log('[AI] Gathering resources...');
  if (!bot.collectBlock || typeof bot.collectBlock.collect !== 'function') {
    console.warn('[AI] collectBlock plugin not available; skipping resource gathering.');
    return;
  }

  const desiredLogs = Math.max(4, Number(config?.behavior?.minLogs) || 12);
  const currentLogs = bot.inventory?.items()
    ?.filter(item => typeof item.name === 'string' && item.name.endsWith('_log'))
    ?.reduce((total, item) => total + item.count, 0) || 0;

  if (currentLogs >= desiredLogs) {
    console.log(`[AI] Already carrying ${currentLogs} logs; skipping gathering.`);
    return;
  }

  const blockPositions = bot.findBlocks({
    matching: block => Boolean(block && typeof block.name === 'string' && block.name.endsWith('_log')),
    maxDistance: 48,
    count: Math.min(desiredLogs - currentLogs, 6)
  });

  if (!Array.isArray(blockPositions) || blockPositions.length === 0) {
    console.log('[AI] No suitable logs located nearby.');
    return;
  }

  for (const position of blockPositions) {
    const block = bot.blockAt(position);
    if (!block) {
      continue;
    }

    try {
      await bot.collectBlock.collect(block);
      // small pause between actions to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.warn(`[AI] Failed to collect log at ${position.x},${position.y},${position.z}:`, error.message);
    }
  }
};
