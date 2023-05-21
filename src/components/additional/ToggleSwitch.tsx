import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { LightTheme } from "../../styles/MainTheme";
import { useThemeContext } from "../../custom/ThemeContext";
import sun from "../../assets/sun.svg";
import moon from "../../assets/moon.svg";

export function ToggleSwitch() {
	const { theme, setTheme } = useThemeContext();
	const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
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

type ToggleProps = {
	checked: boolean;
};

const ToggleContainer = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: center;
	font-weight: normal;
	font-size: 1.2vw;
`;

const StyledToggleLabel = styled.label<ToggleProps>`
	margin: 1vh 0.5vw 1vh 0.5vw;
	cursor: pointer;
	text-indent: -9999px;
	width: 50px;
	height: 25px;
	background: ${(props: ToggleProps) => (props.checked ? "#003F8A" : "#0375FC")};
	display: block;
	border-radius: 100px;
	position: relative;

	&:after {
		content: "";
		position: absolute;
		left: ${(props: ToggleProps) => (props.checked ? "3px" : "calc(55% - 1.5px)")};
		top: 2.6px;
		width: 20px;
		height: 20px;
		background-color: ${LightTheme.primary};
		background-image: url(${(props: ToggleProps) => (props.checked ? moon : sun)});
		background-size: 19.5px;
		border-radius: 90px;
		transition: 0.3s ease-out;
	}
`;
