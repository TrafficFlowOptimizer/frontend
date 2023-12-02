import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../custom/UserContext";
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
	StyledItemTd,
	StyledItemTr,
	StyledTable,
	StyledTableHeader,
} from "../../styles/CrossroadListStyles";
import { NegativeButton } from "../../styles/NegativeButton";
import {
	getCurrentUserName,
	getUserJWTToken,
} from "../../custom/drawing-tool/AuxiliaryFunctions";
import { Backdrop } from "../additional/Modal/Backdrop";
import { DeletionConfirmModal } from "../additional/Modal/DeletionConfirmModal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export function ListOfCrossroads() {
	const { loggedUser } = useUserContext();
	const navigate = useNavigate();
	const [listOfCrossroads, setListOfCrossroads] = useState<Crossroad[]>([]);
	const [chosenCrossroadId, setChosenCrossroadId] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [crossroadToDelete, setCrossroadToDelete] = useState<string[]>([]);
	const [deletedCounter, setDeletedCounter] = useState(0);

	const currentUsername =
		loggedUser !== null ? loggedUser.username : getCurrentUserName();

	const [alertMessage, setAlertMessage] = useState("");
	const [requestSuccessful, setRequestSuccessful] = useState(true);
	const [showAlert, setShowAlert] = useState(false);

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
	}, [deletedCounter]); //using useEffect here is deprecated

	const handleChooseButton = (crossroad_id: string, is_chosen: boolean) => {
		if (is_chosen) {
			setChosenCrossroadId(null);
		} else {
			setChosenCrossroadId(crossroad_id);
		}
	};

	const handleToCrossroadView = () => {
		navigate(`../crossroad-view/${chosenCrossroadId}`, {
			state: { crossroadID: chosenCrossroadId },
		});
	};

	const onClickDeleteButton = (crossroadId: string, crossroadName: string) => {
		setCrossroadToDelete([crossroadId, crossroadName]);
		setShowDeleteModal(true);
	};

	const onConfirmDeletion = () => {
		axios
			.delete<boolean>(`/crossroad/${crossroadToDelete[0]}`, {
				headers: {
					Authorization: `Bearer ${
						loggedUser !== null ? loggedUser.jwtToken : getUserJWTToken()
					}`,
				},
			})
			.then((response) => {
				if (response.data) {
					setRequestSuccessful(true);
					setDeletedCounter((prev) => prev + 1);
					setAlertMessage(`Crossroad ${crossroadToDelete[1]} deleted!`);
				} else {
					setRequestSuccessful(false);
					setAlertMessage(
						`Delete request for ${crossroadToDelete[1]} failed!`,
					);
				}
				setShowAlert(true);
				setShowDeleteModal(false);
			})
			.catch((error) => {
				setRequestSuccessful(false);
				setShowDeleteModal(false);
				if (error.response.status === 404) {
					setAlertMessage("Crossroad not found in database!");
				} else {
					setAlertMessage(`Error ${error.code}`);
				}
			});
	};

	const onCloseModal = () => {
		setShowDeleteModal(false);
	};

	return (
		<ContainerDiv>
			<Navbar />
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showAlert}
				autoHideDuration={5000}
				onClose={() => {
					setShowAlert(false);
				}}
			>
				<Alert
					variant="filled"
					severity={requestSuccessful ? "success" : "error"}
				>
					<strong>{alertMessage}</strong>
				</Alert>
			</Snackbar>
			{showDeleteModal && (
				<>
					<DeletionConfirmModal
						onDelete={onConfirmDeletion}
						onClose={onCloseModal}
						crossroadName={crossroadToDelete[1]}
						crossroadId={crossroadToDelete[0]}
					/>
					<Backdrop />
				</>
			)}
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
							listOfCrossroads.map((crossroad) => {
								const chosen = chosenCrossroadId === crossroad.id;
								return (
									<StyledItemTr chosen={chosen} key={crossroad.id}>
										<StyledItemTd>{crossroad.id}</StyledItemTd>
										<StyledItemTd>{crossroad.name}</StyledItemTd>
										<StyledItemTd>
											{crossroad.location}
										</StyledItemTd>
										<StyledItemTd>{crossroad.type}</StyledItemTd>
										<StyledItemTd>
											<ButtonsDiv>
												{chosen ? (
													<NeutralNegativeButton
														onClick={() =>
															handleChooseButton(
																crossroad.id,
																chosen,
															)
														}
													>
														Unselect
													</NeutralNegativeButton>
												) : (
													<NeutralPositiveButton
														onClick={() =>
															handleChooseButton(
																crossroad.id,
																false,
															)
														}
													>
														Choose
													</NeutralPositiveButton>
												)}
												<NegativeButton
													onClick={() => {
														onClickDeleteButton(
															crossroad.id,
															crossroad.name,
														);
													}}
													disabled={
														crossroad.type === "PUBLIC" &&
														process.env
															.REACT_APP_ADMIN_USERNAME! !==
															currentUsername
													}
												>
													Delete
												</NegativeButton>
											</ButtonsDiv>
										</StyledItemTd>
									</StyledItemTr>
								);
							})}
					</tbody>
				</StyledTable>
			)}
			<ButtonsDiv>
				<BaseButtonLink
					to="../new-crossroad/location-selection"
					relative="path"
				>
					<PositiveButton>Create new crossing</PositiveButton>
				</BaseButtonLink>
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
