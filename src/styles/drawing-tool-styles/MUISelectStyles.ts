import styled from "styled-components";

export const StyledEm = styled.em`
	color: ${(props) => props.theme.text};
`;

export const ChosenEm = styled(StyledEm)`
	font-style: normal;
`;