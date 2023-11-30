import React from "react";
import { useLocation } from "react-router-dom";
import { OptimizationResults } from "../../custom/OptimizationInterface";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink, ContainerDiv, PageHeader } from "../../styles/MainStyles";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import {
	ResultsUl,
	CustomHeader,
	CustomParagraph,
	ResultsLi,
	ResultsPanel,
	StyledSequence,
	SequenceContainer,
	SequenceIndex,
	LightResultsPanel,
	SingleInfoPanel,
} from "../../styles/ResultsStyles";
import { ResponseConnection } from "../../custom/CrossRoadRestTypes";
import { getConnectionNameFromIndex } from "../../custom/drawing-tool/AuxiliaryFunctions";
import { TrafficLight } from "../../custom/CrossroadInterface";

export function ResultsAsDescription() {
	const location = useLocation();

	const crossroadName: string = location.state.crossroadName ?? null;
	const results: OptimizationResults = location.state.results ?? null;
	const crossroadId: string = location.state.crossroadId ?? null;

	const conFlowRatioPrev = Object.values(results.connectionsFlowRatioMapPrevious);
	const conFlowRatioCurr = Object.values(results.connectionsFlowRatioMapCurrent);
	const lightsSeqPrev: number[][] = Object.values(results.lightsSequenceMapPrevious);
	const lightsSeqCurr: number[][] = Object.values(results.lightsSequenceMapCurrent);
	const conLights: TrafficLight[][] = Object.values(results.connectionsLightsMap);
	const conFlow = Object.values(results.connectionsFlowMap);

	const connectionsIndexes = Array.from(
		Object.keys(results.connectionsFlowRatioMapCurrent),
	);

	const crossroadConnections: ResponseConnection[] = JSON.parse(
		localStorage.getItem("currConnections")!,
	);

	const getConnectionLight = (conIdx: string) => {
		const newIdx = parseInt(conIdx) - 1;
		if (newIdx >= 0 && newIdx < conLights.length) {
			return conLights[newIdx];
		} else {
			return [];
		}
	};

	const getLightSequence = (lightIdx: number, lightsSeq: number[][]) => {
		const newIdx = lightIdx - 1;
		if (newIdx >= 0 && newIdx < lightsSeq.length) {
			return lightsSeq[newIdx];
		} else {
			return [];
		}
	};

	return (
		<>
			<Navbar />
			<div>
				<PageHeader>
					Results as descriptive data for: {crossroadName}
				</PageHeader>
				<ResultsUl>
					{connectionsIndexes.length > 0 ? (
						connectionsIndexes.map((connectionIndex, index) => (
							<ResultsLi key={`Visualization#${index}`}>
								<ResultsPanel>
									<CustomHeader topMargin={15} leftMargin={0}>
										Connection:
									</CustomHeader>
									<CustomParagraph topMargin={15}>
										{getConnectionNameFromIndex(
											crossroadConnections,
											connectionIndex,
										)}
									</CustomParagraph>
									<CustomHeader topMargin={15} leftMargin={0}>
										Cars passed to arrived ratio:
									</CustomHeader>
									<CustomParagraph topMargin={15}>
										{
											conFlowRatioCurr[
												parseInt(connectionIndex) - 1
											]
										}
									</CustomParagraph>
									<CustomHeader topMargin={15} leftMargin={0}>
										Previous ratio:
									</CustomHeader>
									{/* prettier-ignore */}
									<CustomParagraph topMargin={15}>
										{conFlowRatioPrev.length ===
										0
											? "No previous results"
											: conFlowRatioPrev[parseInt(connectionIndex)-1]}
									</CustomParagraph>
									<CustomHeader topMargin={15} leftMargin={0}>
										Cars per minute:
									</CustomHeader>
									<CustomParagraph topMargin={15}>
										{conFlow[parseInt(connectionIndex) - 1]}
									</CustomParagraph>
								</ResultsPanel>
								{getConnectionLight(connectionIndex).length > 0 ? (
									getConnectionLight(connectionIndex).map((light) => (
										<LightResultsPanel
											key={`Light#${light.index}/inCon${connectionIndex}`}
										>
											<SingleInfoPanel>
												<CustomHeader
													topMargin={5}
													leftMargin={5}
												>
													Light:
												</CustomHeader>
												<CustomParagraph topMargin={5}>
													#{light.index}
												</CustomParagraph>
												<CustomHeader
													topMargin={5}
													leftMargin={5}
												>
													Direction:
												</CustomHeader>
												<CustomParagraph topMargin={5}>
													{light.direction}
												</CustomParagraph>
												<CustomHeader
													topMargin={5}
													leftMargin={5}
												>
													Current light sequence:
												</CustomHeader>
											</SingleInfoPanel>
											<SingleInfoPanel>
												<SequenceContainer>
													{getLightSequence(
														light.index,
														lightsSeqCurr,
													).map((elem, index) => (
														<StyledSequence
															key={index}
															isGreen={elem === 1}
														>
															<SequenceIndex>
																{index + 1}
															</SequenceIndex>
														</StyledSequence>
													))}
												</SequenceContainer>
											</SingleInfoPanel>
											<CustomHeader topMargin={5} leftMargin={5}>
												Previous light sequence:
											</CustomHeader>
											<SingleInfoPanel>
												<SequenceContainer>
													{
														/* prettier-ignore */
														lightsSeqPrev.length ===
														0
															? "No previous results"
															: getLightSequence(
																light.index,
																lightsSeqPrev,
														  ).map((elem, index) => (
																<StyledSequence
																	key={index}
																	isGreen={elem === 1}
																>
																	<SequenceIndex>
																		{index + 1}
																	</SequenceIndex>
																</StyledSequence>
														  ))
													}
												</SequenceContainer>
											</SingleInfoPanel>
										</LightResultsPanel>
									))
								) : (
									<li>Lights are empty</li>
								)}
							</ResultsLi>
						))
					) : (
						<li>Results are empty</li>
					)}
				</ResultsUl>
				<NeutralNegativeButton>
					<BaseButtonLink
						to="../results-choice"
						relative="path"
						state={{
							crossroadId: crossroadId,
							crossroadName: crossroadName,
						}}
					>
						Go back to results choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
