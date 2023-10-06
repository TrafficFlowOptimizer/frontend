import React from "react";
import { ButtonsDiv } from "../../styles/MainTheme";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import { useNavigate } from "react-router-dom";

export function Collisions() {
	const navigate = useNavigate();

	const onSave = () => {
		alert("Saving!!!");
	};

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	return (
		<div>
			<p>
				<strong>COLLISIONS</strong>
			</p>
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
				<PositiveButton onClick={onSave}>Save & Proceed</PositiveButton>
			</ButtonsDiv>
		</div>
	);
}
