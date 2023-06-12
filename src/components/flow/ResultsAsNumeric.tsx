import React from "react";
import { BaseButtonLink, CustomH1 } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import {
	NumericResultsUl,
	HeaderInfo1,
	CustomParagraph1,
	HeaderInfo2,
	CustomParagraph2,
	NumericResultsLi,
	NumericResultsPanel,
	StyledSequence,
	SequenceContainer,
	SequenceIndex,
	LightResultsPanel,
	SingleInfoPanel,
} from "../../styles/NumericResultsStyles";
import { Navbar } from "../additional/Navbar";
import { useLocation } from "react-router-dom";
import { OptimizationResults } from "../../custom/CrossroadInterface";

export function ResultsAsNumeric() {
	const location = useLocation();
	const results: OptimizationResults = location.state.results ?? true;
	const parsedResults = results.connections;
	const crossroadName: string = location.state.crossroadName ?? true;
	return (
		<>
			<Navbar />
			<div>
				<CustomH1>Results as numeric for: {crossroadName}</CustomH1>
				<NumericResultsUl>
					{parsedResults.length > 0 ? (
						parsedResults.map((result, index) => (
							// <NumericResultsLi key={result.lightId}>
							// 	<NumericResultsPanel>
							// 		<HeaderInfo>Light ID:</HeaderInfo>
							// 		<p>light#{result.lightId}</p>
							// 		<HeaderInfo>
							// 			Cars passed to arrived ratio:
							// 		</HeaderInfo>
							// 		<p>{result.flow}</p>
							// 	</NumericResultsPanel>
							// 	<NumericResultsPanel>
							// 		<HeaderInfo>Light sequence:</HeaderInfo>
							// 		<SequenceContainer>
							// 			{result.sequence.map((elem, index) => (
							// 				<StyledSequence
							// 					key={index}
							// 					isGreen={elem === 1}
							// 				>
							// 					<SequenceIndex>
							// 						{index + 1}
							// 					</SequenceIndex>
							// 				</StyledSequence>
							// 			))}
							// 		</SequenceContainer>
							// 	</NumericResultsPanel>
							// </NumericResultsLi>
							<NumericResultsLi key={index}>
								<NumericResultsPanel>
									<HeaderInfo1>Connection:</HeaderInfo1>
									<CustomParagraph1>#{index}</CustomParagraph1>
									<HeaderInfo1>
										Cars passed to arrived ratio:
									</HeaderInfo1>
									<CustomParagraph1>{result.flow}</CustomParagraph1>
									<HeaderInfo1>Previous ratio:</HeaderInfo1>
									<CustomParagraph1>{"TBD"}</CustomParagraph1>
								</NumericResultsPanel>
								{result.lights.length > 0 ? (
									result.lights.map((light) => (
										<LightResultsPanel key={light.lightId}>
											<SingleInfoPanel>
												<HeaderInfo2>Light:</HeaderInfo2>
												<CustomParagraph2>
													#{light.lightId}
												</CustomParagraph2>
												<HeaderInfo2>Direction:</HeaderInfo2>
												<CustomParagraph2>
													{light.direction}
												</CustomParagraph2>
												<HeaderInfo2>
													Current light sequence:
												</HeaderInfo2>
											</SingleInfoPanel>
											<SingleInfoPanel>
												{/*<HeaderInfo>Light:</HeaderInfo>*/}
												{/*<p>#{light.lightId}</p>*/}
												{/*<HeaderInfo>Direction:</HeaderInfo>*/}
												{/*<p>{light.direction}</p>*/}
												{/*<HeaderInfo>Light sequence:</HeaderInfo>*/}
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
					<BaseButtonLink to="../crossroad-choice" relative="path">
						Go back to crossroad choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
