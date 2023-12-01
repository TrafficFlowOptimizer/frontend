import styled from "styled-components";
import { ButtonColors, DarkTheme, LightTheme } from "./MainStyles";

export const RadioButtonWrapper = styled.div`
   display: flex;
   gap: 0.5rem;
   align-items: center;
`;

export const Radio = styled.input`
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  width: 1.5em;
  height: 1.5em;
  border: 2px solid ${(props) => props.theme.text};
  border-radius: 50%;
  transition: all 0.1s ease-in-out;
  ::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 0.75em;
    height: 0.75em;
    margin: 21%;
  }
  :checked {
    ::after {
      background-color: ${(props) => props.theme.text};
    }
    :hover {
      background-color: ${(props) => props.theme.secondary};
      border: 2px solid ${(props) => props.theme.text};
      ::after {
        background-color: ${(props) => props.theme.text};
      }
    }
  }
  :focus {
    outline: 2px solid ${ButtonColors.ORANGE};
  }
  :hover {
  	background-color: ${(props) => props.theme.secondary};
    ::after {
      background-color: ${(props) => props.theme.id === "light" ? DarkTheme.secondary : LightTheme.secondary};
    }
  }
`;

export const GroupFieldset = styled.fieldset`
  border: none;
`;

export const GroupWrapper = styled.div`
   display: grid;
   gap: 1rem;
   padding: 0.5rem;
`;