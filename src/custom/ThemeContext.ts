import { createContext, useContext } from "react";

export type ThemeType = "dark" | "light";

export type ThemeGlobalContent = {
	theme: ThemeType;
	setTheme: (t: ThemeType) => void;
};

export const ThemeContext = createContext<ThemeGlobalContent>({
	theme: "light",
	setTheme: (t: ThemeType) => {
		console.log("current type ->", t);
	},
});

export const useThemeContext = () => useContext(ThemeContext);
