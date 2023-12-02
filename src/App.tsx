import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageNotFoundLanding } from "./components/additional/PageNotFoundLanding";
import { Welcome } from "./components/flow/Welcome";
import { Register } from "./components/flow/Register";
import { LogIn } from "./components/flow/LogIn";
import { ListOfCrossroads } from "./components/flow/ListOfCrossroads";
import { CreateNewCrossroad } from "./components/flow/CreateNewCrossroad";
import { AddVideos } from "./components/flow/AddVideos";
import { ResultsChoicePanel } from "./components/flow/ResultsChoicePanel";
import { ResultsAsSimulation } from "./components/flow/ResultsAsSimulation";
import { ResultsAsDescription } from "./components/flow/ResultsAsDescription";
import { CrossroadView } from "./components/flow/CrossroadView";
import { MapLeaflet } from "./components/drawing-tool/MapLeaflet";
import { BasicInformation } from "./components/drawing-tool/BasicInformation";
import { ThemeProvider } from "styled-components";
import { BaseDiv, DarkTheme, LightTheme, BackgroundDiv } from "./styles/MainStyles";
import { ThemeType, ThemeContext } from "./custom/ThemeContext";
import { LoggedUser, UserContext } from "./custom/UserContext";
import { EntrancesAndExits } from "./components/drawing-tool/EntrancesAndExits";
import { TrafficLights } from "./components/drawing-tool/TrafficLights";
import { Connections } from "./components/drawing-tool/Connections";
import { Collisions } from "./components/drawing-tool/Collisions";

function App() {
	const [theme, setTheme] = useState<ThemeType>("light");
	const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

	return (
		<UserContext.Provider value={{ loggedUser, setLoggedUser }}>
			<ThemeContext.Provider value={{ theme, setTheme }}>
				<BrowserRouter>
					<ThemeProvider theme={theme === "light" ? LightTheme : DarkTheme}>
						<BaseDiv>
							<BackgroundDiv />
							<Routes>
								<Route path="/" element={<Welcome />} />
								<Route path="register" element={<Register />} />
								<Route path="login" element={<LogIn />} />
								<Route
									path="crossroad-list"
									element={<ListOfCrossroads />}
								/>
								<Route
									path="new-crossroad"
									element={<CreateNewCrossroad />}
								>
									<Route
										path="location-selection"
										element={<MapLeaflet />}
									/>
									<Route
										path="basic-information"
										element={<BasicInformation />}
									/>
									<Route
										path="entrances-and-exits"
										element={<EntrancesAndExits />}
									/>
									<Route
										path="connections"
										element={<Connections />}
									/>
									<Route
										path="traffic-lights"
										element={<TrafficLights />}
									/>
									<Route path="collisions" element={<Collisions />} />
									<Route path="*" element={<PageNotFoundLanding />} />
								</Route>
								<Route path="add-videos" element={<AddVideos />} />
								<Route
									path="crossroad-view/:crossroadId"
									element={<CrossroadView />}
								/>
								<Route
									path="results-choice"
									element={<ResultsChoicePanel />}
								/>
								<Route
									path="results-simulation"
									element={<ResultsAsSimulation />}
								/>
								<Route
									path="results-descriptive"
									element={<ResultsAsDescription />}
								/>
								<Route path="*" element={<PageNotFoundLanding />} />
							</Routes>
						</BaseDiv>
					</ThemeProvider>
				</BrowserRouter>
			</ThemeContext.Provider>
		</UserContext.Provider>
	);
}

export default App;
