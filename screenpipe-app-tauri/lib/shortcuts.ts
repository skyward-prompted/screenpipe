import { invoke } from "@tauri-apps/api/core";
import { Shortcut } from "./hooks/use-settings";

export async function registerShortcuts({
  showSkypromptShortcut,
  disabledShortcuts,
}: {
  showSkypromptShortcut: string;
  disabledShortcuts: Shortcut[];
}) {
  invoke("update_show_skyprompt_shortcut", {
    new_shortcut: showSkypromptShortcut,
    enabled: !disabledShortcuts.includes(Shortcut.SHOW_SKYPROMPT),
  });
}
