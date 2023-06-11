import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageNotFoundLanding } from "./components/additional/PageNotFoundLanding";
import { Welcome } from "./components/flow/Welcome";
import { Register } from "./components/flow/Register";
import { LogIn } from "./components/flow/LogIn";
import { CrossroadChoicePanel } from "./components/flow/CrossroadChoicePanel";
import { ListOfCrossroads } from "./components/flow/ListOfCrossroads";
import { CreateNewCrossroad } from "./components/flow/CreateNewCrossroad";
import { AddVideos } from "./components/flow/AddVideos";
import { VideosList } from "./components/flow/VideosList";
import { ResultsChoicePanel } from "./components/flow/ResultsChoicePanel";
import { ResultsAsSimulation } from "./components/flow/ResultsAsSimulation";
import { ResultsAsNumeric } from "./components/flow/ResultsAsNumeric";
import { ThemeProvider } from "styled-components";
import { BaseDiv, DarkTheme, LightTheme } from "./styles/MainTheme";
import { ThemeType, ThemeContext } from "./custom/ThemeContext";
import { LoggedUser, UserContext } from "./custom/UserContext";

function App() {
	const [theme, setTheme] = useState<ThemeType>("light");
	const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

	return (
		<UserContext.Provider value={{ loggedUser, setLoggedUser }}>
			<ThemeContext.Provider value={{ theme, setTheme }}>
				<BrowserRouter>
					<ThemeProvider theme={theme === "light" ? LightTheme : DarkTheme}>
						<BaseDiv>
							<Routes>
								<Route path="/" element={<Welcome />} />
								<Route path="register" element={<Register />} />
								<Route path="login" element={<LogIn />} />
								<Route
									path="crossroad-choice"
									element={<CrossroadChoicePanel />}
								/>
								<Route
									path="crossroad-choice/list"
									element={<ListOfCrossroads />}
								/>
								<Route
									path="crossroad-choice/new"
									element={<CreateNewCrossroad />}
								/>
								<Route path="add-videos" element={<AddVideos />} />
								<Route path="list-videos" element={<VideosList />} />
								<Route
									path="results-choice"
									element={<ResultsChoicePanel />}
								/>
								<Route
									path="results-simulation"
									element={<ResultsAsSimulation />}
								/>
								<Route
									path="results-numeric"
									element={<ResultsAsNumeric />}
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
