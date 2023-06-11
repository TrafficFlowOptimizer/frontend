import React from "react";
import { BaseButtonLink } from "../../styles/MainTheme";
import { NeutralNegativeButton } from "../../styles/NeutralButton";
import {
	NumericResultsUl,
	HeaderInfo,
	NumericResultsLi,
	NumericResultsPanel,
	StyledSequence,
	SequenceContainer,
	SequenceIndex,
} from "../../styles/NumericResultsStyles";
import { Navbar } from "../additional/Navbar";
import { useLocation } from "react-router-dom";
import { OptimizationResults } from "../../custom/CrossroadInterface";

export function ResultsAsNumeric() {
	const location = useLocation();
	const results: OptimizationResults = location.state.results ?? true;
	const parsedResults = results.results;
	const crossroadName: string = location.state.crossroadName ?? true;
	return (
		<>
			<Navbar />
			<div>
				<h3>Results as numeric for: {crossroadName}</h3>
				<NumericResultsUl>
					{parsedResults.length > 0 ? (
						parsedResults.map((result) => (
							<NumericResultsLi key={result.lightId}>
								<NumericResultsPanel>
									<HeaderInfo>Light ID:</HeaderInfo>
									<p>light#{result.lightId}</p>
									<HeaderInfo>
										Cars passed to arrived ratio:
									</HeaderInfo>
									<p>{result.flow}</p>
								</NumericResultsPanel>
								<NumericResultsPanel>
									<HeaderInfo>Light sequence:</HeaderInfo>
									<SequenceContainer>
										{result.sequence.map((elem, index) => (
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
								</NumericResultsPanel>
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
