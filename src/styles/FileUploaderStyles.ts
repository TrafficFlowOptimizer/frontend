import styled from "styled-components";
import { ButtonColors } from "./MainTheme";

export const MainUploaderDiv = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: center;
	gap: 3vh;
	margin: 10px;
`;

export const UploaderForm = styled.form`
  height: 80%;
  width: 50%;
  max-width: 100%;
  text-align: center;
`;

export const FormGroupFiles = styled(MainUploaderDiv)`
	padding: 10px;
	margin: 0;
`;

export const DragFileElement = styled.div`
	position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

export const UploadButton = styled.button`
	cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.text};
  
  &:hover {
  	text-decoration-line: underline;
	}
`;

export const FormFileInput = styled.input`
	display: none;
`;

export type LabelProps = {
	dragActive: boolean;
}
export const UploaderLabel = styled.label<LabelProps>`
	height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 1rem;
  border-style: dashed;
  border-color: ${(props) => props.theme.text};
  background-color: ${(props) => props.dragActive ? ButtonColors.BLUE :props.theme.secondary};
`;