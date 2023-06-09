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
} from "../../styles/CrossroadListStyles";
import { Crossroad } from "../../custom/CrossroadInterface";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PopUp } from "../additional/Modal/PopUp";
import { Backdrop } from "../additional/Modal/Backdrop";

export type tableCrossroadState = "chosen" | "not chosen";

export function ListOfCrossroads() {
	const navigate = useNavigate();
	const [listOfCrossroads, setListOfCrossroads] = useState<Crossroad[]>([]);
	const [chosenCrossroadId, setChosenCrossroadId] = useState<string | null>(null);
	const [showLoadingModal, setShowLoadingModal] = useState(false);
	useEffect(() => {
		// console.log("get crossings useEffect");
		axios
			.get<Crossroad[]>("/crossroad")
			.then((response) => {
				const crossingsData: Crossroad[] = response.data;
				setListOfCrossroads(crossingsData);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const getChosenCrossroadName = (): string => {
		return listOfCrossroads.filter(
			(crossroad) => chosenCrossroadId === crossroad.id,
		)[0].name;
	};

	const handleOptimizationOrder = () => {
		setShowLoadingModal(true);
		// const mockedOptimizationData: OptimizationResults = {
		// 	results: [
		// 		{
		// 			lightId: 1,
		// 			sequence: [
		// 				0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1,
		// 				0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0,
		// 				0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
		// 			],
		// 			flow: 2.3,
		// 		},
		// 		{
		// 			lightId: 2,
		// 			sequence: [
		// 				0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0,
		// 				1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1,
		// 				1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
		// 			],
		// 			flow: 0.3,
		// 		},
		// 		{
		// 			lightId: 3,
		// 			sequence: [
		// 				0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0,
		// 				1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0,
		// 				0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
		// 			],
		// 			flow: 1.5,
		// 		},
		// 	],
		// };
		// setTimeout(() => {
		// 	navigate("../../results-choice", {});
		// }, 10000);
	};

	const handleChooseButton = (
		crossroad_id: string,
		current_state: tableCrossroadState,
	) => {
		if (current_state === "chosen") {
			setChosenCrossroadId(null);
		} else {
			setChosenCrossroadId(crossroad_id);
		}
	};

	const handleAddVideosButton = () => {
		navigate("../../add-videos", {
			state: {
				crossroadId: chosenCrossroadId,
				crossroadName: getChosenCrossroadName(),
			},
		});
	};

	return (
		<>
			{showLoadingModal && chosenCrossroadId !== null && (
				<>
					<PopUp
						textToDisplay={`Optimizing ${getChosenCrossroadName()} crossroad.\nSit back and relax`}
						crossroadName={getChosenCrossroadName()}
						crossroadId={chosenCrossroadId}
					/>
					<Backdrop />
				</>
			)}
			<Navbar />
			{listOfCrossroads.length == 0 ? (
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
						{listOfCrossroads.length > 0 &&
							listOfCrossroads.map((crossing) => {
								const chosen = chosenCrossroadId === crossing.id;
								return (
									<StyledItemTr chosen={chosen} key={crossing.id}>
										<StyledItemTd>{crossing.id}</StyledItemTd>
										<StyledItemTd>{crossing.name}</StyledItemTd>
										<StyledItemTd>{crossing.location}</StyledItemTd>
										<StyledItemTd>{crossing.type}</StyledItemTd>
										<StyledItemTd>
											{chosen ? (
												<NeutralNegativeButton
													onClick={() =>
														handleChooseButton(
															crossing.id,
															!chosen
																? "not chosen"
																: "chosen",
														)
													}
												>
													Unselect
												</NeutralNegativeButton>
											) : (
												<NeutralPositiveButton
													onClick={() =>
														handleChooseButton(
															crossing.id,
															"not chosen",
														)
													}
												>
													Choose
												</NeutralPositiveButton>
											)}
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
			<PositiveButton
				disabled={chosenCrossroadId === null}
				onClick={handleAddVideosButton}
			>
				Add new video for chosen crossing
			</PositiveButton>
			<PositiveButton>
				<BaseButtonLink to="../new" relative="path">
					Create new crossing
				</BaseButtonLink>
			</PositiveButton>
			<NeutralNegativeButton
				disabled={chosenCrossroadId === null}
				onClick={handleOptimizationOrder}
			>
				{/*<BaseButtonLink to="../../results-choice" relative="path">*/}
				Order optimization for chosen crossroad and go to results choice panel
				{/*</BaseButtonLink>*/}
			</NeutralNegativeButton>
		</>
	);
}
