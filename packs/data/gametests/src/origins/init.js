
import { TicksPerSecond, system, world } from "@minecraft/server";

import { openScreenPickerGUI, runDialogueCommand } from "./gui";
import { closeAbilityHotbar } from "./controls";


/**
 * 
 * Begin initialization
 */
const _A = system.run(initialize)

/**
 * 
 * Initializes the player upon
 * joining the world
 */
system.runTimeout(() => {

  world.afterEvents.playerSpawn.subscribe(
    event => {
      const { initialSpawn, player } = event;
      if (!initialSpawn) return

      world.scoreboard.getObjective('gui')?.setScore(player, 0);

      const playerOrigin = player.getTags().find(tag => tag.startsWith(`race_`)) || false;
      const playerClass = player.getTags().find(tag => tag.startsWith(`class_`)) || false;

      player.removeTag('load_failed');

      if (player.hasTag('controls_opened')) closeAbilityHotbar(player)

      if (!playerOrigin) openScreenPickerGUI(player, 'race');
      else if (!playerClass) openScreenPickerGUI(player, 'class');
      else runDialogueCommand(player, 'gui_welcome_screen');
    }
  )

}, TicksPerSecond * 1)

/**
 * 
 * Runs the setup functions in
 * the world if not already
 */
function initialize() {

  world.getAllPlayers().forEach(player => player.removeTag('load_failed'));

  const scoreboard = world.scoreboard.getObjective('index');
  if (scoreboard) return;

  const setupFunctions = [
    'r4isen1920_originspe/init',

    'r4isen1920_originspe/indexc',
    'r4isen1920_originspe/indexr',
    'r4isen1920_originspe/indexs'
  ]

  setupFunctions.forEach(functionName => {
    world.getDimension('overworld').runCommand(`function ${functionName}`)
  })

  system.clearRun(_A)

}
