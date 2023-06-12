import styled from "styled-components";

export const NavbarContainer = styled.div`
	background-color: ${(props) => props.theme.secondary};
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	align-items: center;
	gap: 2vw;
	padding: 1vh 0.5vw;
	margin: 1vh 1vw;
	border-radius: 15px;
	border: solid ${(props) => props.theme.text} 1px;
  max-height: 80px;
  font-size: min(1.5vw, 20px);
`;

export const NavbarLogo = styled.img`
	width: 8vw;
  max-width: 150px;
  min-width: 50px;
`;
