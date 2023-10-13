import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../custom/ThemeContext";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { toPng } from "html-to-image";
import { WaitingPopUp } from "../additional/Modal/WaitingPopUp";
import { Backdrop } from "../additional/Modal/Backdrop";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	DarkMapStyles,
	LightMapStyles,
	mapContainerStyle,
	LeafletContainer,
} from "../../styles/drawing-tool-styles/MapStyles";
import { NegativeButton } from "../../styles/NegativeButton";
import { ButtonsDiv } from "../../styles/MainStyles";
import {
	WorkaroundInnerDiv,
	CreatorInformation,
} from "../../styles/drawing-tool-styles/GeneralStyles";

export function MapLeaflet() {
	const { theme } = useThemeContext();
	const navigate = useNavigate();
	const [showWaitingModal, setShowWaitingModal] = useState(false);

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
	});

	const mapRef = useRef<google.maps.Map | null>(null);
	const screenshotRef = useRef<HTMLDivElement>(null);

	const onButtonClick = useCallback(() => {
		setShowWaitingModal(true);

		if (screenshotRef.current === null) {
			return;
		}

		toPng(screenshotRef.current, {
			cacheBust: true,
			skipFonts: true,
			canvasWidth: 1250,
			canvasHeight: 560,
			width: 1220,
			height: 560,
			includeQueryParams: true,
		})
			.then((dataUrl) => {
				localStorage.setItem("crossroadMap", dataUrl);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [screenshotRef]);

	const onLoad = (map: google.maps.Map): void => {
		mapRef.current = map;
	};

	const onUnMount = (): void => {
		mapRef.current = null;
	};

	const initialCenter = {
		lat: 50.048727868815526,
		lng: 19.93246018908391,
	};

	const mapOptions = {
		styles: theme === "light" ? LightMapStyles : DarkMapStyles,
		disableDefaultUI: false,
		zoomControl: true,
	};

	const onAbort = () => {
		navigate("../../crossroad-list");
		// localStorage.removeItem("crossroadMap");
	};

	return !isLoaded ? (
		<LeafletContainer>Loading Error</LeafletContainer>
	) : (
		<>
			{showWaitingModal && (
				<>
					<WaitingPopUp
						textToDisplay={
							"Setting up crossroad model base and saving image in local storage..."
						}
						waitingTime={2}
						whereToNavigate={"../basic-information"}
					/>
					<Backdrop />
				</>
			)}
			<LeafletContainer>
				<CreatorInformation>
					{/* eslint-disable-next-line react/no-unescaped-entities */}
					Please choose location, adjust zoom-out and press "Next" button
					<br />
					When creating the crossroad, you can only go forward or abort
					creation entirely!
					<br />
					Take your time and customize it to your liking!
				</CreatorInformation>
				<WorkaroundInnerDiv ref={screenshotRef}>
					<GoogleMap
						mapContainerStyle={mapContainerStyle}
						options={mapOptions}
						center={initialCenter}
						zoom={18}
						onLoad={onLoad}
						onUnmount={onUnMount}
					/>
				</WorkaroundInnerDiv>
				<ButtonsDiv>
					<NegativeButton onClick={onAbort}>Abort</NegativeButton>
					<PositiveButton onClick={onButtonClick}>Next</PositiveButton>
				</ButtonsDiv>
			</LeafletContainer>
		</>
	);
}
