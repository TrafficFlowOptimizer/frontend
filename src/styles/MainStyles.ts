import styled from "styled-components";
import { Link } from "react-router-dom";

export enum ButtonColors {
	RED = "#db2b39",
	BLUE = "#6d72c3",
	ORANGE = "#f78b00",
	GREEN = "#20bf55"
}

export enum Colors {
	PRIMARY_WHITE = "#FCFAF9",
	PRIMARY_BLACK = "#191516",
	PURPLE = "#8342FB",
	BRIGHT_RED = "#FF1700",
	ORANGY_RED = "#eb5834",
	ORANGE = "#eb8034",
	ORANGY_YELLOW = "#eba834",
	YELLOW = "#ebdb34",
	TOXIC_GREEN = "#d8eb34",
	LIGHT_GREEN = "#aeeb34",
	GREEN = "#83eb34",
	DEEP_GREEN = "#4feb34",
	FOREST_GREEN = "#34eb58",
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
	margin: 1.5vh 1vw;
`;

export const BaseButton = styled.button`
	font-size: 16px;
	color: ${LightTheme.primary};
	width: fit-content;
	height: fit-content;
	padding 1vh 0.5vw 1vh 0.5vw;
	margin: 1vh 0.5vw 1vh 0.5vw;
	border: none;
	border-radius: 5px;
	transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
	&:hover:enabled {
		cursor: pointer;
		z-index: 10;
		transform: scale(1.1);
	}
	
	&:disabled {
		background-color: ${LightTheme.secondary};
		cursor: not-allowed;
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

export const HorizontalBaseForm = styled(BaseForm)`
	flex-direction: row;
`;

export const ButtonsDiv = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: center;
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
	background-color: ${(props) => props.theme.primary};
	color: ${(props) => props.theme.text};
	font-family: ${(props) => props.theme.font};
	font-size: 1em;
`;

export const ContainerDiv = styled.div`
	background-color: ${(props) => props.theme.primary};
	width: 100%;
	height: fit-content;
	
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	
	justify-content: space-evenly;
	align-items: center;
	
	padding: 15px;
`;


export const BaseInput = styled.input`
	padding: 5px;
	border-radius: 5px;
	border: 1px solid ${(props) => props.theme.text};
	background-color: ${(props) => props.theme.primary};
	color: ${(props) => props.theme.text};
	
	&:disabled {
	background-color: ${(props) => props.theme.secondary};
	cursor: not-allowed;
	}
`;

export const BaseUl = styled.ul`
	list-style-type: none;
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	gap: 0.5vh;
	justify-content: center;
	align-items: flex-start;
`;

export const HorizontalBaseUl = styled(BaseUl)`
	flex-direction: row;
	gap: 1vw;
`;

export const BaseLi = styled.li`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	gap: 1vw;
`;

export const CenteredLi = styled(BaseLi)`
	justify-content: center;
`;

export type JustColorProps = {
	color: ButtonColors | Colors;
}

export const InputInformationMessage = styled.p<JustColorProps>`
	color: ${(props) => props.color};
	font-weight: bold;
	font-size: 10px;
`;

export const PlaceholderSpan = styled.span`
	width: 241px;
	height: 40px;
`;


export const HorizontalDiv = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: flex-start;
`;

export type ScrollableProps = {
	height: number;
};

export const ScrollableUl = styled(BaseUl)<ScrollableProps>`
	justify-content: start;
	width: fit-content;
	height: ${(props) => props.height}vh;
	padding: 10px;
	margin: 10px;
	overflow-y: auto;
`;