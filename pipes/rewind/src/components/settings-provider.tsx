"use client";

import {
	getSkypromptAppSettings,
	updateSkypromptAppSettings,
} from "@/lib/actions/get-skyprompt-app-settings";
import { Settings } from "@skyprompt/js";
import { createContext, ReactNode, useEffect, useState } from "react";

export const SettingsContext = createContext<{
	settings: Partial<Settings> | null;
	loading: boolean;
	updateSettings: (value: Partial<Settings>) => Promise<boolean>;
} | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const [settings, setSettings] = useState<Partial<Settings> | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadSettings();
		console.log("fetched");
	}, []);

	const loadSettings = async () => {
		try {
			// Load skyprompt app settings
			const skypromptSettings = await getSkypromptAppSettings();

			// Merge everything together
			setSettings({
				...skypromptSettings,
			});
		} catch (error) {
			console.error("failed to load settings:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateSettings = async (skypromptAppSettings: Partial<Settings>) => {
		try {
			// Update skyprompt settings if provided
			if (skypromptAppSettings) {
				await updateSkypromptAppSettings({
					...settings,
					...skypromptAppSettings,
				});
			}

			// Update state with everything
			setSettings({
				...skypromptAppSettings,
			});
			return true;
		} catch (error) {
			console.error("failed to update settings:", error);
			return false;
		}
	};

	return (
		<SettingsContext.Provider value={{ settings, loading, updateSettings }}>
			{children}
		</SettingsContext.Provider>
	);
};
