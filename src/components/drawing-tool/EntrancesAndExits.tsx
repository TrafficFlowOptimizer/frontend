import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Crossroad, ExitEntrancePoint } from "../../custom/CrossroadInterface";
import {
	CrossroadScreenshot,
	BorderedWorkaroundDiv,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import { ButtonsDiv, ContainerDiv } from "../../styles/MainTheme";
import { Backdrop } from "../additional/Modal/Backdrop";
import { ExitEntranceCreator } from "../additional/Modal/ExitEntranceCreator";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";

export function EntrancesAndExits() {
	const navigate = useNavigate();
	const location = useLocation();
	const crossroad: Crossroad = location.state.crossroad;

	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);

	const [showCreator, setShowCreator] = useState(false);
	const [exitEntrancePoints, setExitEntrancePoints] = useState<ExitEntrancePoint[]>(
		[],
	);

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []);

	const onMapClick = (event: React.SyntheticEvent) => {
		event.preventDefault();

		console.log("Map clicked - cords:");
		setShowCreator(true);
	};

	const onCloseCreator = () => {
		setShowCreator(false);
	};

	const onSaveCreator = (point: ExitEntrancePoint) => {
		setExitEntrancePoints([...exitEntrancePoints, point]);
		onCloseCreator();
	};

	const onNext = () => {
		navigate("../traffic-lights", {
			state: {
				crossroad: crossroad,
				entrancesAndExits: exitEntrancePoints,
			},
		});
	};

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	return (
		<ContainerDiv>
			{showCreator && (
				<>
					<ExitEntranceCreator
						closeFunction={onCloseCreator}
						handleOnSave={onSaveCreator}
					/>
					<Backdrop />
				</>
			)}
			<p>
				<strong>Entrances & Exits</strong>
				<br />
				Please follow these steps:
				<br />
				1. Click on the map in place where you want your exit and/or entrance to
				be
				<br />
				2. Fill-in the input fields in the creator and save the point
				<br />
				3. Repeat steps 1-2 for all entrances and exits you need
			</p>
			<BorderedWorkaroundDiv onClick={onMapClick}>
				<CrossroadScreenshot
					src={
						crossroadImage === undefined
							? localStorage.getItem("crossroadMap")!
							: crossroadImage
					}
					alt="Map screenshot"
				></CrossroadScreenshot>
			</BorderedWorkaroundDiv>
			<ButtonsDiv>
				<NegativeButton onClick={onAbort}>Abort</NegativeButton>
				<PositiveButton onClick={onNext}>Next</PositiveButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}
