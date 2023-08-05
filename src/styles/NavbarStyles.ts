import styled from "styled-components";

export const NavbarContainer = styled.div`
	position: sticky;
	top: 1vh;
	z-index: 5;
	background-color: ${(props) => props.theme.secondary};
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: space-between;
	align-items: center;
	gap: 2vw;
	padding: 1vh 0.5vw;
	margin: 1vh 1vw;
	border-radius: 15px;
	border: solid ${(props) => props.theme.text} 1px;
  max-height: 80px;
`;

export const NavbarLogo = styled.img`
  height: 10dvh;
  max-height: 100px;
  min-height: 50px;
`;

export const InsideDiv = styled(NavbarContainer)`
	border: none;
	justify-content: center;
`;
