import styled from "styled-components";
import { BaseButton, ButtonColors, Colors, InputInformationMessage, LightColors } from "../MainStyles";
import Tooltip from "@mui/material/Tooltip";
import { EEIPointOffset } from "../../custom/drawing-tool/AuxiliaryData";

export const CreatorInformation = styled.p`
	text-align: center;
`;

export const WorkaroundInnerDiv = styled.div`
	flex: 1;
	height: 560px;
	width: 1250px;
	margin: 0px 0px;
`;

export const BorderedWorkaroundDiv = styled(WorkaroundInnerDiv)`
	flex: 0;
	border: 2px solid ${(props) => props.theme.text};
	width: 1220px;
	height: 560px;
	position: relative;
`;

export const CrossroadScreenshot = styled.img`
	width: 1220px;
	height: 560px;
	object-fit: cover;
	flex: 0;
	z-index: 2;
`;


export const AdaptedInputInformationMessage = styled(InputInformationMessage)`
	font-size: 1em;
	margin: 5px 0 15px 0;
`;

export type EEIPointProps = {
	color: ButtonColors | Colors | LightColors;
	xCord: number;
	yCord: number;
}

export const EEIPointMarker = styled.div<EEIPointProps>`
	width: 15px;
	height: 15px;
	border: 1px solid black;
	border-radius: 50%;
	
	z-index: 4;
	position: absolute;
	top: ${(props: EEIPointProps) => props.yCord}px;
	left: ${(props: EEIPointProps) => props.xCord}px;
	
	background-color: ${(props: EEIPointProps) => props.color};
`;

export const EEIPointTooltip = styled(Tooltip)<EEIPointProps>`
	z-index: 4;
	position: absolute;
	top: ${(props: EEIPointProps) => props.yCord};
	left: ${(props: EEIPointProps) => props.xCord};
`;


export const TooltipButton = styled(BaseButton)<EEIPointProps>`
	font-size: 10px;
	padding 0.5vh 0.25vw;
	margin: 0.5vh 0.25vw;
	background-color: ${(props) => props.color};
`;

export type ConnectionLineProps = {
	thickness: number;
	length: number;
	angle: number;
	centerX: number;
	centerY: number;
	color: Colors | ButtonColors;
}

export const ConnectionLine = styled.div<ConnectionLineProps>`
	x-index: 3;
	padding: 0px; 
	margin: 0px; 
	height: ${(props:ConnectionLineProps) => props.thickness}px; 
	background-color: ${(props) => props.color};
	border: 1px solid ${Colors.PRIMARY_BLACK};
	line-height: 1px; 
	position: absolute; 
	left: ${(props:ConnectionLineProps) => props.centerX + EEIPointOffset}px; 
	top: ${(props:ConnectionLineProps) => props.centerY + EEIPointOffset}px;
	width: ${(props:ConnectionLineProps) => props.length}px;
	-moz-transform:rotate(${(props:ConnectionLineProps) => props.angle}deg);
	-webkit-transform:rotate(${(props:ConnectionLineProps) => props.angle}deg);
	-o-transform:rotate(${(props:ConnectionLineProps) => props.angle}deg);
	-ms-transform:rotate(${(props:ConnectionLineProps) => props.angle}deg); 
	transform:rotate(${(props:ConnectionLineProps) => props.angle}deg);
`;