import { useState, useCallback, useEffect, useRef } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { invoke } from "@tauri-apps/api/core";

import type {
  UpdateStatus,
  UpdateInfo,
  RollbackInfo,
} from "@/types/updater";

type UseUpdaterReturn = {
  status: UpdateStatus;
  updateInfo: UpdateInfo | null;
  progress: number;
  error: string | null;
  rollbackInfo: RollbackInfo | null;
  checkForUpdates: () => Promise<void>;
  downloadAndInstall: () => Promise<void>;
  rollback: () => Promise<void>;
  clearRollback: () => Promise<void>;
};

export function useUpdater(): UseUpdaterReturn {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [progress, setProgress] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [rollbackInfo, setRollbackInfo] = useState<RollbackInfo | null>(null);

  const updateRef = useRef<Awaited<ReturnType<typeof check>> | null>(null);

  useEffect(() => {
    invoke<RollbackInfo | null>("get_rollback_info")
      .then(setRollbackInfo)
      .catch((e: unknown) =>
        console.warn("[updater] get_rollback_info failed:", e),
      );
  }, []);

  const checkForUpdates = useCallback(async () => {
    setStatus("checking");
    setError(null);
    setUpdateInfo(null);
    updateRef.current = null;

    try {
      const update = await check({
        headers: { Accept: "application/json" },
        timeout: 30,
      });

      if (update) {
        updateRef.current = update;
        setUpdateInfo({
          version: update.version,
          currentVersion: update.currentVersion,
          date: update.date ?? new Date().toISOString(),
          body: update.body ?? "",
        });
        setStatus("available");
      } else {
        setStatus("up-to-date");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, []);

  const downloadAndInstall = useCallback(async () => {
    const update = updateRef.current;
    if (!update) {
      setError("No update available to install.");
      setStatus("error");
      return;
    }

    try {
      setStatus("downloading");
      setProgress(0);
      await invoke("create_rollback_snapshot");

      let contentLength = 0;
      let downloaded = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength ?? 0;
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            if (contentLength > 0) {
              setProgress(Math.round((downloaded / contentLength) * 100));
            }
            break;
          case "Finished":
            setProgress(100);
            break;
        }
      });

      setStatus("ready");

      const info = await invoke<RollbackInfo | null>("get_rollback_info");
      setRollbackInfo(info);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, []);

  const rollback = useCallback(async () => {
    try {
      const restoredVersion = await invoke<string>("apply_rollback");
      setRollbackInfo(null);
      console.info(
        "[updater] Rolled back to version " + restoredVersion + ". Restarting...",
      );
      await invoke("restart_app");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, []);

  const clearRollback = useCallback(async () => {
    try {
      await invoke("clear_rollback");
      setRollbackInfo(null);
    } catch (e) {
      console.warn("[updater] clear_rollback failed:", e);
    }
  }, []);

  return {
    status,
    updateInfo,
    progress,
    error,
    rollbackInfo,
    checkForUpdates,
    downloadAndInstall,
    rollback,
    clearRollback,
  };
}
