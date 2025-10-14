const tasks = {
  gather: require('./gather_resources'),
  craft: require('./craft_tools'),
  hunt: require('./hunt_endermen'),
  travel: require('./travel_nether'),
  explore: require('./explore_end'),
  deposit: require('./deposit_loot')
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
