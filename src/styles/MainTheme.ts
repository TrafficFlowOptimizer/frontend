import styled from "styled-components";
import { Link } from "react-router-dom";

export const LightTheme = {
	id: "light",
	primary: "#FCFAF9",
	text: "#191516",
	secondary: "#c9c8c7",
	font: "Verdana, sans-serif",
};

export const DarkTheme = {
	id: "dark",
	primary: "#191516",
	text: "#FCFAF9",
	secondary: "#464344",
	font: "Verdana, sans-serif",
};

export const BaseH1 = styled.h1`
	font-size: 3em;
`;

export const BaseButton = styled.button`
	font-size: 1vw;
	color: ${LightTheme.primary};
	width: fit-content;
	height: fit-content;
	padding 1vh 0.5vw 1vh 0.5vw;
	margin: 1vh 0.5vw 1vh 0.5vw;
	border: none;
	border-radius: 12px;
	transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
	&:hover {
		cursor: pointer;
		z-index: 10;
		transform: scale(1.1);
		box-shadow: 5px 4px 3px 1px ${(props) => props.theme.id === "light" ? "#585858" : "#141413"};
	}
`;

export const BaseForm = styled.form`
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: center;
	gap: 1vh;
`;

export const BaseButtonLink = styled(Link)`
	text-decoration: none;
	font-size: 1.25em;
	color: ${LightTheme.primary};
`;

export const BaseDiv = styled.div`
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	padding-left: 15px;
	padding-right: 15px;
	overflow: clip;
	background-color: ${(props) => props.theme.primary};
	color: ${(props) => props.theme.text};
	font-family: ${(props) => props.theme.font};
	font-size: 1em;
`;
