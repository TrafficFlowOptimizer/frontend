import styled from "styled-components";
import { ButtonColors, InvalidInputMessage } from "../MainTheme";

export const CreatorInformation = styled.p`
	text-align: center;
`;

export const WorkaroundInnerDiv = styled.div`
	flex: 1;
	height: 520px;
	width: 1250px;
	margin: 10px 0px;
`;

export const BorderedWorkaroundDiv = styled(WorkaroundInnerDiv)`
	flex: 0;
	border: 2px solid ${(props) => props.theme.text};
	width: 1220px;
	height: 510px;
`;

export const CrossroadScreenshot = styled.img`
	width: 1220px;
	height: 520px;
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