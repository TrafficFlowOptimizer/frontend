import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PositiveButton } from "../../styles/PositiveButton";
import { NegativeButton } from "../../styles/NegativeButton";
import { CrossroadScreenshot } from "../../styles/drawing-tool-styles/BasicInformationStyles";
import { BaseInput, BaseUl, BaseLi, BaseForm } from "../../styles/MainTheme";

export function BasicInformation() {
	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);
	const navigate = useNavigate();

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []);

	const onCrossroadSave = () => {
		// later it should have crossroad as an argument, same as onAbort, but just for now
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	console.log(
		localStorage.getItem("crossroadMap") !== null,
		localStorage.getItem("crossroadMap") !== undefined,
	);
	return (
		<div>
			<p>basic information</p>
			<CrossroadScreenshot
				src={
					crossroadImage === undefined
						? localStorage.getItem("crossroadMap")!
						: crossroadImage
				}
				alt="Map screenshot"
			/>
			<BaseForm onSubmit={onCrossroadSave}>
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
				</BaseUl>
				<PositiveButton type="submit" disabled={false}>
					Next
				</PositiveButton>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
			</BaseForm>
		</div>
	);
}
