import React, { useContext } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../../../custom/ThemeContext";
import { DarkTheme, LightTheme } from "../../../styles/MainTheme";
import { faCloud } from "@fortawesome/free-solid-svg-icons";

export type PopUpProps = {
	textToDisplay: string;
	// onClose(): void;
};

export function PopUp(props: PopUpProps) {
	const { theme } = useContext(ThemeContext);
	return (
		<StyledModal>
			<FontAwesomeIcon
				icon={faCloud}
				beatFade
				size="xl"
				style={{
					color: theme === "dark" ? LightTheme.primary : DarkTheme.primary,
				}}
			/>
			<StyledMessageField>{props.textToDisplay}</StyledMessageField>
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
