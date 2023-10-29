import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Crossroad } from "../../custom/CrossroadInterface";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink, ButtonsDiv, ContainerDiv } from "../../styles/MainStyles";
import {
	NeutralNegativeButton,
	NeutralPositiveButton,
} from "../../styles/NeutralButton";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	StyledTableHeader,
	StyledTable,
	StyledItemTr,
	StyledItemTd,
} from "../../styles/CrossroadListStyles";
import { useUserContext } from "../../custom/UserContext";

export type tableCrossroadState = "chosen" | "not chosen";

export function ListOfCrossroads() {
	const { loggedUser } = useUserContext();
	const navigate = useNavigate();
	const [listOfCrossroads, setListOfCrossroads] = useState<Crossroad[]>([]);
	const [chosenCrossroadId, setChosenCrossroadId] = useState<string | null>(null);

	useEffect(() => {
		if (loggedUser !== null) {
			axios
				.get<Crossroad[]>("/crossroad", {
					params: { getPrivate: true },
					headers: { Authorization: `Bearer ${loggedUser.jwtToken}` },
				})
				.then((response) => {
					const crossingsData: Crossroad[] = response.data;
					setListOfCrossroads(crossingsData);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, []); //using useEffect here is deprecated

	const handleChooseButton = (
		crossroad_id: string,
		current_state: tableCrossroadState,
	) => {
		if (current_state === "chosen") {
			setChosenCrossroadId(null);
		} else {
			setChosenCrossroadId(crossroad_id);
		}
	};

	const handleToCrossroadView = () => {
		navigate(`../crossroad-view/${chosenCrossroadId}`, {
			state: { crossroadID: chosenCrossroadId },
		});
		//crossroad-view/:crossroad-id
	};

	return (
		<ContainerDiv>
			<Navbar />
			{listOfCrossroads.length == 0 ? (
				<p>No crossings available</p>
			) : (
				<StyledTable>
					<tbody>
						<tr>
							<StyledTableHeader>ID</StyledTableHeader>
							<StyledTableHeader>Name</StyledTableHeader>
							<StyledTableHeader>Location</StyledTableHeader>
							<StyledTableHeader>Type</StyledTableHeader>
							<StyledTableHeader>Action</StyledTableHeader>
						</tr>
						{listOfCrossroads.length > 0 &&
							listOfCrossroads.map((crossing) => {
								const chosen = chosenCrossroadId === crossing.id;
								return (
									<StyledItemTr chosen={chosen} key={crossing.id}>
										<StyledItemTd>{crossing.id}</StyledItemTd>
										<StyledItemTd>{crossing.name}</StyledItemTd>
										<StyledItemTd>{crossing.location}</StyledItemTd>
										<StyledItemTd>{crossing.type}</StyledItemTd>
										<StyledItemTd>
											{chosen ? (
												<NeutralNegativeButton
													onClick={() =>
														handleChooseButton(
															crossing.id,
															!chosen
																? "not chosen"
																: "chosen",
														)
													}
												>
													Unselect
												</NeutralNegativeButton>
											) : (
												<NeutralPositiveButton
													onClick={() =>
														handleChooseButton(
															crossing.id,
															"not chosen",
														)
													}
												>
													Choose
												</NeutralPositiveButton>
											)}
										</StyledItemTd>
									</StyledItemTr>
								);
							})}
					</tbody>
				</StyledTable>
			)}
			<ButtonsDiv>
				<PositiveButton>
					<BaseButtonLink
						to="../new-crossroad/location-selection"
						relative="path"
					>
						Create new crossing
					</BaseButtonLink>
				</PositiveButton>
				<NeutralPositiveButton
					disabled={chosenCrossroadId === null}
					onClick={handleToCrossroadView}
				>
					Go to crossroad view
				</NeutralPositiveButton>
			</ButtonsDiv>
		</ContainerDiv>
	);
}
