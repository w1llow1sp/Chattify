import {create} from "zustand";
interface IUseThemeStore {
    theme: string;
    setTheme(theme: string): void;
}

export  const useThemeStore = create<IUseThemeStore>((set) => ({
    theme:localStorage.getItem('chat-theme') || 'coffee',
    setTheme: (theme: string) => {
        localStorage.setItem('chat-theme', theme);
        set({theme});
    }
}))
