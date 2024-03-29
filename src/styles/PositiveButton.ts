import { BaseButton, ButtonColors } from "./MainStyles";
import styled from "styled-components";

export const PositiveButton = styled(BaseButton)`
	background-color: ${ButtonColors.GREEN};
	
	&:hover:enabled {
		background-color: ${ButtonColors.HOVER_GREEN};
	}
`;
