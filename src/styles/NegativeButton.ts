import styled from "styled-components";
import { BaseButton, ButtonColors } from "./MainStyles";

export const NegativeButton = styled(BaseButton)`
	background-color: ${ButtonColors.RED};
	
	&:hover:enabled {
		background-color: ${ButtonColors.HOVER_RED};
	}
`;
