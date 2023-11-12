import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { OptimizationResults } from "../../../custom/CrossroadInterface";
import { Dropdown } from "../Dropdown";
import { Memes } from "../Memes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../../../custom/ThemeContext";
import { DarkTheme, LightTheme, ButtonsDiv } from "../../../styles/MainStyles";
import { PositiveButton } from "../../../styles/PositiveButton";
import { StyledModal, StyledMessageField } from "../../../styles/modal/ModalStyles";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { NegativeButton } from "../../../styles/NegativeButton";
import { Day, Hour } from "../../../custom/OptimizationInterface";
import { TimeIntervalPicker } from "../TimeIntervalPicker";

export type OptimizationDeployerProps = {
	textToDisplay: string;
	crossroadName: string;
	crossroadId: string;
	onClose: () => void;
};

export function OptimizationDeployer(props: OptimizationDeployerProps) {
	const { theme } = useContext(ThemeContext);
	const navigate = useNavigate();
	const [optimizationDeployed, setOptimizationDeployed] = useState(false);
	const [chosenTime, setChosenTime] = useState<number | null | string>(null);

	const [chosenHour, setChosenHour] = useState<Hour | undefined>(undefined);
	const [chosenDay, setChosenDay] = useState<Day | undefined>(undefined);

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
					<TimeIntervalPicker setHour={setChosenHour} setDay={setChosenDay} />
					<ButtonsDiv>
						<NegativeButton
							disabled={
								optimizationDeployed ||
								chosenDay === undefined ||
								chosenHour === undefined
							}
							onClick={props.onClose}
						>
							Close
						</NegativeButton>
						<PositiveButton
							onClick={startOptimization}
							disabled={chosenTime === null}
						>
							Start optimization
						</PositiveButton>
					</ButtonsDiv>
				</div>
			)}
		</StyledModal>
	);
}
