import styled from "styled-components";
import moon from "../assets/moon.svg";
import sun from "../assets/sun.svg";
import { ButtonColors, Colors, LightTheme } from "./MainTheme";

export type ToggleProps = {
	checked: boolean;
	checkedColor?: ButtonColors | Colors;
	uncheckedColor?: ButtonColors | Colors;
};

export const ToggleContainer = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: center;
	font-weight: normal;
`;

export const StyledToggleLabel = styled.label<ToggleProps>`
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
		top: 2px;
		width: 20px;
		height: 20px;
		background-color: ${(props: ToggleProps) => props.checked ? "#c8c9cc" : "#ffdb0d"};
		background-image: url(${(props: ToggleProps) => (props.checked ? moon : sun)});
		background-size: 19.5px;
		border-radius: 90px;
		transition: 0.3s ease-out;
	}
`;


export const AdaptedToggleLabel = styled(StyledToggleLabel)`
	background: ${(props: ToggleProps) => (props.checked ? props.checkedColor : props.uncheckedColor)};
	// border: 1px solid ${(props) => props.theme.text};

	&:after {
		background-color: ${LightTheme.primary};
		background-image: none;
	}
`;