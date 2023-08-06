import React from "react";
import styled from "styled-components";

export type BackdropProps = {
	onClick(): void;
};

export function Backdrop() {
	return <StyledBackdrop />;
}

export const StyledBackdrop = styled.div`
	position: fixed;
	z-index: 6;
	background-color: rgba(0, 0, 0, 0.75);
	width: 100%;
	height: 100vh;
	top: 0;
	left: 0;
`;
