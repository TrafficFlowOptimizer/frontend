import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { Zoom } from "@mui/material";
import { Crossroad, ExitEntrancePoint } from "../../custom/CrossroadInterface";
import {
	CrossroadScreenshot,
	BorderedWorkaroundDiv,
	TooltipButton,
	EEIPointMarker,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import {
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	ContainerDiv,
} from "../../styles/MainTheme";
import { Backdrop } from "../additional/Modal/Backdrop";
import { ExitEntranceCreator } from "../additional/Modal/ExitEntranceCreator";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	EEIPointOffset,
	EXITS_ENTRANCES_TEMPLATE,
} from "../../custom/drawing-tool/AuxiliaryData";
import { matchEEIPointTypeWithColor } from "../../custom/drawing-tool/AuxiliaryFunctions";

export function EntrancesAndExits() {
	const navigate = useNavigate();
	const location = useLocation();
	const crossroad: Crossroad = location.state.crossroad;

	const [crossroadImage, setCrossroadImage] = useState<string | undefined>(undefined);

	const [showCreator, setShowCreator] = useState(false);
	const [exitEntrancePoints, setExitEntrancePoints] = useState<ExitEntrancePoint[]>(
		[],
	);

	const [localMousePos, setLocalMousePos] = useState({ x: 0, y: 0 });
	const [templatePoint, setTemplatePoint] = useState(EXITS_ENTRANCES_TEMPLATE);

	const handleMouseMove = (event: any) => {
		const rect = event.target.getBoundingClientRect();
		const x = event.clientX - rect.left; //x position within the element.
		const y = event.clientY - rect.top; //y position within the element.

		setLocalMousePos({
			x: x - EEIPointOffset,
			y: y - EEIPointOffset,
		});
	};

	useEffect(() => {
		setCrossroadImage(localStorage.getItem("crossroadMap")!);
	}, []);

	const onMapClick = (event: React.SyntheticEvent) => {
		event.preventDefault();
		setTemplatePoint({
			...templatePoint,
			xCord: localMousePos.x,
			yCord: localMousePos.y,
		});
		setShowCreator(true);
	};

	const onCloseCreator = () => {
		setShowCreator(false);
		setTemplatePoint(EXITS_ENTRANCES_TEMPLATE);
	};

	const onSaveCreator = (point: ExitEntrancePoint) => {
		setExitEntrancePoints([...exitEntrancePoints, point]);
		onCloseCreator();
		setTemplatePoint(EXITS_ENTRANCES_TEMPLATE);
	};

	const onNext = () => {
		navigate("../connections", {
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

	const onDeletePoint = (event: any, pointId: string, pointIdx: number) => {
		event.stopPropagation();
		setExitEntrancePoints(
			exitEntrancePoints.filter(
				(point, idx) => pointId !== point.id && idx !== pointIdx,
			),
		);
	};

	const onEditPoint = (event: any, pointId: string, pointIdx: number) => {
		event.stopPropagation();
		setTemplatePoint(exitEntrancePoints.at(pointIdx)!);
		setExitEntrancePoints(
			exitEntrancePoints.filter(
				(point, idx) => pointId !== point.id && idx !== pointIdx,
			),
		);
		setShowCreator(true);
	};

	const checkId = (id: string) => {
		for (const tempPoint of exitEntrancePoints) {
			if (tempPoint.id === id) {
				return true;
			}
		}
		return false;
	};

	return (
		<ContainerDiv>
			{showCreator && (
				<>
					<ExitEntranceCreator
						point={templatePoint}
						closeFunction={onCloseCreator}
						handleOnSave={onSaveCreator}
						checkId={checkId}
					/>
					<Backdrop />
				</>
			)}
			<p>
				<strong>Entrances & Exits</strong>
				<br />
				Please follow these steps:
				<br />
				1. Click on the map in place where you want your
				entrance/exit/intermediate point to be
				<br />
				2. Fill-in the input fields in the creator and save the point
				<br />
				3. Repeat steps 1-2 for all entrances, exits and inters you need
			</p>
			<BorderedWorkaroundDiv onClick={onMapClick}>
				{exitEntrancePoints.length > 0 &&
					exitEntrancePoints.map((point, idx) => (
						<Tooltip
							key={idx}
							title={
								<React.Fragment>
									<BaseUl>
										<BaseLi>id: {point.id}</BaseLi>
										<BaseLi>type: {point.type}</BaseLi>
										<BaseLi>street: {point.street}</BaseLi>
										<BaseLi>
											capacity:{" "}
											{point.capacity === -1
												? "infinity"
												: point.capacity}
										</BaseLi>
									</BaseUl>
									<ButtonsDiv>
										<TooltipButton
											color={ButtonColors.RED}
											yCord={0}
											xCord={0}
											onClick={(e) => {
												onDeletePoint(e, point.id, idx);
											}}
										>
											DELETE POINT
										</TooltipButton>
										<TooltipButton
											color={ButtonColors.BLUE}
											yCord={0}
											xCord={0}
											onClick={(e) => {
												onEditPoint(e, point.id, idx);
											}}
										>
											EDIT POINT
										</TooltipButton>
									</ButtonsDiv>
								</React.Fragment>
							}
							TransitionComponent={Zoom}
							enterDelay={75}
							leaveDelay={450}
							arrow
						>
							<EEIPointMarker
								key={idx}
								color={matchEEIPointTypeWithColor(point.type)}
								yCord={point.yCord}
								xCord={point.xCord}
							></EEIPointMarker>
						</Tooltip>
					))}
				<CrossroadScreenshot
					onMouseMove={handleMouseMove}
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
