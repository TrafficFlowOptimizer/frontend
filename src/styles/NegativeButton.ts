import styled from "styled-components";
import { BaseButton, ButtonColors } from "./MainTheme";

export const NegativeButton = styled(BaseButton)`
	background-color: ${ButtonColors.RED};
  width: min(max(8vw, 50px), 100px);
  height: min(max(4vw, 25px), 50px);
  padding: initial;
`;
