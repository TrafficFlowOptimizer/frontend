import styled from "styled-components";

export const StyledModal = styled.div`
	box-shadow: 5px 4px 3px 1px ${(props) => props.theme.id === "light" ? "#585858" : "#141413"};
	border-radius: 6px;
	background-color: ${(props) => props.theme.primary};
	padding: 1rem;
	text-align: center;
	width: calc(100% - 40vw);
	height: calc(100% - 20vh);
	z-index: 10;
	position: fixed;
	top: 10vh;
	left: calc(50% - 30vw);

	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	align-items: center;
`;

export const StyledMessageField = styled.p`
	white-space: pre-line;
`;

export const StyledWaitingModal = styled(StyledModal)`
	width: calc(80% - 40vw);
	height: 30%;
	
	left: calc(50% - 20vw);
`;