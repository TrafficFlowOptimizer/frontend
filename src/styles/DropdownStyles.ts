import styled from "styled-components";

export const StyledDropdownContainer = styled.div`
  text-align: left;
  border: 1px solid #ccc;
  position: relative;
  border-radius: 5px;

  margin: 5px;
  margin-bottom: 120px;
`;

export const StyledDropdownInput = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
`;

export const StyledDropdownMenu = styled.div`
  position: absolute;
  transform: translate(-0.4rem, 5rem);
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: auto;
  max-height: 100px;
  background-color: #fff;

  margin-bottom: 4px;
`;

export type DropdownItemProps = {
	isSelected: boolean;
}

export const StyledDropdownItem = styled.div<DropdownItemProps>`
	font-size: 12px;
  padding: 5px;
  cursor: pointer;
  background-color: ${(props) => props.isSelected ? props.theme.secondary : props.theme.primary};
  color: ${(props) => props.theme.text};

  &:hover {
    background-color: ${(props) => props.theme.secondary};
  }
`;

export const StyledSearchBox = styled.div`
  padding: 5px;
  background-color: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.text};
`;

export const StyledSearchBoxInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const StyledDropdownSelectedValue = styled.div`
	font-size: 12px;
`;
