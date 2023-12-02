import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider, Zoom } from "@mui/material";
import { Crossroad, ExitEntrancePoint } from "../../custom/CrossroadInterface";
import {
	getNewId,
	matchEEIPointTypeWithColor,
} from "../../custom/drawing-tool/AuxiliaryFunctions";
import { Backdrop } from "../additional/Modal/Backdrop";
import { ExitEntranceCreator } from "../additional/Modal/drawing-tool-creators/ExitEntranceCreator";
import {
	CrossroadScreenshot,
	BorderedWorkaroundDiv,
	TooltipButton,
	EEIPointMarker,
	InstructionP,
} from "../../styles/drawing-tool-styles/GeneralStyles";
import {
	BaseLi,
	BaseUl,
	ButtonColors,
	ButtonsDiv,
	ContainerDiv,
} from "../../styles/MainStyles";
import { NegativeButton } from "../../styles/NegativeButton";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	EEIPointOffset,
	EXITS_ENTRANCES_TEMPLATE,
	TOOLTIP_ENTRANCE_DELAY,
	TOOLTIP_LEAVE_DELAY,
	tooltipTheme,
} from "../../custom/drawing-tool/AuxiliaryData";

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

	const [firstFreeId, setFirstFreeId] = useState(1);

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
			index: getNewId(firstFreeId, setFirstFreeId),
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
				entrancesAndExits: exitEntrancePoints.map((eeiPoint, index) => ({
					...eeiPoint,
					index: (index + 1).toString(),
				})),
			},
		});
	};

	const onAbort = () => {
		navigate("../../crossroad-list");
		localStorage.removeItem("crossroadMap");
	};

	const onDeletePoint = (event: any, pointIndex: number, pointIdx: number) => {
		event.stopPropagation();
		setExitEntrancePoints(
			exitEntrancePoints.filter(
				(point, idx) => pointIndex !== point.index && idx !== pointIdx,
			),
		);
	};

	const onEditPoint = (event: any, pointIndex: number, pointIdx: number) => {
		event.stopPropagation();
		setTemplatePoint(exitEntrancePoints.at(pointIdx)!);
		setExitEntrancePoints(
			exitEntrancePoints.filter(
				(point, idx) => pointIndex !== point.index && idx !== pointIdx,
			),
		);
		setShowCreator(true);
	};

	const checkIndex = (index: number) => {
		for (const tempPoint of exitEntrancePoints) {
			if (tempPoint.index === index) {
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
						checkIndex={checkIndex}
					/>
					<Backdrop />
				</>
			)}
			<InstructionP>
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
			</InstructionP>
			<BorderedWorkaroundDiv onClick={onMapClick}>
				{exitEntrancePoints.length > 0 && (
					<ThemeProvider theme={tooltipTheme}>
						{exitEntrancePoints.map((point, idx) => (
							<Tooltip
								key={idx}
								title={
									<React.Fragment>
										<BaseUl>
											<BaseLi>id: {point.index}</BaseLi>
											<BaseLi>type: {point.type}</BaseLi>
											<BaseLi>street: {point.name}</BaseLi>
											{point.type === "INTERMEDIATE" && (
												<BaseLi>
													capacity:{" "}
													{point.capacity === -1
														? "infinity"
														: point.capacity}
												</BaseLi>
											)}
										</BaseUl>
										<ButtonsDiv>
											<TooltipButton
												color={ButtonColors.RED}
												yCord={0}
												xCord={0}
												onClick={(e) => {
													onDeletePoint(e, point.index, idx);
												}}
											>
												DELETE POINT
											</TooltipButton>
											<TooltipButton
												color={ButtonColors.BLUE}
												yCord={0}
												xCord={0}
												onClick={(e) => {
													onEditPoint(e, point.index, idx);
												}}
											>
												EDIT POINT
											</TooltipButton>
										</ButtonsDiv>
									</React.Fragment>
								}
								TransitionComponent={Zoom}
								enterDelay={TOOLTIP_ENTRANCE_DELAY}
								leaveDelay={TOOLTIP_LEAVE_DELAY}
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
					</ThemeProvider>
				)}
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
