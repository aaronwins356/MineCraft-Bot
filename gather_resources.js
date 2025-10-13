module.exports = async function (bot, config) {
  console.log('[AI] Gathering resources...');
  const blocks = bot.findBlocks({
    matching: block => block.name.includes('log'),
    maxDistance: 32,
    count: 3
  });
  if (blocks.length === 0) return;
  for (const pos of blocks) {
    await bot.collectBlock.collect(bot.blockAt(pos));
  }
};