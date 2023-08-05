import styled from "styled-components";
import { Link } from "react-router-dom";

export enum ButtonColors {
	RED = "#db2b39",
	BLUE = "#6d72c3",
	ORANGE = "#f78b00",
	GREEN = "#20bf55"
}

export const LightTheme = {
	id: "light",
	primary: "#FCFAF9",
	text: "#191516",
	secondary: "#dfe0e6",
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

export const PageHeader = styled.h1`
	font-weight: bold;
	font-size: xx-large;;
	margin: 1vh 1vw;
`;

export const BaseButton = styled.button`
	font-size: 16px;
	color: ${LightTheme.primary};
	width: fit-content;
	height: fit-content;
	padding 1vh 0.5vw 1vh 0.5vw;
	margin: 1vh 0.5vw 1vh 0.5vw;
	border: none;
	border-radius: 12px;
	transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
	&:hover:enabled {
		cursor: pointer;
		z-index: 10;
		transform: scale(1.1);
		box-shadow: 5px 4px 3px 1px ${(props) => props.theme.id === "light" ? "#585858" : "#141413"};
	}
	
	&:disabled {
		background-color: ${LightTheme.secondary};
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
	font-size: 16px;
	color: ${LightTheme.primary};
`;

export const RedirectionLink = styled(Link)`
	text-decoration: underline;
	font-size: 16px;
	color: ${(props) => props.theme.text};
`;

export const BaseDiv = styled.div`
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	//padding-left: 15px;
	//padding-right: 15px;
	background-color: ${(props) => props.theme.primary};
	color: ${(props) => props.theme.text};
	font-family: ${(props) => props.theme.font};
	font-size: 1em;
`;


export const BaseInput = styled.input`
	padding: 5px;
	border-radius: 5px;
	border: 1px solid ${(props) => props.theme.text};
	background-color: ${(props) => props.theme.primary};
	color: ${(props) => props.theme.text};
`;

export const BaseUl = styled.ul`
	list-style-type: none;
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	gap: 1vh;
	justify-content: center;
	align-items: flex-start;
`;

export const BaseLi = styled.li`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	gap: 1vw;
`;