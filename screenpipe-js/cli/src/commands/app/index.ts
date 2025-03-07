import { Command } from "commander";
import { createAppCommand } from "./create";

export const appCommands = new Command()
  .name("app")
  .description("create a new skyprompt application using default templates")

appCommands.addCommand(createAppCommand)