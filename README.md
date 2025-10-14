# EnderExpeditionAI

EnderExpeditionAI is a scripted Minecraft automation bot built on top of [mineflayer](https://github.com/PrismarineJS/mineflayer). The bot follows a repeatable expedition loop that gathers resources, crafts tools, hunts Endermen, travels through the Nether, explores the End, and finally deposits loot back at base. This repository includes all of the task logic and configuration necessary to connect the bot to your server and supervise the full expedition lifecycle.

## Features

- **Structured expedition loop** – The controller coordinates gathering, crafting, combat, travel, exploration, and deposit tasks in sequence.
- **Pathfinding and block collection** – Uses the `mineflayer-pathfinder`, `mineflayer-collectblock`, and `mineflayer-tool` plugins for safe navigation and automated harvesting.
- **Configurable waypoints** – Customize base coordinates, Nether paths, and End portal locations through `config.json`.
- **Behavior toggles** – Tune expedition difficulty, daylight usage, and block preferences without changing code.

## Prerequisites

1. **Minecraft Java Edition server access**
   - The bot can connect to any reachable Java server (vanilla or modded) that allows bot accounts.
   - Ensure the account you plan to use has permission to join the server.
2. **Node.js 18 LTS or newer**
   - Mineflayer and its plugins require a modern Node.js runtime. Install from [nodejs.org](https://nodejs.org/).
3. **npm** (bundled with Node.js) for dependency management.
4. **Microsoft account credentials** (if `auth` is set to `"microsoft"`). The login flow opens a device-code prompt in your browser when the bot starts. Offline servers can instead use `"offline"` auth.

## Repository Structure

```text
index.js           # Entry point: creates the bot and loads plugins
controller.js      # Main control loop coordinating the expedition tasks
config.json        # Server connection details and expedition waypoints
/tasks             # Individual task modules (gathering, crafting, hunting, travel, exploration, deposit)
```

## Configuration

All runtime settings are stored in `config.json`. Adjust the following sections before launching the bot:

### `server`

| Key      | Description                                                                                 |
|----------|---------------------------------------------------------------------------------------------|
| `host`   | Hostname or IP address of the Minecraft server.                                             |
| `port`   | Server port (default Java server port is `25565`).                                          |
| `version`| Minecraft protocol version string (e.g., `"1.21.1"`).                                      |
| `auth`   | Authentication mode. Use `"microsoft"` for official accounts or `"offline"` for cracked/offline servers. |

> **Note:** The bot username is currently set in `index.js`. Update the `username` field there to match your Microsoft account email or the offline name you want the bot to use.

### `base`

Defines the primary base location and the radius used when depositing loot.

### `netherPath`

An ordered list of coordinates the bot follows when traversing the Nether.

### `end`

Coordinates for the End gateway and portal room so the bot can navigate the final dimension.

### `behavior`

Flags that influence expedition decisions, such as difficulty level, whether to prefer daytime operations, and the block type used when bridging gaps.

You can add additional custom settings to the `behavior` block—each task receives the `config` object and can read the values you introduce.

## Installation

Clone the repository and install the dependencies once your configuration is prepared:

```bash
git clone https://github.com/your-user/MineCraft-Bot.git
cd MineCraft-Bot
npm install
```

## Launching the Bot

1. Confirm `config.json` reflects the server and waypoint information you intend to use.
2. (Optional) If using Microsoft authentication, sign out of other Microsoft Launcher sessions to avoid token conflicts.
3. Start the bot with npm:

   ```bash
   npm start
   ```

4. Follow the on-screen instructions for Microsoft device-code login if prompted. Once authenticated, the bot will spawn, initialize its pathfinding movements, and begin executing the expedition loop.

### Runtime Monitoring

- The console logs every phase transition (e.g., "Gathering resources", "Crafting tools") and will report warnings if a plugin is unavailable or an action fails.
- Any unhandled errors inside the loop are printed with stack traces so you can diagnose connectivity or logic issues.
- The loop restarts automatically every 10 seconds. Stop the bot at any time with `Ctrl+C`.

## Troubleshooting

| Symptom | Possible Cause & Fix |
|---------|----------------------|
| Bot is immediately kicked | Verify the server allows bot connections, and check the `auth` mode and username/email. |
| Bot cannot find logs or crafting recipes | Confirm the bot spawned in the expected location and that the world contains the required resources. |
| Login loop or auth failure | Delete cached tokens in `.minecraft` (if any) and retry the Microsoft device-code login, or switch to `"offline"` for private servers. |
| Pathfinding errors | Ensure the coordinate waypoints in `config.json` are accurate for your world seed and that the bot has the right to place/destroy blocks along the route. |

## Extending the Expedition

Each task module under `tasks/` exports an asynchronous function with the signature `(bot, config)`. To add new behavior:

1. Create a new file in `tasks/` and export your task logic.
2. Register the task in `controller.js` within the `tasks` object and add it to the `mainLoop` sequence.
3. Leverage existing plugins (`collectBlock`, `pathfinder`, `mineflayer-tool`) for movement and interaction.

This modular approach keeps strategies independently testable and easy to maintain.

## Support

If you encounter issues or want to contribute improvements, please open an issue or submit a pull request describing the changes. For authentication or protocol errors, consult the official [mineflayer documentation](https://github.com/PrismarineJS/mineflayer#readme) and Minecraft server logs.

