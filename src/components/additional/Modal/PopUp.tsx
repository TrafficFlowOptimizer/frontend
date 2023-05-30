import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../../../custom/ThemeContext";
import { DarkTheme, LightTheme } from "../../../styles/MainTheme";
import { faCloud } from "@fortawesome/free-solid-svg-icons";

export type PopUpProps = {
	textToDisplay: string;
	// onClose(): void;
};

import meme_0 from "../../../assets/memes/changing_code.jpg";
import meme_1 from "../../../assets/memes/meme_1.jpg";
import meme_2 from "../../../assets/memes/meme_2.png";
import meme_3 from "../../../assets/memes/meme_3.jpg";

let memes: any[] = [meme_0, meme_1, meme_2, meme_3];

export function PopUp(props: PopUpProps) {
  const [image, setImage] = useState(meme_0);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const timer = setInterval(() => {
      setImage((prevImage) => {
        for(let i=0;i<memes.length-1;i++){
          if(prevImage===memes[i]) return memes[i+1];
        }
        return memes[0];
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <StyledModal>
      <FontAwesomeIcon
        icon={faCloud}
        beatFade
        size="xl"
        style={{
          color: theme === "dark" ? LightTheme.primary : DarkTheme.primary
        }}
      />
      <StyledMessageField>{props.textToDisplay}</StyledMessageField>
      <img src={image} alt="Image" style={{ width: "500px", height: "500px" }} />
    </StyledModal>
  );
}

export const StyledModal = styled.div`
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	border-radius: 6px;
	background-color: ${(props) => props.theme.primary};
	padding: 1rem;
	text-align: center;
	width: 30rem;
	z-index: 10;
	position: fixed;
	top: 20vh;
	left: calc(50% - 15rem);
`;

const StyledMessageField = styled.p`
	white-space: pre-line;
`;
