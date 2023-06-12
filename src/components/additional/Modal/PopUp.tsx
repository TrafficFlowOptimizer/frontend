import React, { useContext, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../../../custom/ThemeContext";
import { DarkTheme, LightTheme } from "../../../styles/MainTheme";
import { PositiveButton } from "../../../styles/PositiveButton";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { OptimizationResults } from "../../../custom/CrossroadInterface";
import { useNavigate } from "react-router-dom";
import { Memes } from "../Memes";
import { Dropdown } from "../Dropdown";

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

export const StyledModal = styled.div`
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	border-radius: 6px;
	background-color: ${(props) => props.theme.primary};
	padding: 1rem;
	text-align: center;
	width: 30vw;
	height: 55vh;
	z-index: 10;
	position: fixed;
	top: 20vh;
	left: calc(50% - 15rem);

	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: flex-start;
	align-items: center;
`;

const StyledMessageField = styled.p`
	white-space: pre-line;
`;
