import styled from "styled-components";
import { BaseButton, ButtonColors, Colors, InvalidInputMessage } from "../MainTheme";
import Tooltip from "@mui/material/Tooltip";

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
`;


export const AdaptedInvalidInputMessage = styled(InvalidInputMessage)`
	font-size: 1em;
	margin: 5px 0 15px 0;
`;

export const ValidInputMessage = styled(AdaptedInvalidInputMessage)`
	color: ${ButtonColors.GREEN};
`;

export type EEIPointProps = {
	color: ButtonColors | Colors;
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