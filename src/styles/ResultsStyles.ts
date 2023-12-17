import styled from "styled-components";
import { ButtonColors, Colors, DarkTheme } from "./MainStyles";

export const ResultsUl = styled.ul`
	list-style-type: none;
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	gap: 2vh;
	justify-content: flex-start;
	align-items: flex-start;	
	width: 90%
	height: 80vh;
	padding: 1vh 1vw;
`;


export type CustomProps = {
	topMargin: number;
	leftMargin?: number;
	fontWeight?: "bold";
};

export const ResultsInfoParagraph = styled.p<CustomProps>`
  font-weight: ${(props) => props.fontWeight ?? "normal"};
  margin: ${(props) => `${props.topMargin}px ${props.leftMargin ?? 15}px 15px ${props.leftMargin ?? 0}px`};
`;

export const ResultsLi = styled.li`
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	align-items: flex-start;
	
	width: calc(100% - 0.5vw);
	background-color: ${(props) => props.theme.secondary};
	border-radius: 15px;
	border: solid ${(props) => props.theme.text} 1px;
`;

export const ResultsPanel = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	align-items: center;
	
	margin: 0px 15px;
`;

export const LightResultsPanel = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: flex-start;
	margin: 5px 15px 10px 15px;
	border-radius: 15px;
	border: solid ${(props) => props.theme.text} 1px;
	padding: 10px;
	width: calc(100% - 55px);
`;

export const SingleInfoPanel = styled(ResultsPanel)`
	margin: 0px;
`;

export type SequenceProps = {
	isGreen: boolean;
}

export const StyledSequence = styled.li<SequenceProps>`
	background-color: ${(props) => props.isGreen ? ButtonColors.GREEN : ButtonColors.RED};
	width: 18px;
	height: 18px;
	border-radius: 50%;
	flex-shrink: 0;
	position: relative;
	
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	cursor: default;
`;

export const SequenceIndex = styled.p`
	color: ${DarkTheme.text};
	font-size: 11px;
`;

export const SequenceContainer = styled(ResultsUl)`
	gap: 5px;
	margin: 0px 0px 5px 5px;
	width: calc(100dvw - 120px);
	flex-direction: row;
	overflow-x: auto;
	padding: 0px 0px 5px 5px;
`;

export const SimulationNumbers = styled.h4`
	-webkit-text-stroke: 1px black; /* width and color */
	line-height: 0.5;
	color: white;
	position: relative;
	top: 10px;
	left: 100%;

	z-index: 2;
`;

export type EEIBorderProps = {
	width: number;
	xCord: number;
	yCord: number;
}

export const EEIBorderMarker = styled.div<EEIBorderProps>`
	width: ${(props: EEIBorderProps) => props.width}px;
	height: 25px;
	border: 3px solid black;
	border-radius: 0%;
	background-color: #aaaaaa;

	position: absolute;
	top: ${(props: EEIBorderProps) => props.yCord - 8}px;
	left: ${(props: EEIBorderProps) => props.xCord}px;
`;

export const SimulationVersionLabel = styled.div`
	width: fit-content;
	height: fit-content;
	background-color: ${Colors.PRIMARY_WHITE};
	border: 3px solid ${Colors.PRIMARY_BLACK};
	position: absolute;
	z-index: 2;
	left: 0%;
	top: 0%;
	padding: 0px 5px;
`;
export const SimulationVersion= styled.p`
	text-align: center;
	font-weight: bold;
`;
