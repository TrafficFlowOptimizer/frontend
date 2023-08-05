import styled from "styled-components";
import { ButtonColors } from "./MainTheme";

export const SigningContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: center;
	position: relative;
	top: 20vh;
`;

export const SigningLogo = styled.img`
	width: 15vw;
	height: 19.875h;
`;

export const InvalidInputMessage = styled.p`
	color: ${ButtonColors.RED};
	font-weight: bold;
	font-size: 10px;
`;

export const PlaceholderSpan = styled.span`
	width: 241px;
	height: 32.5px;
`;