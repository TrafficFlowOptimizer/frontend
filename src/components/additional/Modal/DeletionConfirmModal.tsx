import React from "react";
import { PageHeader, ButtonsDiv } from "../../../styles/MainStyles";
import { CenteredInfo } from "../../../styles/MainStyles";
import { NegativeButton } from "../../../styles/NegativeButton";
import { NeutralPositiveButton } from "../../../styles/NeutralButton";
import { StyledModal } from "../../../styles/modal/ModalStyles";
import styled from "styled-components";

export type DeletionConfirmModalProps = {
	crossroadId: string;
	crossroadName: string;
	onClose: () => void;
	onDelete: () => void;
};

export function DeletionConfirmModal(props: DeletionConfirmModalProps) {
	return (
		<DeletionModal>
			<PageHeader>Delete {props.crossroadName}</PageHeader>
			<CenteredInfo>
				Are you sure you want to delete this crossroad?
				<br />
				Once you confirm it, your decision is irreversible!
			</CenteredInfo>
			<ButtonsDiv>
				<NegativeButton onClick={props.onClose}>Abort</NegativeButton>
				<NeutralPositiveButton onClick={props.onDelete}>
					Confirm
				</NeutralPositiveButton>
			</ButtonsDiv>
		</DeletionModal>
	);
}

const DeletionModal = styled(StyledModal)`
	width: 50vw;
	height: 30vh;

	left: calc(50% - 25vw);
`;
