import styled from "styled-components";
import { ButtonColors, InvalidInputMessage } from "../MainTheme";

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