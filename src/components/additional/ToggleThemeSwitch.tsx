import React from "react";
import { useThemeContext } from "../../custom/ThemeContext";
import { StyledToggleLabel, ToggleContainer } from "../../styles/ToggleStyles";

export function ToggleThemeSwitch() {
	const { theme, setTheme } = useThemeContext();
	const handleOnChange = () => {
		if (theme === "light") {
			setTheme("dark");
		} else {
			setTheme("light");
		}
	};
	return (
		<ToggleContainer>
			<p>Theme:</p>
			<StyledToggleLabel htmlFor="checkbox" checked={theme !== "light"}>
				toggle me
				<input
					id="checkbox"
					type="checkbox"
					checked={theme !== "light"}
					onChange={handleOnChange}
				/>
			</StyledToggleLabel>
		</ToggleContainer>
	);
}
