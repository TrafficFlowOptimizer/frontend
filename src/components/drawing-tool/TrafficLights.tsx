import React from "react";
import { useNavigate } from "react-router-dom";
import { ButtonsDiv, ContainerDiv } from "../../styles/MainTheme";
import { NegativeButton } from "../../styles/NegativeButton";

export function TrafficLights() {
	const navigate = useNavigate();

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};
	return (
		<ContainerDiv>
			<p>TRAFFIC LIGHTS</p>
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}
