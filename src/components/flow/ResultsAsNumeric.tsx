import React from "react";
import { useLocation } from "react-router-dom";
import { OptimizationResults } from "../../custom/CrossroadInterface";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink, PageHeader } from "../../styles/MainStyles";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import {
	NumericResultsUl,
	CustomHeader,
	CustomParagraph,
	NumericResultsLi,
	NumericResultsPanel,
	StyledSequence,
	SequenceContainer,
	SequenceIndex,
	LightResultsPanel,
	SingleInfoPanel,
} from "../../styles/NumericResultsStyles";

export function ResultsAsNumeric() {
	const location = useLocation();
	const results: OptimizationResults = location.state.results ?? true;
	const parsedResults = results.connections;
	const crossroadName: string = location.state.crossroadName ?? true;
	return (
		<>
			<Navbar />
			<div>
				<PageHeader>Results as numeric for: {crossroadName}</PageHeader>
				<NumericResultsUl>
					{parsedResults.length > 0 ? (
						parsedResults.map((result, index) => (
							<NumericResultsLi key={index}>
								<NumericResultsPanel>
									<CustomHeader topMargin={15} leftMargin={0}>
										Connection:
									</CustomHeader>
									<CustomParagraph topMargin={15}>
										#{index}
									</CustomParagraph>
									<CustomHeader topMargin={15} leftMargin={0}>
										Cars passed to arrived ratio:
									</CustomHeader>
									<CustomParagraph topMargin={15}>
										{result.currentFlow}
									</CustomParagraph>
									<CustomHeader topMargin={15} leftMargin={0}>
										Previous ratio:
									</CustomHeader>
									<CustomParagraph topMargin={15}>
										{result.previousFlow}
									</CustomParagraph>
								</NumericResultsPanel>
								{result.lights.length > 0 ? (
									result.lights.map((light) => (
										<LightResultsPanel key={light.lightId}>
											<SingleInfoPanel>
												<CustomHeader
													topMargin={5}
													leftMargin={5}
												>
													Light:
												</CustomHeader>
												<CustomParagraph topMargin={5}>
													#{light.lightId}
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
													{light.sequence.map(
														(elem, index) => (
															<StyledSequence
																key={index}
																isGreen={elem === 1}
															>
																<SequenceIndex>
																	{index + 1}
																</SequenceIndex>
															</StyledSequence>
														),
													)}
												</SequenceContainer>
											</SingleInfoPanel>
										</LightResultsPanel>
									))
								) : (
									<li>Lights are empty</li>
								)}
							</NumericResultsLi>
						))
					) : (
						<li>Results are empty</li>
					)}
				</NumericResultsUl>
				<NeutralNegativeButton>
					<BaseButtonLink
						to="../results-choice"
						relative="path"
						state={location.state}
					>
						Go back to results choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
