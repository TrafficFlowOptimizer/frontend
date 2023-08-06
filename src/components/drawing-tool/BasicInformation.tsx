import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../custom/UserContext";
import { Crossroad, CrossroadType } from "../../custom/CrossroadInterface";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { PositiveButton } from "../../styles/PositiveButton";
import { NegativeButton } from "../../styles/NegativeButton";
import { CrossroadScreenshot } from "../../styles/drawing-tool-styles/BasicInformationStyles";
import {
	BaseForm,
	BaseInput,
	BaseLi,
	BaseUl,
	ButtonsDiv,
} from "../../styles/MainTheme";

export function BasicInformation() {
	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);
	const navigate = useNavigate();
	const { loggedUser } = useUserContext();

	const [crossroadName, setCrossroadName] = useState("");

	const crossroad: Crossroad = {
		id: "",
		name: "",
		location: "",
		creatorId: loggedUser === null ? "1" : loggedUser.id,
		type: CrossroadType.PRIVATE,
		roadIds: [],
		collisionsIds: [],
		trafficLightIds: [],
		connectionIds: [],
	};

	//TODO: field validation!

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []);

	const onNext = () => {
		// TODO: later it should have crossroad as an argument
		navigate("../entrances-and-exits");
	};

	const onConfirm = () => {
		//TODO: should use all use states and set new values in crossroad object
		alert("Inputs confirmed!");
	};

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	return (
		<div>
			<CrossroadScreenshot
				src={
					crossroadImage === undefined
						? localStorage.getItem("crossroadMap")!
						: crossroadImage
				}
				alt="Map screenshot"
			/>
			<BaseForm onSubmit={onConfirm}>
				<BaseUl>
					<BaseLi>Basic information:</BaseLi>
					<BaseLi>
						<label htmlFor="name">Name:</label>
						<BaseInput id="name" type="text" />
					</BaseLi>
					<BaseLi>
						<label htmlFor="country">Country:</label>
						<BaseInput id="country" type="text" />
					</BaseLi>
					<BaseLi>
						<label htmlFor="city">City:</label>
						<BaseInput id="city" type="text" />
					</BaseLi>
					<BaseLi>
						<label htmlFor="district">District:</label>
						<BaseInput id="district" type="text" />
					</BaseLi>
					<BaseLi>
						<label htmlFor="type">Type:</label>
						{/*TODO: custom radio buttons!*/}
						<button>PRIVATE</button>
						<button>PUBLIC</button>
					</BaseLi>
				</BaseUl>
				<NeutralPositiveButton type="submit" disabled={false}>
					Confirm
				</NeutralPositiveButton>
			</BaseForm>
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
				<PositiveButton onClick={onNext} disabled={false}>
					Next
				</PositiveButton>
			</ButtonsDiv>
		</div>
	);
}
