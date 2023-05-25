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
} from "../../styles/NumericResultsStyles";
import { Navbar } from "../additional/Navbar";
import { useLocation } from "react-router-dom";
import { OptimizationResults } from "../../custom/CrossingInterface";

export function ResultsAsNumeric() {
	const location = useLocation();
	const results: OptimizationResults = location.state.results ?? true;
	const parsedResults = results.results;
	const crossingName: string = location.state.crossingName ?? true;
	return (
		<>
			<Navbar />
			<div>
				<h3>Results as numeric for: {crossingName}</h3>
				<NumericResultsUl>
					{parsedResults.length > 0 ? (
						parsedResults.map((result) => (
							<NumericResultsLi key={result.lightId}>
								<NumericResultsPanel>
									<HeaderInfo>Light ID:</HeaderInfo>
									<p>light#{result.lightId}</p>
								</NumericResultsPanel>
								<NumericResultsPanel>
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
											/>
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
					<BaseButtonLink to="../crossing-choice" relative="path">
						Go back to crossing choice panel
					</BaseButtonLink>
				</NeutralNegativeButton>
			</div>
		</>
	);
}
