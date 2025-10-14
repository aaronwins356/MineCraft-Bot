/**
 * Convert gathered materials into planks, sticks, and a basic sword when possible.
 * The crafting steps are conservative so the bot keeps enough resources for future tasks.
 * @param {import('mineflayer').Bot} bot
 * @param {Record<string, any>} config
 */
module.exports = async function craftTools(bot, config) {
  console.log('[AI] Crafting tools...');
  if (!bot.registry || typeof bot.recipesFor !== 'function') {
    console.warn('[AI] Crafting not supported by current bot instance.');
    return;
  }

  const { itemsByName } = bot.registry;
  const itemsById = bot.registry.items || bot.registry.itemsArray || [];
  const inventory = bot.inventory;
  if (!inventory) {
    console.warn('[AI] Inventory not available; cannot craft.');
    return;
  }

  const inventoryItems = typeof inventory.items === 'function' ? inventory.items() : [];
  const totalLogs = inventoryItems
    .filter(item => typeof item.name === 'string' && item.name.endsWith('_log'))
    .reduce((total, item) => total + item.count, 0);

  const countItem = (itemId) => {
    if (typeof inventory.count === 'function') {
      return inventory.count(itemId, null);
    }
    return inventoryItems.filter(item => item.type === itemId).reduce((total, item) => total + item.count, 0);
  };

  // Convert logs into planks when we have any spare logs
  if (totalLogs > 0 && itemsByName.oak_planks) {
    const plankTarget = itemsByName.oak_planks;
    const recipes = bot.recipesFor(plankTarget.id, null, 1, null);
    const logRecipe = recipes.find(recipe => recipe.ingredients.some(choice => choice.some(ingredient => {
      if (!ingredient || typeof ingredient.id !== 'number') {
        return false;
      }
      const ingredientItem = itemsById[ingredient.id];
      const ingredientName = ingredientItem?.name || '';
      return ingredientName.endsWith('_log');
    })));

    if (logRecipe) {
      try {
        await bot.craft(logRecipe, totalLogs, null);
        console.log(`[AI] Crafted planks using ${totalLogs} logs.`);
      } catch (error) {
        console.warn('[AI] Unable to craft planks:', error.message);
      }
    }
  }

  const plankTarget = itemsByName.oak_planks;
  const stickTarget = itemsByName.stick;

  if (!plankTarget || !stickTarget) {
    console.warn('[AI] Missing crafting targets for planks or sticks.');
    return;
  }

  const planksAvailable = countItem(plankTarget.id);
  const desiredStickCrafts = Math.min(Math.floor(planksAvailable / 2), 4);

  if (desiredStickCrafts > 0) {
    const stickRecipes = bot.recipesFor(stickTarget.id, null, 1, null);
    if (stickRecipes.length > 0) {
      try {
        await bot.craft(stickRecipes[0], desiredStickCrafts, null);
        console.log(`[AI] Crafted ${desiredStickCrafts * 4} sticks.`);
      } catch (error) {
        console.warn('[AI] Unable to craft sticks:', error.message);
      }
    }
  }

  const swordTarget = itemsByName.stone_sword || itemsByName.iron_sword || itemsByName.wooden_sword;
  if (!swordTarget) {
    return;
  }

  const swordAlreadyOwned = inventoryItems.some(item => item.type === swordTarget.id);
  if (swordAlreadyOwned) {
    return;
  }

  const swordRecipes = bot.recipesFor(swordTarget.id, null, 1, null);
  if (swordRecipes.length === 0) {
    return;
  }

  try {
    await bot.craft(swordRecipes[0], 1, null);
    console.log(`[AI] Crafted ${swordTarget.displayName}.`);
  } catch (error) {
    console.warn(`[AI] Unable to craft ${swordTarget.displayName}:`, error.message);
  }
};
