import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
    autoLockTimeInMinutes: number;
    hiddenTabTimeoutInMinutes: number;
    setAutoLockTimeInMinutes: (minutes: number) => void;
    setHiddenTabTimeoutInMinutes: (minutes: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            autoLockTimeInMinutes: 15,
            hiddenTabTimeoutInMinutes: 5,
            setAutoLockTimeInMinutes: (minutes) => set({ autoLockTimeInMinutes: minutes }),
            setHiddenTabTimeoutInMinutes: (minutes) => set({ hiddenTabTimeoutInMinutes: minutes }),
        }),
        {
            name: "wardpass-settings",
        }
    )
);
