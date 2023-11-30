import styled from "styled-components";

export const WelcomePageLogo = styled.img`
	width: 30vw;
	height: 39.75h;
`;

export const WelcomePageContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: center;
	
	padding-top: 5vh;
	
	position: relative;
	z-index: 10;
`;

export const WelcomePageOptions = styled.ul`
	list-style-type: none;
	display: grid;
	grid-template-rows: 12vh 12vh 12vh;
	grid-template-columns: 10vw 10vw 10vw;
`;

const BaseWelcomeLi = styled.li`
	font-size: 2vw;
	justify-self: center;
	align-self: center;
	font-weight: bold;
`;

export type OptionsProps = {
	row: number;
	column: number;
};

export const OptionsPositionedLi = styled(BaseWelcomeLi)<OptionsProps>`
	grid-column: ${(props: OptionsProps) => props.column};
	grid-row: ${(props: OptionsProps) => props.row};
`;
