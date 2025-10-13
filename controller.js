const tasks = {
  gather: require('./tasks/gather_resources'),
  craft: require('./tasks/craft_tools'),
  hunt: require('./tasks/hunt_endermen'),
  travel: require('./tasks/travel_nether'),
  explore: require('./tasks/explore_end'),
  deposit: require('./tasks/deposit_loot')
};

module.exports = async function (bot, config) {
  console.log('[AI] Controller online.');
  async function mainLoop() {
    try {
      await tasks.gather(bot, config);
      await tasks.craft(bot, config);
      await tasks.hunt(bot, config);
      await tasks.travel(bot, config);
      await tasks.explore(bot, config);
      await tasks.deposit(bot, config);
    } catch (err) {
      console.log('[AI] Error:', err);
    }
    setTimeout(mainLoop, 10000);
  }
  mainLoop();
};
