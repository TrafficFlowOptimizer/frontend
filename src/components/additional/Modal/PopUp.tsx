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

	const startOptimization = () => {
		setOptimizationDeployed(true);
		const optimizationTime = 30;
		axios
			.get<OptimizationResults>(
				"/crossroad/" +
					props.crossroadId +
					"/optimization/" +
					String(optimizationTime),
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
				</div>
			) : (
				<div>
					<StyledMessageField>
						Choose optimization time for {props.crossroadName}
					</StyledMessageField>
					<PositiveButton onClick={startOptimization}>
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
	width: 30rem;
	z-index: 10;
	position: fixed;
	top: 20vh;
	left: calc(50% - 15rem);
`;

const StyledMessageField = styled.p`
	white-space: pre-line;
`;
