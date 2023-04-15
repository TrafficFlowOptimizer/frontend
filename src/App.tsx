import React from "react";
import { Route, Routes } from "react-router-dom";
import { PageNotFoundLanding } from "./components/additional/PageNotFoundLanding";
import { Welcome } from "./components/flow/Welcome";
import { Register } from "./components/flow/Register";
import { LogIn } from "./components/flow/LogIn";
import { CrossingChoicePanel } from "./components/flow/CrossingChoicePanel";
import { ListOfCrossings } from "./components/flow/ListOfCrossings";
import { CreateNewCrossing } from "./components/flow/CreateNewCrossing";
import { AddVideos } from "./components/flow/AddVideos";
import { VideosList } from "./components/flow/VideosList";
import { ResultsChoicePanel } from "./components/flow/ResultsChoicePanel";
import { ResultsAsSimulation } from "./components/flow/ResultsAsSimulation";
import { ResultsAsNumeric } from "./components/flow/ResultsAsNumeric";

function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route path="register" element={<Register />} />
				<Route path="login" element={<LogIn />} />
				<Route path="crossing-choice" element={<CrossingChoicePanel />} />
				<Route path="crossing-choice/list" element={<ListOfCrossings />} />
				<Route path="crossing-choice/new" element={<CreateNewCrossing />} />
				<Route path="add-videos" element={<AddVideos />} />
				<Route path="list-videos" element={<VideosList />} />
				<Route path="results-choice" element={<ResultsChoicePanel />} />
				<Route path="results-simulation" element={<ResultsAsSimulation />} />
				<Route path="results-numeric" element={<ResultsAsNumeric />} />
				<Route path="*" element={<PageNotFoundLanding />} />
			</Routes>
		</div>
	);
}

export default App;
