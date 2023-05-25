import styled from "styled-components";

export const NavbarContainer = styled.div`
	background-color: ${(props) => props.theme.secondary};
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	align-items: center;
	gap: 1vw;
	padding: 1vh 2vw;
	margin: 1vh 2vw;
	border-radius: 25px;
`;

export const NavbarLogo = styled.img`
	width: 8vw;
	height: 10.6h;
`;
