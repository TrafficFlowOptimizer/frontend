import styled from "styled-components";
import { ButtonColors } from "./MainTheme";

export const NumericResultsUl = styled.ul`
	list-style-type: none;
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	gap: 3vh;
	justify-content: flex-start;
	align-items: flex-start;
	
	overflow-y: scroll;
`;

export const HeaderInfo = styled.p`
	font-weight: bold;
`;

export const NumericResultsLi = styled.li`
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	align-items: flex-start;
	gap: 0.2vh;
`;

export const NumericResultsPanel = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	align-items: center;
	gap: 10px;
`;

export type SequenceProps = {
	isGreen: boolean;
}

export const StyledSequence = styled.li<SequenceProps>`
	background-color: ${(props) => props.isGreen ? ButtonColors.GREEN : ButtonColors.RED};
	width: 18px;
	height: 18px;
	border-radius: 50%;
	flex-shrink: 0;
	position: relative;
	left: -30px;
`;

export const SequenceContainer = styled(NumericResultsUl)`
	gap: 5px;
	width: 25vw;
	flex-direction: row;
`;