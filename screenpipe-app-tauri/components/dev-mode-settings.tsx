"use client";
import React, { useState } from "react";

import { CodeBlock } from "@/components/ui/codeblock";
import { platform } from "@tauri-apps/plugin-os";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useSettings } from "@/lib/hooks/use-settings";
import { invoke } from "@tauri-apps/api/core";
import { useToast } from "./ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardFooter } from "./ui/card";

import { CliCommandDialog } from "./cli-command-dialog";

const getDebuggingCommands = (os: string | null, dataDir: string) => {
  let cliInstructions = "";

  if (os === "windows") {
    cliInstructions =
      "# 1. Open Command Prompt as admin (search for 'cmd' in the Start menu, right click, 'Run as admin')\n# 2. Navigate to: %LOCALAPPDATA%\\skyprompt\\\n#    Type: cd %LOCALAPPDATA%\\skyprompt\n";
  } else if (os === "macos") {
    cliInstructions =
      "# 1. Open Terminal\n# 2. Navigate to: /Applications/skyprompt.app/Contents/MacOS/\n#    Type: cd /Applications/skyprompt.app/Contents/MacOS/\n";
  } else if (os === "linux") {
    cliInstructions =
      "# 1. Open Terminal\n# 2. Navigate to: /usr/local/bin/\n#    Type: cd /usr/local/bin/\n";
  } else {
    cliInstructions =
      "# OS not recognized. Please check the documentation for your specific operating system.\n";
  }

  const baseInstructions = `# First, view the Skyprompt CLI arguments:
  ${cliInstructions}
  # 3. Run: skyprompt -h
  # 4. Choose your preferred setup and start Skyprompt:
  #    (Replace [YOUR_ARGS] with your chosen arguments)
  #    Example: skyprompt --fps 1 `;

  const logPath =
    os === "windows"
      ? `${dataDir}\\skyprompt.${new Date().toISOString().split("T")[0]}.log`
      : `${dataDir}/skyprompt.${new Date().toISOString().split("T")[0]}.log`;

  const dbPath =
    os === "windows" ? `${dataDir}\\db.sqlite` : `${dataDir}/db.sqlite`;

  const baseCommand =
    baseInstructions +
    dataDir +
    (os === "windows"
      ? `\n\n# We highly recommend adding --ocr-engine windows-native to your command.\n# This will use a very experimental but powerful engine to extract text from your screen instead of the default one.\n# Example: skyprompt --data-dir ${dataDir} --ocr-engine windows-native\n`
      : "") +
    "\n\n# 5. If you've already started Skyprompt, try these debugging commands:\n";

  if (os === "windows") {
    return (
      baseCommand +
      `# Stream the log:
  type "${logPath}"

  # Scroll the logs:
  more "${logPath}"

  # View last 10 frames:
  sqlite3 "${dbPath}" "SELECT * FROM frames ORDER BY timestamp DESC LIMIT 10;"

  # View last 10 audio transcriptions:
  sqlite3 "${dbPath}" "SELECT * FROM audio_transcriptions ORDER BY timestamp DESC LIMIT 10;"`
    );
  } else if (os === "macos" || os === "linux") {
    return (
      baseCommand +
      `# Stream the log:
  tail -f "${logPath}"

  # Scroll the logs:
  less "${logPath}"

  # View last 10 frames:
  sqlite3 "${dbPath}" "SELECT * FROM frames ORDER BY timestamp DESC LIMIT 10;"

  # View last 10 audio transcriptions:
  sqlite3 "${dbPath}" "SELECT * FROM audio_transcriptions ORDER BY timestamp DESC LIMIT 10;"`
    );
  } else {
    return "OS not recognized. \n\nPlease check the documentation for your specific operating system.";
  }
};

export const DevModeSettings = ({ localDataDir }: { localDataDir: string }) => {
  const { settings, updateSettings } = useSettings();
  const handleDevModeToggle = async (checked: boolean) => {
    try {
      updateSettings({ devMode: checked });
    } catch (error) {
      console.error("failed to update dev mode:", error);
      toast({
        title: "error",
        description: "failed to save dev mode setting",
        variant: "destructive",
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartSkyprompt = async () => {
    setIsLoading(true);
    const toastId = toast({
      title: "starting skyprompt",
      description: "please wait...",
      duration: Infinity,
    });
    try {
      await invoke("spawn_skyprompt");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toastId.update({
        id: toastId.id,
        title: "skyprompt started",
        description: "skyprompt is now running.",
        duration: 3000,
      });
    } catch (error) {
      console.error("failed to start skyprompt:", error);
      toastId.update({
        id: toastId.id,
        title: "error",
        description: "failed to start skyprompt.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      toastId.dismiss();
      setIsLoading(false);
    }
  };

  const handleStopSkyprompt = async () => {
    setIsLoading(true);
    const toastId = toast({
      title: "stopping skyprompt",
      description: "please wait...",
      duration: Infinity,
    });
    try {
      await invoke("stop_skyprompt");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toastId.update({
        id: toastId.id,
        title: "skyprompt stopped",
        description: "skyprompt is now stopped.",
        duration: 3000,
      });
    } catch (error) {
      console.error("failed to stop skyprompt:", error);
      toastId.update({
        id: toastId.id,
        title: "error",
        description: "failed to stop skyprompt.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      toastId.dismiss();
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full my-4 flex justify-center">
        <div className="flex-col justify-around space-y-4 w-[40vw]">
          <Card className="p-8 relative">
            <CardContent>
              <div className="flex flex-col ">
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center ">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="dev-mode">enable dev mode</Label>
                            <Switch
                              id="dev-mode"
                              checked={settings.devMode}
                              onCheckedChange={handleDevModeToggle}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            on = use CLI for more control
                            <br />
                            in dev mode, backend won&apos;t
                            <br />
                            auto start when starting the app
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="absolute top-2 right-2">
                    <CliCommandDialog settings={settings} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="relative">
            <Card className="p-8">
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-center w-full">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={handleStopSkyprompt}
                            disabled={isLoading}
                            className="text-xs w-full"
                          >
                            stop
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>stop skyprompt backend</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={handleStartSkyprompt}
                            disabled={isLoading}
                            className="text-xs w-full"
                          >
                            start
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>start skyprompt recording</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground">
                  manually start or stop skyprompt recording
                </p>
                <p className="text-xs text-muted-foreground">
                  (auto started when dev mode is off)
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
