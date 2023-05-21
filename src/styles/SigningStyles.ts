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

export const SigningUl = styled.ul`
	list-style-type: none;
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	gap: 1vh;
	justify-content: center;
	align-items: flex-start;
`;

export const SigningLi = styled.li`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	gap: 1vw;
`;

export const SigningLogo = styled.img`
	width: 15vw;
	height: 19.875h;
`;

export const InvalidInputMessage = styled.p`
	color: ${ButtonColors.RED};
	font-weight: bold;
`;