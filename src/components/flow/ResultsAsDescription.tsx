import React from "react";
import { useLocation } from "react-router-dom";
import { OptimizationResults } from "../../custom/OptimizationInterface";
import { Navbar } from "../additional/Navbar";
import {
	BaseButtonLink,
	PageHeader,
	ContainerDiv,
	ButtonsDiv,
} from "../../styles/MainStyles";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import {
	ResultsUl,
	ResultsInfoParagraph,
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

	console.log("connectionsIndexes", connectionsIndexes);
	console.log("crossroadConnections", crossroadConnections);
	console.log("lightsSeqCurr", lightsSeqCurr);

	return (
		<ContainerDiv>
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
									<ResultsInfoParagraph
										topMargin={15}
										leftMargin={0}
										fontWeight={"bold"}
									>
										Connection:
									</ResultsInfoParagraph>
									<ResultsInfoParagraph topMargin={15}>
										{getConnectionNameFromIndex(
											crossroadConnections,
											connectionIndex,
										)}
									</ResultsInfoParagraph>
									<ResultsInfoParagraph
										topMargin={15}
										leftMargin={0}
										fontWeight={"bold"}
									>
										Cars passed to arrived ratio:
									</ResultsInfoParagraph>
									<ResultsInfoParagraph topMargin={15}>
										{conFlowRatioCurr[
											parseInt(connectionIndex) - 1
										].toFixed(2)}
									</ResultsInfoParagraph>
									<ResultsInfoParagraph
										topMargin={15}
										leftMargin={0}
										fontWeight={"bold"}
									>
										Previous ratio:
									</ResultsInfoParagraph>
									{/* prettier-ignore */}
									<ResultsInfoParagraph topMargin={15}>
										{conFlowRatioPrev.length ===
										0
											? "No previous results"
											: (conFlowRatioPrev[parseInt(connectionIndex)-1]).toFixed(2)}
									</ResultsInfoParagraph>
									<ResultsInfoParagraph
										topMargin={15}
										leftMargin={0}
										fontWeight={"bold"}
									>
										Cars per minute:
									</ResultsInfoParagraph>
									<ResultsInfoParagraph topMargin={15}>
										{conFlow[parseInt(connectionIndex) - 1]}
									</ResultsInfoParagraph>
								</ResultsPanel>
								{getConnectionLight(connectionIndex).length > 0 ? (
									getConnectionLight(connectionIndex).map((light) => (
										<LightResultsPanel
											key={`Light#${light.index}/inCon${connectionIndex}`}
										>
											<SingleInfoPanel>
												<ResultsInfoParagraph
													topMargin={5}
													leftMargin={5}
													fontWeight={"bold"}
												>
													Light:
												</ResultsInfoParagraph>
												<ResultsInfoParagraph topMargin={5}>
													#{light.index}
												</ResultsInfoParagraph>
												<ResultsInfoParagraph
													topMargin={5}
													leftMargin={5}
													fontWeight={"bold"}
												>
													Direction:
												</ResultsInfoParagraph>
												<ResultsInfoParagraph topMargin={5}>
													{light.direction}
												</ResultsInfoParagraph>
												<ResultsInfoParagraph
													topMargin={5}
													leftMargin={5}
													fontWeight={"bold"}
												>
													Current light sequence:
												</ResultsInfoParagraph>
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
											<ResultsInfoParagraph
												topMargin={5}
												leftMargin={5}
												fontWeight={"bold"}
											>
												Previous light sequence:
											</ResultsInfoParagraph>
											<SingleInfoPanel>
												<SequenceContainer>
													{
														/* prettier-ignore */
														lightsSeqPrev.length ===
														0
															? "No previous results"
															: getLightSequence(
																light.index,
																lightsSeqPrev
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
				<ButtonsDiv>
					<BaseButtonLink
						to="../results-choice"
						relative="path"
						state={{
							crossroadId: crossroadId,
							crossroadName: crossroadName,
						}}
					>
						<NeutralNegativeButton>
							Go back to results choice panel
						</NeutralNegativeButton>
					</BaseButtonLink>
				</ButtonsDiv>
			</div>
		</ContainerDiv>
	);
}
