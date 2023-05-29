import React, { useEffect, useState } from "react";
import { Navbar } from "../additional/Navbar";
import { BaseButtonLink } from "../../styles/MainTheme";
import {
  NeutralNegativeButton,
  NeutralPositiveButton
} from "../../styles/NeutralButton";
import { PositiveButton } from "../../styles/PositiveButton";
import {
  StyledTableHeader,
  StyledTable,
  StyledItemTr,
  StyledItemTd
} from "../../styles/CrossroadListStyles";
import {
  Crossroad,
  CrossroadType,
  OptimizationResults
} from "../../custom/CrossroadInterface";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PopUp } from "../additional/Modal/PopUp";
import { Backdrop } from "../additional/Modal/Backdrop";

export type tableCrossroadState = "chosen" | "not chosen";

export function ListOfCrossroads() {
  // const hardcodedCrossroad: Crossroad = {
  // 	_id: "crs2137",
  // 	name: "Małe skrzyżowanie na Czyżynach",
  // 	location: "al. Jana Pawła II",
  // 	creatorId: "1aaa",
  // 	type: CrossroadType.PRIVATE,
  // 	roadIds: [],
  // 	collisionsIds: [],
  // 	trafficLightsIds: [],
  // };
  //
  // const hardcodedCrossroad2: Crossroad = {
  // 	_id: "crs4200",
  // 	name: "Małe skrzyżowanie na Bałutach",
  // 	location: "al. Pokoju",
  // 	creatorId: "1aaa",
  // 	type: CrossroadType.PRIVATE,
  // 	roadIds: [],
  // 	collisionsIds: [],
  // 	trafficLightsIds: [],
  // };
  //
  // const hardcodedCrossroad3: Crossroad = {
  // 	_id: "crs69669",
  // 	name: "Małe skrzyżowanie na Mokotowie",
  // 	location: "al. Jerozolimskie",
  // 	creatorId: "1aaa",
  // 	type: CrossroadType.PRIVATE,
  // 	roadIds: [],
  // 	collisionsIds: [],
  // 	trafficLightsIds: [],
  // };
  const [listOfCrossroads, setListOfCrossroads] = useState<Crossroad[]>([
    // hardcodedCrossroad,
    // hardcodedCrossroad2,
    // hardcodedCrossroad3,
  ]);
  const [chosenCrossroadId, setChosenCrossroadId] = useState<string | null>(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const navigate = useNavigate();
  //normally list of crossroads would be obtained by rest, but for now we will have it hardcode;
  useEffect(() => {
    // TODO: get sie dwa razy wywoluje
    // console.log("get call");
    axios
      .get<Crossroad[]>("/crossroad")
      .then((response) => {
        // console.log(response.data);
        const crossroadsData: Crossroad[] = response.data;
        // console.log(crossroadsData[0]);
        setListOfCrossroads(crossroadsData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getChosenCrossroadName = (): string => {
    return listOfCrossroads.filter(
      (crossroad) => chosenCrossroadId === crossroad.id
    )[0].name;
  };

  const handleOptimizationOrder = () => {
    setShowLoadingModal(true);
    axios
      .get<JSON>(
        // "/crossroad/" + chosenCrossroadId + "/optimization",
        "/crossroad/" + chosenCrossroadId + "/optimization/" + String(30)
      )
      .then((response) => {
        const optimizationData: JSON = response.data;
        // navigate("../../results-choice", { state: optimizationData });
        navigate("../../results-choice", {
          state: {
            results: optimizationData,
            crossroadName: getChosenCrossroadName()
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
    // const mockedOptimizationData: OptimizationResults = {
    // 	results: [
    // 		{
    // 			lightId: 1,
    // 			sequence: [
    // 				0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1,
    // 				0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0,
    // 				0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    // 			],
    // 			flow: 2.3,
    // 		},
    // 		{
    // 			lightId: 2,
    // 			sequence: [
    // 				0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0,
    // 				1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1,
    // 				1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    // 			],
    // 			flow: 0.3,
    // 		},
    // 		{
    // 			lightId: 3,
    // 			sequence: [
    // 				0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0,
    // 				1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0,
    // 				0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    // 			],
    // 			flow: 1.5,
    // 		},
    // 	],
    // };
    // setTimeout(() => {
    // 	navigate("../../results-choice", {
    // 		state: {
    // 			results: mockedOptimizationData,
    // 			crossroadName: getChosenCrossroadName(),
    // 		},
    // 	});
    // }, 10000);
  };

  const handleChooseButton = (
    crossroad_id: string,
    current_state: tableCrossroadState
  ) => {
    console.log(crossroad_id, current_state);
    if (current_state === "chosen") {
      setChosenCrossroadId(null);
    } else {
      setChosenCrossroadId(crossroad_id);
    }
  };

  return (
    <>
      {showLoadingModal && (
        <>
          <PopUp
            textToDisplay={`Optimizing ${getChosenCrossroadName()} crossroad. This might take a while...\nSit back and relax`}
          />
          <Backdrop />
        </>
      )}
      <Navbar />
      {listOfCrossroads.length == 0 ? (
        <p>No crossroads available</p>
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
                  <StyledItemTd>{crossroad.location}</StyledItemTd>
                  <StyledItemTd>{crossroad.type}</StyledItemTd>
                  <StyledItemTd>
                    {
                      chosen ?
                        <NeutralNegativeButton
                          onClick={() =>
                            handleChooseButton(
                              crossroad.id,
                              "chosen"
                            )
                          }
                        >
                          {!chosen ? "Choose" : "Unselect"}
                        </NeutralNegativeButton> :
                        <NeutralPositiveButton
                          onClick={() =>
                            handleChooseButton(
                              crossroad.id,
                              "not chosen"
                            )
                          }
                        >
                          {!chosen ? "Choose" : "Unselect"}
                        </NeutralPositiveButton>
                    }
                  </StyledItemTd>
                </StyledItemTr>
              );
            })}
          </tbody>
        </StyledTable>
      )}
      <NeutralPositiveButton>
        <BaseButtonLink to="../../list-videos" relative="path">
          See video footage for chosen crossroad
        </BaseButtonLink>
      </NeutralPositiveButton>
      <PositiveButton>
        <BaseButtonLink to="../../add-videos" relative="path">
          Add new video for chosen crossroad
        </BaseButtonLink>
      </PositiveButton>
      <PositiveButton>
        <BaseButtonLink to="../new" relative="path">
          Create new crossroad
        </BaseButtonLink>
      </PositiveButton>
      <NeutralNegativeButton
        disabled={chosenCrossroadId === null}
        onClick={handleOptimizationOrder}
      >
        {/*<BaseButtonLink to="../../results-choice" relative="path">*/}
        Order optimization for chosen crossroad and go to results choice panel
        {/*</BaseButtonLink>*/}
      </NeutralNegativeButton>
    </>
  );
}
