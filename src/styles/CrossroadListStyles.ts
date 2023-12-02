import styled from "styled-components";

export const StyledTableHeader = styled.th`
	font-weight: bolder;
	position: sticky;
	
	width: auto;
	height: 2vh;
	
	border: 3px solid ${(props) => props.theme.text};
	background-color: ${(props) => props.theme.primary};
`;

export const StyledTable = styled.table`
	width: 90vw;
	height: fit-content;
	max-height: 60vh;
	overflow: scroll;
	
	border-collapse: collapse;
	border: 1px solid ${(props) => props.theme.text};
`;

export type TrProps = {
	chosen: boolean;
};

export const StyledItemTr = styled.tr<TrProps>` 
	background-color: ${(props) => props.chosen ? props.theme.secondary : props.theme.primary};
`;

export const StyledItemTd = styled.td`
	height: 8vh;
	width: 15vw;
	padding: 5px;
	text-align: center;
	
	border-top: 1px solid ${(props) => props.theme.text};
	border-bottom: 1px solid ${(props) => props.theme.text};
`;