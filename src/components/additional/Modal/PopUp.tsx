import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { OptimizationResults } from "../../../custom/CrossroadInterface";
import { Dropdown } from "../Dropdown";
import { Memes } from "../Memes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../../../custom/ThemeContext";
import { DarkTheme, LightTheme } from "../../../styles/MainTheme";
import { PositiveButton } from "../../../styles/PositiveButton";
import { StyledModal, StyledMessageField } from "../../../styles/modal/ModalStyles";
import { faCloud } from "@fortawesome/free-solid-svg-icons";

export type PopUpProps = {
	textToDisplay: string;
	crossroadName: string;
	crossroadId: string;
	// onClose(): void;
};

export function PopUp(props: PopUpProps) {
	const { theme } = useContext(ThemeContext);
	const navigate = useNavigate();
	const [optimizationDeployed, setOptimizationDeployed] = useState(false);
	const [chosenTime, setChosenTime] = useState<number | null | string>(null);

	const startOptimization = () => {
		setOptimizationDeployed(true);
		axios
			.get<OptimizationResults>(
				"/crossroad/" +
					props.crossroadId +
					"/optimization/" +
					String(chosenTime),
			)
			.then((response) => {
				const optimizationData: OptimizationResults = response.data;
				navigate("../../results-choice", {
					state: {
						results: optimizationData,
						crossroadName: props.crossroadName,
						crossroadId: props.crossroadId,
					},
				});
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const onChange = (newValue: number | string | null) => {
		setChosenTime(newValue);
	};

	return (
		<StyledModal>
			{optimizationDeployed ? (
				<div>
					<FontAwesomeIcon
						icon={faCloud}
						beatFade
						size="xl"
						style={{
							color:
								theme === "dark"
									? LightTheme.primary
									: DarkTheme.primary,
						}}
					/>
					<StyledMessageField>{props.textToDisplay}</StyledMessageField>
					<Memes />
				</div>
			) : (
				<div>
					<StyledMessageField>
						Crossroad: {props.crossroadName}
					</StyledMessageField>
					<Dropdown
						placeholder="Select optimization time"
						options={[1, 10, 20, 30, 60, 120, -1]}
						isSearchable={false}
						onChange={onChange}
					/>
					<PositiveButton
						onClick={startOptimization}
						disabled={chosenTime === null}
					>
						Start optimization
					</PositiveButton>
				</div>
			)}
		</StyledModal>
	);
}
