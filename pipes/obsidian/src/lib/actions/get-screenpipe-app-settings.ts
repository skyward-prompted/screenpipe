"use server";

import { pipe } from "@skyprompt/js";
import type { Settings as SkypromptAppSettings } from "@skyprompt/js";

export async function getSkypromptAppSettings() {
  return await pipe.settings.getAll();
}

export async function updateSkypromptAppSettings(
  newSettings: Partial<SkypromptAppSettings>
) {
  return await pipe.settings.update(newSettings);
}
