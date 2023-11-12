import styled from "styled-components";

export const StyledEm = styled.em`
	color: ${(props) => props.theme.text};
`;

export const ChosenEm = styled(StyledEm)`
	font-style: normal;
`;

export const SELECT_ITEM_HEIGHT = 48;

export const SELECT_ITEM_PADDING_TOP = 8;

export const SELECT_WIDTH = 400;