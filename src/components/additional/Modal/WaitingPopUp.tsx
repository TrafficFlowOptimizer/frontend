import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../custom/ThemeContext";
import {
	StyledMessageField,
	StyledWaitingModal,
} from "../../../styles/modal/ModalStyles";
import { DarkTheme, LightTheme } from "../../../styles/MainTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export type WaitingPopUpProps = {
	textToDisplay: string;
	waitingTime: number;
	whereToNavigate: string;
};

export function WaitingPopUp(props: WaitingPopUpProps) {
	const { theme } = useContext(ThemeContext);
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate(props.whereToNavigate);
		}, props.waitingTime * 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<StyledWaitingModal>
			<FontAwesomeIcon
				icon={faGear}
				spin
				size="xl"
				style={{
					color: theme === "dark" ? LightTheme.primary : DarkTheme.primary,
				}}
			/>
			<StyledMessageField>{props.textToDisplay}</StyledMessageField>
		</StyledWaitingModal>
	);
}
