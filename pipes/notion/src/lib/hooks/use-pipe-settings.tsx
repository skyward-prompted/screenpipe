import { useState, useEffect } from "react";
import { Settings } from "@/lib/types";
import {
  getSkypromptAppSettings,
  updateSkypromptAppSettings,
} from "../actions/get-skyprompt-app-settings";

const DEFAULT_SETTINGS: Partial<Settings> = {
  prompt: `yo, you're my personal data detective! 🕵

rules for the investigation:
- extract names of people i interact with and what we discussed, when i encounter a person, make sure to extract their name like this [[John Doe]] so it's linked in my notes
- identify recurring topics/themes in my convos, use tags or [[Link them]] to my notes
- spot any promises or commitments made (by me or others)
- catch interesting ideas or insights dropped in casual chat
- note emotional vibes and energy levels in conversations
- highlight potential opportunities or connections
- track project progress and blockers mentioned

style rules:
- keep it real and conversational
- use bullet points for clarity
- include relevant timestamps
- group related info together
- max 4 lines per insight
- no corporate speak, keep it human
- for tags use hyphen between words, no spaces, eg: #my-tag not #my tag nor #myTag nor #my_tag

remember: you're analyzing screen ocr text & audio, etc. from my computer, so focus on actual interactions and content!`,
};

const STORAGE_KEY = "notion-settings";

export function useNotionSettings() {
  const [settings, setSettings] = useState<Partial<Settings> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load skyprompt app settings
      const skypromptSettings = await getSkypromptAppSettings();

      console.log(skypromptSettings);
      // Load notion settings from localStorage
      // const storedSettings = localStorage.getItem(STORAGE_KEY);
      // const notionSettings = storedSettings
      //   ? JSON.parse(storedSettings)
      //   : {
      //       ...(skypromptSettings.customSettings?.notion && {
      //         ...skypromptSettings.customSettings?.notion,
      //       }),
      //     };
      const notionSettings = {
        ...(skypromptSettings.customSettings?.notion && {
          ...skypromptSettings.customSettings?.notion,
        }),
      };

      // Merge everything together
      setSettings({
        ...DEFAULT_SETTINGS,
        ...notionSettings,
        skypromptAppSettings: skypromptSettings,
      });
    } catch (error) {
      console.error("failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      // Split settings
      const { skypromptAppSettings, ...notionSettings } = newSettings;

      // Update notion settings in localStorage
      const mergedNotionSettings = {
        ...DEFAULT_SETTINGS,
        ...notionSettings,
      };

      // Update skyprompt settings if provided
      await updateSkypromptAppSettings({
        ...skypromptAppSettings,
        customSettings: {
          ...skypromptAppSettings?.customSettings,
          notion: notionSettings,
        },
      });

      // localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedNotionSettings));

      // Update state with everything
      setSettings({
        ...mergedNotionSettings,
        skypromptAppSettings:
          skypromptAppSettings || settings?.skypromptAppSettings,
      });
      return true;
    } catch (error) {
      console.error("failed to update settings:", error);
      return false;
    }
  };

  return { settings, updateSettings, loading };
}
