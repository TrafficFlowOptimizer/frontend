import styled from "styled-components";

export const NavbarContainer = styled.div`
	position: sticky;
	top: 0vh;
	z-index: 5;
	background-color: ${(props) => props.theme.secondary};
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: space-between;
	align-items: center;
	gap: 2vw;
	padding: 0vh 20px;
	padding-bottom: 1vh;
	padding-top: 1.5vh;
	margin-bottom: 1vh;
	border-bottom: solid ${(props) => props.theme.text} 1px;
  max-height: 80px;  
  width: 100vw;
  box-sizing: border-box;
`;

export const NavbarLogo = styled.img`
  height: 10dvh;
  max-height: 100px;
  min-height: 50px;
`;

export const InsideDiv = styled(NavbarContainer)`
	width: fit-content;
	height: auto;
	border: none;
	justify-content: center;
`;
