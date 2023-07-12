import React, { useEffect, useState } from "react";
import axios from "axios";
import { Crossroad, OptimizationResults } from "../../custom/CrossroadInterface";
import { Navbar } from "../additional/Navbar";
import { VideosList } from "./VideosList";
import { useLocation, useNavigate } from "react-router-dom";
import { PopUp } from "../additional/Modal/PopUp";
import { Backdrop } from "../additional/Modal/Backdrop";
import { BaseButtonLink, PageHeader } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import { NeutralPositiveButton } from "../../styles/NeutralButton";
import { PositiveButton } from "../../styles/PositiveButton";

export function CrossroadView() {
	const navigate = useNavigate();
	const location = useLocation();
	const crossroadID: string = location.state.crossroadID ?? true; //idea: just get crossroadID here and fetch it again (newest data and easier in routing)
	const [crossroad, setCrossroad] = useState<Crossroad | null>(null);
	const [showLoadingModal, setShowLoadingModal] = useState(false);

	useEffect(() => {
		axios
			.get<Crossroad[]>("/crossroad")
			.then((response) => {
				const crossingsData: Crossroad[] = response.data;
				setCrossroad(
					crossingsData.filter(
						(crossroad) => crossroad.id === crossroadID,
					)[0],
				);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleAddVideosButton = () => {
		if (crossroad !== null) {
			navigate("../../add-videos", {
				state: {
					crossroadId: crossroad.id,
					crossroadName: crossroad.name,
				},
			});
		}
	};

	const handleGoToResultsPanel = () => {
		if (crossroad !== null) {
			axios
				.get<OptimizationResults>(
					"/crossroad/" + crossroad.id + "/optimization/" + 1,
				)
				.then((response) => {
					const optimizationData: OptimizationResults = response.data;
					navigate("../../results-choice", {
						state: {
							results: optimizationData,
							crossroadName: crossroad.name,
							crossroadId: crossroad.id,
						},
					});
				})
				.catch((error) => {
					console.error(error);
				});
		} else {
			alert("Error when loading the crossroad!");
		}
	};

	const handleOptimizationOrder = () => {
		setShowLoadingModal(true);
	};

	return (
		<>
			{showLoadingModal && crossroad !== null && (
				<>
					<PopUp
						textToDisplay={`Optimizing ${crossroad.name} crossroad.\nSit back and relax`}
						crossroadName={crossroad.name}
						crossroadId={crossroad.id}
					/>
					<Backdrop />
				</>
			)}
			<Navbar />
			{crossroad != null ? (
				<div>
					<PageHeader>{crossroad.name} view page</PageHeader>
					<p>
						Here will be a visual representation of the crossroad -
						{crossroad.location}
					</p>
					<VideosList />
					<PositiveButton onClick={handleAddVideosButton}>
						Add new video for chosen crossroad
					</PositiveButton>
					<NeutralPositiveButton
						disabled={crossroadID === null}
						onClick={handleOptimizationOrder}
					>
						Order optimization and go to results choice panel
					</NeutralPositiveButton>
					<NeutralPositiveButton
						disabled={crossroadID === null}
						onClick={handleGoToResultsPanel}
					>
						Go to results choice panel
					</NeutralPositiveButton>
				</div>
			) : (
				<p>Error! No crossroad has been loaded</p>
			)}
			<NeutralNegativeButton>
				<BaseButtonLink to="../../crossroad-list" relative="path">
					Go back to crossroads list
				</BaseButtonLink>
			</NeutralNegativeButton>
		</>
	);
}
