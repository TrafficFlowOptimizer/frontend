import styled from "styled-components";
import { BaseButton, ButtonColors } from "./MainStyles";

export const NeutralNegativeButton = styled(BaseButton)`
	background-color: ${ButtonColors.ORANGE};

	&:hover:enabled {
		background-color: ${ButtonColors.HOVER_ORANGE};
	}
`;

export const NeutralPositiveButton = styled(BaseButton)`
	background-color: ${ButtonColors.BLUE};
	
	&:hover:enabled {
		background-color: ${ButtonColors.HOVER_BLUE};
	}
`;
