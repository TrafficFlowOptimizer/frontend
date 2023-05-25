import React, { useEffect, useState } from "react";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink } from "../../styles/MainTheme";
import {
	NeutralNegativeButton,
	NeutralPositiveButton,
} from "../../styles/NeutralButton";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	StyledTableHeader,
	StyledTable,
	StyledItemTr,
	StyledItemTd,
} from "../../styles/CrossingListStyles";
import {
	Crossing,
	CrossingType,
	OptimizationResults,
} from "../../custom/CrossingInterface";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PopUp } from "../additional/Modal/PopUp";
import { Backdrop } from "../additional/Modal/Backdrop";

export type tableCrossingState = "chosen" | "not chosen";

export function ListOfCrossings() {
	const hardcodedCrossing: Crossing = {
		_id: "crs2137",
		name: "Małe skrzyżowanie na Czyżynach",
		location: "al. Jana Pawła II",
		creatorId: "1aaa",
		type: CrossingType.PRIVATE,
		roadIds: [],
		collisionsIds: [],
		trafficLightsIds: [],
	};

	const hardcodedCrossing2: Crossing = {
		_id: "crs4200",
		name: "Małe skrzyżowanie na Bałutach",
		location: "al. Pokoju",
		creatorId: "1aaa",
		type: CrossingType.PRIVATE,
		roadIds: [],
		collisionsIds: [],
		trafficLightsIds: [],
	};

	const hardcodedCrossing3: Crossing = {
		_id: "crs69669",
		name: "Małe skrzyżowanie na Mokotowie",
		location: "al. Jerozolimskie",
		creatorId: "1aaa",
		type: CrossingType.PRIVATE,
		roadIds: [],
		collisionsIds: [],
		trafficLightsIds: [],
	};
	const [listOfCrossings, setListOfCrossings] = useState<Crossing[]>([
		hardcodedCrossing,
		hardcodedCrossing2,
		hardcodedCrossing3,
	]);
	const [chosenCrossingId, setChosenCrossingId] = useState<string | null>(null);
	const [showLoadingModal, setShowLoadingModal] = useState(false);

	const navigate = useNavigate();
	//normally list of crossings would be obtained by rest, but for now we will have it hardcode;
	// useEffect(() => {
	// 	axios
	// 		.get<any>("")
	// 		.then((response) => {
	// 			const crossingsData: Crossing[] = response.data;
	// 			setListOfCrossings(crossingsData);
	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 		});
	// }, []);

	const getChosenCrossingName = (): string => {
		return listOfCrossings.filter(
			(crossing) => chosenCrossingId === crossing._id,
		)[0].name;
	};

	const handleOptimizationOrder = () => {
		setShowLoadingModal(true);
		// axios
		// 	.get<OptimizationResults>(
		// 		"/crossroad/" + chosenCrossingId + "/optimization",
		// 	)
		// 	.then((response) => {
		// 		const optimizationData: OptimizationResults = response.data;
		// 		navigate("../../results-choice", { state: optimizationData });
		// 	})
		// 	.catch((error) => {
		// 		console.error(error);
		// 	});
		const mockedOptimizationData: OptimizationResults = {
			results: [
				{
					lightId: 1,
					sequence: [
						0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1,
						0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0,
						0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
					],
					flow: 2.3,
				},
				{
					lightId: 2,
					sequence: [
						0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0,
						1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1,
						1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
					],
					flow: 0.3,
				},
				{
					lightId: 3,
					sequence: [
						0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0,
						1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0,
						0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
					],
					flow: 1.5,
				},
			],
		};
		setTimeout(() => {
			navigate("../../results-choice", {
				state: {
					results: mockedOptimizationData,
					crossingName: getChosenCrossingName(),
				},
			});
		}, 10000);
	};

	const handleChooseButton = (
		crossing_id: string,
		current_state: tableCrossingState,
	) => {
		if (current_state === "chosen") {
			setChosenCrossingId(null);
		} else {
			setChosenCrossingId(crossing_id);
		}
	};

	return (
		<>
			{showLoadingModal && (
				<>
					<PopUp
						textToDisplay={`Optimizing ${getChosenCrossingName()} crossing. This might take a while...\nSit back and relax`}
					/>
					<Backdrop />
				</>
			)}
			<Navbar />
			{listOfCrossings.length == 0 ? (
				<p>No crossings available</p>
			) : (
				<StyledTable>
					<tbody>
						<tr>
							<StyledTableHeader>ID</StyledTableHeader>
							<StyledTableHeader>Name</StyledTableHeader>
							<StyledTableHeader>Location</StyledTableHeader>
							<StyledTableHeader>Type</StyledTableHeader>
							<StyledTableHeader>Action</StyledTableHeader>
						</tr>
						{listOfCrossings.length > 0 &&
							listOfCrossings.map((crossing) => {
								const chosen = chosenCrossingId === crossing._id;
								return (
									<StyledItemTr chosen={chosen} key={crossing._id}>
										<StyledItemTd>{crossing._id}</StyledItemTd>
										<StyledItemTd>{crossing.name}</StyledItemTd>
										<StyledItemTd>{crossing.location}</StyledItemTd>
										<StyledItemTd>{crossing.type}</StyledItemTd>
										<StyledItemTd>
											<NeutralPositiveButton
												onClick={() =>
													handleChooseButton(
														crossing._id,
														!chosen
															? "not chosen"
															: "chosen",
													)
												}
											>
												{!chosen ? "Choose" : "Unselect"}
											</NeutralPositiveButton>
										</StyledItemTd>
									</StyledItemTr>
								);
							})}
					</tbody>
				</StyledTable>
			)}
			<NeutralPositiveButton>
				<BaseButtonLink to="../../list-videos" relative="path">
					See video footage for chosen crossing
				</BaseButtonLink>
			</NeutralPositiveButton>
			<PositiveButton>
				<BaseButtonLink to="../../add-videos" relative="path">
					Add new video for chosen crossing
				</BaseButtonLink>
			</PositiveButton>
			<PositiveButton>
				<BaseButtonLink to="../new" relative="path">
					Create new crossing
				</BaseButtonLink>
			</PositiveButton>
			<NeutralNegativeButton
				disabled={chosenCrossingId === null}
				onClick={handleOptimizationOrder}
			>
				{/*<BaseButtonLink to="../../results-choice" relative="path">*/}
				Order optimization for chosen crossing and go to results choice panel
				{/*</BaseButtonLink>*/}
			</NeutralNegativeButton>
		</>
	);
}
