import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  handleAddLocationsBySwitch,
  handleAddMachinesBySwitch,
  handleAddSpecificLocationsBySwitch,
  handleLocationSelectBySwitch,
  handleMachineSelectBySwitch,
  handleSelectAllBySwitch,
  handleSelectedOneBySwitch,
  handleSpecificLocationSelectBySwitch,
  selectMCBySwitch,
} from "../store/slices/masterControlBySwitchSelectSlice";

import {
  handleAddLocationsByLocation,
  handleAddMachinesByLocation,
  handleAddSpecificLocationsByLocation,
  handleLocationSelectByLocation,
  handleMachineSelectByLocation,
  handleSelectAllByLocation,
  handleSelectedOneByLocation,
  handleSpecificLocationSelectByLocation,
  selectMCByLocation,
} from "../store/slices/masterControlSelectByLocationSlice";

import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerBDark,
  layerCLighter,
} from "../styles/commonStyles";

import SelectOptions from "../masterControl/controls/mainSelection/SelectOptions";
import SelectSubOptions from "../masterControl/controls/mainSelection/SelectSubOptions";
import {
  selectLocationsHandler,
  selectMachinesHandler,
  selectSpecificLocationsHandler,
  unselectAllMachinesHandler,
} from "../../hooks/useSelectSwitchesDispatches";
import { useSelectBoxArrowsState } from "../../hooks/useSelectBoxArrowsState";
import {
  getAllSpecificLocationNames,
  transformSpecificLocationData,
} from "../../helpers/helpers";
import selectBoxResetHandler from "../../helpers/ess-tgs-tes-mc/selectBoxResetHandler";
import { selectAllHandler } from "../../helpers/ess-tgs-tes-mc/select_box_logic/selectAllHandler";
import { selectAllDispatchHandler } from "../../helpers/ess-tgs-tes-mc/select_box_dispatchers/selectAllDispatchHandler";
import { selectLocationHandler } from "../../helpers/ess-tgs-tes-mc/select_box_logic/selectLocationHandler";
import { selectLocationDispatchHandler } from "../../helpers/ess-tgs-tes-mc/select_box_dispatchers/selectLocationDispatchHandler";
import { selectSpecificLocationHandler } from "../../helpers/ess-tgs-tes-mc/select_box_logic/selectSpecificLocationHandler";
import { selectSpecificLocationDispatchHandler } from "../../helpers/ess-tgs-tes-mc/select_box_dispatchers/selectSpecificLocationDispatchHandler";
import { selectMachineHandler } from "../../helpers/ess-tgs-tes-mc/select_box_logic/selectMachineHandler";
import { selectMachineDispatchHandler } from "../../helpers/ess-tgs-tes-mc/select_box_dispatchers/selectMachineDispatchHandler";
import SelectSpecificLocationOptions from "../masterControl/controls/mainSelection/SelectSpecificLocationOptions";

const SelectMachineItems = ({
  handleClose,
  data,
  dataE,
  swtName,
  name,
  scope,
  isMobile,
  specificLocation,
}) => {
  const { trackSpecLocationArrowState, trackArrowState, specificLocations } =
    useSelectBoxArrowsState(data);

  const [isSpecLocationArrowDown, setIsSpecLocationArrowDown] = useState(
    trackSpecLocationArrowState
  );
  const [isArrowDown, setIsArrowDown] = useState(trackArrowState);
  const [specificLocationsNameList, setSpecificLocationsNameList] = useState(
    []
  );
  const [isSelected, setIsSelected] = useState(false);
  const dispatch = useDispatch();

  let locations = Object.keys(data);
  // scope has location name
  let machinesArr;
  if (data && data[scope] && !data[scope].isSpecificLocation) {
    machinesArr = Object.keys(data[scope].devices);
    // locations = null
  }
  let subLocationArr;

  const locationIndex = scope !== "switch" && locations.indexOf(scope);

  const specificLocationIdx =
    specificLocation &&
    scope !== "switch" &&
    Object.keys(data[scope]).indexOf(specificLocation);

  const buttons = isMobile
    ? name === "shutOff"
      ? ["clear", "apply"]
      : ["clear", "select"]
    : ["clear", "select"];
  const mCBySwitch = useSelector(
    scope === "switch" ? selectMCBySwitch : selectMCByLocation
  );
  const {
    // for styling
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    // for dispatch
    selectedLocations,
    selectedSpecificLocations,
    selectedMachines,
  } =
    name === "instantHeat"
      ? mCBySwitch.instantHeat
      : name === "snowSensor"
      ? mCBySwitch.snowSensor
      : name === "windFactor"
      ? mCBySwitch.windFactor
      : name === "optionalConstant"
      ? mCBySwitch.optionalConstant
      : name === "heatingSchedule"
      ? mCBySwitch.heatingSchedule
      : name === "ats"
      ? mCBySwitch.ats
      : name === "shutOff"
      ? mCBySwitch.shutOff
      : mCBySwitch.fanOnly;
  useEffect(() => {
    const result = getAllSpecificLocationNames(data);
    setSpecificLocationsNameList(result);
  }, [data]);
  const switchCountHandler = (machines, selectOneFC) => {
    let selectedSwtNumber = 0;
    machines.forEach((location) =>
      location.forEach((machine) => {
        if (typeof machine === "object") {
          machine.forEach((el) => {
            if (el) {
              selectedSwtNumber += 1;
            }
          });
        } else {
          if (machine) {
            selectedSwtNumber += 1;
          }
        }
      })
    );
    dispatch(
      selectOneFC({
        controller: name,
        selectedOne: `${selectedSwtNumber} switches`,
      })
    );
  };

  // Clear and Apply Button handler
  const handleOnClick = (button) => {
    if (button === buttons[1]) {
      // logic for count selected machine numbers
      let switchData;
      // if (scope !== "switch") {
      //   switchData = transformSpecificLocationData(data, scope);
      // } else {
      switchData = data;

      scope === "switch"
        ? switchCountHandler(isMachineSelected, handleSelectedOneBySwitch)
        : switchCountHandler(isMachineSelected, handleSelectedOneByLocation);

      // Apply button
      //spereated scenerio for switch and location

      if (isAllSelected) {
        // 1. selected All
        // dispatch

        scope === "switch"
          ? dispatch(
              handleSelectedOneBySwitch({
                controller: name,
                selectedOne: "all",
              })
            )
          : dispatch(
              handleSelectedOneByLocation({
                controller: name,
                selectedOne: "all",
              })
            );
        if (specificLocation) {
          // 1.1 when selected all, dispatch all machines in selected specific location
          const allMachines = Object.keys(
            switchData[scope][specificLocation]
          ).map((machineName) => [scope, specificLocation, machineName]);

          selectMachinesHandler(allMachines, swtName, switchData, dispatch);
        }
        //    else if (scope && scope !== "switch") {
        // console.log(switchData,specificLocation,"handleOnClickXXX")

        //     // 1.2 when selected all, dispatch all specific locations in  selected location
        //     const allSpecificLocation = Object.keys(switchData[scope]);
        //     selectSpecificLocationsHandler(
        //       allSpecificLocation,
        //       swtName,
        //       switchData,
        //       dispatch
        //     );
        //   } else {
        // #1.3 select locations

        selectLocationsHandler(locations, swtName, switchData, dispatch);
        // }
      } else if (isLocationSelected.indexOf(true) !== -1) {
        // 2.1 update isLocationSelected
        selectLocationsHandler(
          selectedLocations,
          swtName,
          switchData,
          dispatch
        );

        // #2.2.update isSpecificLocationSelected
        if (selectedSpecificLocations.length > 0) {
          selectSpecificLocationsHandler(
            selectedSpecificLocations,
            swtName,
            switchData,
            dispatch
          );
        }

        if (selectedMachines.length > 0) {
          // 2.3. update isMachineSelected
          selectMachinesHandler(
            selectedMachines,
            swtName,
            switchData,
            dispatch
          );
        }
      } else if (isSpecificLocationSelected.length > 0) {
        // #3. update isSpecificLocationSelected
        selectSpecificLocationsHandler(
          selectedSpecificLocations,
          swtName,
          switchData,
          dispatch
        );

        // #3.1. update isMachineSelected
        if (selectedMachines.length > 0) {
          selectMachinesHandler(
            selectedMachines,
            swtName,
            switchData,
            dispatch
          );
        }
      } else if (selectedMachines.length > 0) {
        // #4.only selected individual machines
        selectMachinesHandler(selectedMachines, swtName, switchData, dispatch);
      } else if (!isSelected) {
        scope === "switch"
          ? dispatch(
              handleSelectedOneBySwitch({ controller: name, selectedOne: null })
            )
          : dispatch(
              handleSelectedOneByLocation({
                controller: name,
                selectedOne: null,
              })
            );
      }

      handleClose();
    } else {
      let switchData;
      // if (scope !== "switch") {
      //   switchData = transformSpecificLocationData(data, scope);
      // } else {
      switchData = data;

      const { locationList, specificLocationList, machineList } =
        selectBoxResetHandler(switchData);
      // const specificLocationArr = [];
      // const machineArr = Object.values(data).map((location) =>
      //   Object.values(location).map((value) => {
      //     if (value.machineType) {
      //       return false;
      //     } else {
      //       const machinesList = Object.values(location).flatMap(
      //         (specLocation) => Object.keys(specLocation).map((el) => false)
      //       );
      //       const specLocation = Object.keys(location).map((el) => false);
      //       specificLocationArr.push(specLocation);
      //       return machinesList;
      //     }
      //   })
      // );

      // const filteredSpecificLocationArr = specificLocationArr.filter(
      //   (subArray) => subArray.length > 0
      // );

      // const locationArr = locations.map((location) => false);

      const resetObj = { controller: name, arr: [] };
      const locationResetObj = { controller: name, arr: locationList };
      const specificLocationResetObj = {
        arr: specificLocationList,
        controller: name,
      };
      const machineResetObj = { controller: name, arr: machineList };
      // Clear button
      if (scope === "switch") {
        // 1.reset all and title (selected one)
        dispatch(handleSelectAllBySwitch({ controller: name, status: false }));
        dispatch(
          handleSelectedOneBySwitch({ controller: name, selectedOne: null })
        );

        // 2. Empty selected location names
        dispatch(handleAddLocationsBySwitch(resetObj));
        // 2.1. Empty selected specific location names and machine names
        dispatch(handleAddSpecificLocationsBySwitch(resetObj));
        // 2.2. Empty selected  machine names
        dispatch(handleAddMachinesBySwitch(resetObj));

        // 3. reset isLocationSelected to an array of false
        dispatch(handleLocationSelectBySwitch(locationResetObj));
        // 3.1. reset isSpecificLocationSelected to an array of false
        if (specificLocationList.length > 0) {
          dispatch(
            handleSpecificLocationSelectBySwitch(specificLocationResetObj)
          );
        }
        // 3.2. reset isMachineSelected to an array of false
        dispatch(handleMachineSelectBySwitch(machineResetObj));
      } else {
        // 1.reset all and title (selected one)
        dispatch(
          handleSelectAllByLocation({ controller: name, status: false })
        );
        dispatch(
          handleSelectedOneByLocation({ controller: name, selectedOne: null })
        );

        // 2. Empty selected location names
        dispatch(handleAddLocationsByLocation(resetObj));
        // 2.2. Empty selected  specific location names
        dispatch(handleAddSpecificLocationsByLocation(resetObj));
        // 2.2. Empty selected  machine names
        dispatch(handleAddMachinesByLocation(resetObj));

        // 3. reset isLocationSelected to an array of false
        dispatch(handleLocationSelectByLocation(locationResetObj));

        // 3.1. reset isSpecificLocationSelected to an array of false
        if (specificLocationList.length > 0) {
          dispatch(
            handleSpecificLocationSelectByLocation(specificLocationResetObj)
          );
        }

        // 3.2. reset isMachineSelected to an array of false
        dispatch(handleMachineSelectByLocation(machineResetObj));
      }
      // unSelect all machines of ESS,TGS or TES slice
      unselectAllMachinesHandler(locations, swtName, data, dispatch);
    }
  };

  // Select handler for the indicator
  const handleSelect = (option, machine, extraOption, machineIndex) => {
    setIsSelected(true);
    let switchData;
    // if (scope !== "switch") {
    //   switchData = transformSpecificLocationData(data, scope);
    // } else {
    switchData = data;
    // }

    if (option === "all") {
      // select all Logic
      const { locationList, specificLocationList, machineList } =
        selectAllHandler(
          switchData,
          name,
          isLocationSelected,
          isSpecificLocationSelected
        );
      

      selectAllDispatchHandler(
        dispatch,
        scope,
        name,
        locationList,
        specificLocationList,
        machineList
      );
    } else if (option !== "all" && machine === undefined) {
      // ======= select location logic =====
      // selectLocationHandler(option);
      const {
        locationList,
        specificLocationList,
        machineList,
        newSelectedLocations,
      } = selectLocationHandler(
        switchData,
        option,
        locations,
        isLocationSelected,
        isMachineSelected,
        selectedLocations
      );
      selectLocationDispatchHandler(
        dispatch,
        scope,
        name,
        locationList,
        specificLocationList,
        machineList,
        newSelectedLocations
      );
    }
    //Handle SubLocation
    else if (option !== "all" && machine === "isSpecificLocation") {
      // ======= select specific location logic =====
      const { specificLocationList, machineList, newSpecificLocations } =
        selectSpecificLocationHandler(
          option,
          machineIndex,
          extraOption,
          locations,
          isSpecificLocationSelected,
          isMachineSelected,
          specificLocations,
          selectedSpecificLocations
        );
      selectSpecificLocationDispatchHandler(
        dispatch,
        scope,
        name,
        specificLocationList,
        machineList,
        newSpecificLocations
      );
    } else {
      // ======= select machine logic =====
      const { locationIdx, specLocationIdx, machineIdx, newSelectedMachine } =
        selectMachineHandler(
          option,
          machine,
          extraOption,
          switchData,
          selectedMachines
        );
      selectMachineDispatchHandler(
        dispatch,
        scope,
        name,
        extraOption,
        locationIdx,
        specLocationIdx,
        machineIdx,
        newSelectedMachine
      );
    }
  };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile} isSmall={scope !== "switch"}>
          <SectionOptions isMobile={isMobile} isSmall={scope !== "switch"}>
            <SelectOptions
              isSmall={scope !== "switch"}
              isMobile={isMobile}
              option="all"
              handleSelect={handleSelect}
              isSelected={isAllSelected}
            />

            {/* {scope === 'switch' &&
              locations.map((location, index) => (
                <SelectOptions
                  scope={scope}
                  isMobile={isMobile}
                  key={index}
                  option={location}
                  data={data[location]}
                  handleSelect={handleSelect}
                  isSelected={isLocationSelected[index]}
                  isMachineSelected={
                    isMachineSelected[index] && isMachineSelected[index]
                  }
                />
              ))} */}

            {scope !== "switch" &&
              locations.map((location, index) => {
                console.log(location, "switchDataXX");
                return (
                  <SelectOptions
                    isMobile={isMobile}
                    key={index}
                    index={index}
                    option={location}
                    data={data[location]}
                    newData={data}
                    handleSelect={handleSelect}
                    isSelected={isLocationSelected[index]}
                    isMachineSelected={
                      isMachineSelected[index] && isMachineSelected[index]
                    }
                    isArrowDown={isArrowDown}
                    setIsArrowDown={setIsArrowDown}
                    allSpecificLocationsName={specificLocationsNameList}
                    isSpecificLocationSelected={isSpecificLocationSelected}
                    isSpecLocationArrowDown={isSpecLocationArrowDown}
                    setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                  />
                );
              })}

            {/* individual machine scope option
            {scope !== 'switch' &&
              machinesArr.map((machine, index) => (
                <SelectSubOptions
                  isMobile={isMobile}
                  key={Math.random() * 10000}
                  location={scope}
                  machine={machine}
                  handleSelect={handleSelect}
                  isSelected={isMachineSelected[locationIndex][index]}
                  scope={scope}
                />
              ))} */}

            {/*specific location and individual machine scope option */}
            {/* {scope !== "switch" &&
              subLocationArr.map((machine, index) => {
                return (
                  <SelectSubOptions
                    isMobile={isMobile}
                    key={Math.random() * 10000}
                    location={scope}
                    machine={specificLocation ? machine : "isSpecificLocation"}
                    handleSelect={handleSelect}
                    isSelected={
                      !specificLocation &&
                      isSpecificLocationSelected[locationIndex]
                        ? isSpecificLocationSelected[locationIndex][index]
                        : isMachineSelected.length > 0
                        ? isMachineSelected[locationIndex][specificLocationIdx][
                            index
                          ]
                        : false
                    }
                    scope={scope}
                    specificLocation={
                      specificLocation ? specificLocation : machine
                    }
                    // specLocationName={machine}
                    specificLocationIdx={index}
                  />
                );
              })} */}
          </SectionOptions>

          <SectionButtons isMobile={isMobile} isSmall={scope !== "switch"}>
            {buttons.map((button, index) => (
              <ButtonWrapper
                key={index}
                onClick={() => handleOnClick(button)}
                isMobile={isMobile}
                isSmall={scope !== "switch"}
              >
                <ButtonHole isMobile={isMobile} isSmall={scope !== "switch"}>
                  <ButtonInner isMobile={isMobile} isSmall={scope !== "switch"}>
                    <ButtonTop isMobile={isMobile} isSmall={scope !== "switch"}>
                      {button}
                    </ButtonTop>
                  </ButtonInner>
                </ButtonHole>
              </ButtonWrapper>
            ))}
          </SectionButtons>
        </Wrapper>
      ) : (
        <Wrapper isMobile={isMobile} isSmall={scope !== "switch"}>
          <ScrollWrapper>
            <SectionOptions isMobile={isMobile} isSmall={scope !== "switch"}>
              <SelectOptions
                isSmall={scope !== "switch"}
                isMobile={isMobile}
                option="all"
                handleSelect={handleSelect}
                isSelected={isAllSelected}
              />

              {locations &&
                !machinesArr &&
                locations.map((location, index) => {
                  return (
                    <SelectOptions
                      isMobile={isMobile}
                      key={index}
                      index={index}
                      option={location}
                      data={data[location]}
                      newData={data}
                      handleSelect={handleSelect}
                      isSelected={isLocationSelected[index]}
                      isMachineSelected={
                        isMachineSelected[index] && isMachineSelected[index]
                      }
                      isArrowDown={isArrowDown}
                      setIsArrowDown={setIsArrowDown}
                      allSpecificLocationsName={specificLocationsNameList}
                      isSpecificLocationSelected={isSpecificLocationSelected}
                      isSpecLocationArrowDown={isSpecLocationArrowDown}
                      setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                    />
                  );
                })}

              {/*specific location and individual machine scope option */}
              {}
              {/* {scope !== "switch" && data[scope]?.isSpecificLocation
                ? subLocationArr?.map((subLocation, idx) => {
                    let specificLocationIdx;
                      specificLocationsNameList?.forEach((name, idx) => {
                        if (name.includes(subLocation[0])) {
                          specificLocationIdx = idx;
                        }
                      });
                    console.log({isSpecificLocationSelected,isMachineSelected,specificLocationsNameList}, "specificLocationIdxXX")
                    return (
                      <SelectSpecificLocationOptions
                        key={Math.random() * 10000}
                        location={scope}
                        idx={idx}
                        specLocationName={subLocation[0]}
                        machineData={subLocation[1]?.devices}
                        handleSelect={handleSelect}
                        isSelected={
                          isSpecificLocationSelected &&
                          isSpecificLocationSelected[specificLocationIdx] &&
                          isSpecificLocationSelected[specificLocationIdx][idx]
                        }
                        isMachineSelected={
                          isMachineSelected.length > 0 && isMachineSelected[idx]
                        }
                        isSpecificLocation={true}
                        isSpecificLocationSelected={isSpecificLocationSelected}
                        isSpecLocationArrowDown={isSpecLocationArrowDown}
                        setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                        isMobile={isMobile}
                        // scope={scope}
                        //
                      />
                    );
                  })
                : machinesArr &&
                  machinesArr?.map((machine, index) => {
                    return (
                      <SelectSubOptions
                        isMobile={isMobile}
                        key={Math.random() * 10000}
                        location={scope}
                        machine={machine}
                        handleSelect={handleSelect}
                        isSelected={
                          isMachineSelected &&
                          isMachineSelected[0] &&
                          isMachineSelected[0][index]
                        }
                        scope={scope}
                      />
                    );
                  })} */}
              {machinesArr &&
                machinesArr?.map((machine, index) => {
                  return (
                    <SelectSubOptions
                      isMobile={isMobile}
                      key={Math.random() * 10000}
                      location={scope}
                      machine={machine}
                      handleSelect={handleSelect}
                      isSelected={
                        isMachineSelected &&
                        isMachineSelected[0] &&
                        isMachineSelected[0][index]
                      }
                      scope={scope}
                    />
                  );
                })}
            </SectionOptions>
          </ScrollWrapper>

          <SectionButtons isMobile={isMobile} isSmall={scope !== "switch"}>
            {buttons.map((button, index) => (
              <ButtonWrapper
                key={index}
                onClick={() => handleOnClick(button)}
                isMobile={isMobile}
                isSmall={scope !== "switch"}
              >
                <ButtonHole isMobile={isMobile} isSmall={scope !== "switch"}>
                  <ButtonInner isMobile={isMobile} isSmall={scope !== "switch"}>
                    <ButtonTop isMobile={isMobile} isSmall={scope !== "switch"}>
                      {button}
                    </ButtonTop>
                  </ButtonInner>
                </ButtonHole>
              </ButtonWrapper>
            ))}
          </SectionButtons>
        </Wrapper>
      )}
    </>
  );
};

export default SelectMachineItems;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 5rem;

  ${flexDirectionColumn}

  ${(p) =>
    p.isMobile &&
    css`
      height: auto;
    `};
`;

const ScrollWrapper = styled.div`
  height: 100px;
  width: 100%;
  border-radius: 14px 8px 8px 14px;
  ${layerBDark};
  box-shadow: inset 0px 0px 6px #000000;
  padding: 2px;
  margin-bottom: 4rem;
`;
const SectionOptions = styled.div`
  height: 96px;
  width: 100%;

  scroll-behavior: smooth;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url("/images/scrollbar-button-start.svg");
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url("/images/scrollbar-button-end.svg");
  }

  ${(p) =>
    p.isMobile &&
    css`
      ::-webkit-scrollbar {
        display: none;
      }
      height: auto;
      max-height: 223px;
      width: ${(p) => (p.isSmall ? "287px" : `298px`)};
      border-radius: 18px;
      ${layerA}
      ${flexDirectionColumn};
      padding: 4px 0;
      margin-bottom: 4px;
    `}
`;

const SectionButtons = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
  ${(p) =>
    p.isMobile &&
    css`
      ${(p) =>
        p.isSmall
          ? css`
              width: 287px;
            `
          : css`
              width: 298px;
            `}
    `}
`;

const ButtonWrapper = styled.button`
  width: 84px;
  height: 27px;
  border-radius: 18px;

  ${layerBDark}
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 27px;
      ${(p) =>
        p.isSmall
          ? css`
              width: 130px;
              height: 54px;
            `
          : css`
              width: 147px;
              height: 54px;
            `}
    `}
`;
const ButtonHole = styled.div`
  width: 82px;
  height: 25px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 26px;
      ${(p) =>
        p.isSmall
          ? css`
              width: 128px;
              height: 52px;
            `
          : css`
              width: 145px;
              height: 52px;
            `}
    `}
`;
const ButtonInner = styled.div`
  width: 74px;
  height: 17px;
  border-radius: 18px;
  ${layerCLighter}
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 23px;
      ${(p) =>
        p.isSmall
          ? css`
              width: 118px;
              height: 42px;
            `
          : css`
              width: 135px;
              height: 42px;
            `}
    `}
`;
const ButtonTop = styled.div`
  width: 72px;
  height: 15px;
  border-radius: 25px;
  font-size: 10px;

  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 25px;
      font-size: 14px;
      letter-spacing: 1.4px;
      ${(p) =>
        p.isSmall
          ? css`
              width: 116px;
              height: 40px;
            `
          : css`
              width: 133px;
              height: 40px;
            `}
    `}
`;

// =================================

// // Clear and Apply Button handler
// const handleOnClick = (button) => {
//   if (button === buttons[1]) {
//     // logic for count selected machine numbers
//     scope === 'switch'
//       ? switchCountHandler(isMachineSelected, handleSelectedOneBySwitch)
//       : switchCountHandler(isMachineSelected, handleSelectedOneByLocation);

//     // logic for count selected machine numbers
//     // let selectedSwtNumber = 0;
//     // isMachineSelected.forEach((location) =>
//     //   location.forEach((machine) => {
//     //     if (machine) {
//     //       selectedSwtNumber += 1;
//     //     }
//     //   })
//     // );

//     // Apply button
//     if (isAllSelected) {
//       // 1. selected All
//       // dispatch
//       scope === 'switch'
//         ? dispatch(
//             handleSelectedOneBySwitch({
//               controller: name,
//               selectedOne: 'all',
//             })
//           )
//         : dispatch(
//             handleSelectedOneByLocation({
//               controller: name,
//               selectedOne: 'all',
//             })
//           );

//       locations.map((location) => handleSelectLocation(location, true));
//     } else if (isLocationSelected.indexOf(true) !== -1) {
//       // 2. selected locations
//       selectedLocations.map((location) =>
//         handleSelectLocation(location, true)
//       );

//       if (selectedMachines.length > 0) {
//         // 3. selected individual machines

//         if (swtName === 'ess') {
//           selectedMachines.forEach((machine) =>
//             dispatch(
//               handleSelectIndividualMachine({
//                 location: machine[0],
//                 machine: machine[1],
//               })
//             )
//           );
//         } else if (swtName === 'tes') {
//           selectedMachines.forEach((machine) =>
//             dispatch(
//               tesHandleSelectIndividualMachine({
//                 location: machine[0],
//                 machine: machine[1],
//               })
//             )
//           );
//         } else {
//           // tgs option
//           selectedMachines.forEach((machine) =>
//             dispatch(
//               tgsHandleSelectIndividualMachine({
//                 location: machine[0],
//                 machine: machine[1],
//               })
//             )
//           );
//         }
//       }

//       // scope === 'switch'
//       //   ? dispatch(
//       //       handleSelectedOneBySwitch({
//       //         controller: name,
//       //         selectedOne: `${selectedSwtNumber} switches`,
//       //       })
//       //     )
//       //   : dispatch(
//       //       handleSelectedOneByLocation({
//       //         controller: name,
//       //         selectedOne: `${selectedSwtNumber} switches`,
//       //       })
//       //     );
//     } else if (selectedMachines.length > 0) {
//       // 3. selected individual machines

//       if (swtName === 'ess') {
//         selectedMachines.forEach((machine) =>
//           dispatch(
//             handleSelectIndividualMachine({
//               location: machine[0],
//               machine: machine[1],
//             })
//           )
//         );
//       } else if (swtName === 'tes') {
//         selectedMachines.forEach((machine) =>
//           dispatch(
//             tesHandleSelectIndividualMachine({
//               location: machine[0],
//               machine: machine[1],
//             })
//           )
//         );
//       } else {
//         // tgs option
//         selectedMachines.forEach((machine) =>
//           dispatch(
//             tgsHandleSelectIndividualMachine({
//               location: machine[0],
//               machine: machine[1],
//             })
//           )
//         );
//       }

//       // // display selected
//       // scope === 'switch'
//       //   ? dispatch(
//       //       handleSelectedOneBySwitch({
//       //         controller: name,
//       //         selectedOne: `${selectedSwtNumber} switches`,
//       //       })
//       //     )
//       //   : dispatch(
//       //       handleSelectedOneByLocation({
//       //         controller: name,
//       //         selectedOne: `${selectedSwtNumber} switches`,
//       //       })
//       //     );
//     } else if (!isSelected) {
//       scope === 'switch'
//         ? dispatch(
//             handleSelectedOneBySwitch({ controller: name, selectedOne: null })
//           )
//         : dispatch(
//             handleSelectedOneByLocation({
//               controller: name,
//               selectedOne: null,
//             })
//           );
//     }

//     handleClose();
//   } else {
//     // Clear button
//     if (scope === 'switch') {
//       // 1.reset all and title (selected one)
//       dispatch(handleSelectAllBySwitch({ controller: name, status: false }));
//       dispatch(
//         handleSelectedOneBySwitch({ controller: name, selectedOne: null })
//       );

//       // 2. Empty selected location names and machine names
//       dispatch(handleAddLocationsBySwitch({ controller: name, arr: [] }));
//       dispatch(handleAddMachinesBySwitch({ controller: name, arr: [] }));

//       // 3. reset locations as unselected
//       const arr = locations.map((location) => false);
//       dispatch(handleLocationSelectBySwitch({ controller: name, arr }));

//       // 4. reset machines as unselected
//       const individualArr = Object.values(data).map((location) =>
//         Object.keys(location).map((machine) => false)
//       );
//       dispatch(
//         handleMachineSelectBySwitch({ controller: name, arr: individualArr })
//       );
//     } else {
//       // 1.reset all and title (selected one)
//       dispatch(
//         handleSelectAllByLocation({ controller: name, status: false })
//       );
//       dispatch(
//         handleSelectedOneByLocation({ controller: name, selectedOne: null })
//       );

//       // 2. Empty selected location names and machine names
//       dispatch(handleAddLocationsByLocation({ controller: name, arr: [] }));
//       dispatch(handleAddMachinesByLocation({ controller: name, arr: [] }));

//       // 3. reset locations as unselected
//       const arr = locations.map((location) => false);
//       dispatch(handleLocationSelectByLocation({ controller: name, arr }));

//       // 4. reset machines as unselected
//       const individualArr = Object.values(data).map((location) =>
//         Object.keys(location).map((machine) => false)
//       );
//       dispatch(
//         handleMachineSelectByLocation({
//           controller: name,
//           arr: individualArr,
//         })
//       );
//     }

//     // dispatch
//     locations.map((location) => handleSelectLocation(location, false));

//     // reset all changes
//     // dispatch(handleResetAllSelectBySwitch());
//   }
// };

// ==================
// const handleSelectLocation = (option, select) => {
//   const machines = Object.keys(data[option]);

//   if (swtName === 'ess') {
//     if (select) {
//       machines.map((machine) =>
//         dispatch(handleSelectIndividualMachine({ location: option, machine }))
//       );
//     } else {
//       machines.map((machine) =>
//         dispatch(
//           handleUnSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     }
//   } else if (swtName === 'tes') {
//     if (select) {
//       machines.map((machine) =>
//         dispatch(
//           tesHandleSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     } else {
//       machines.map((machine) =>
//         dispatch(
//           tesHandleUnSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     }
//   } else {
//     // do about tgs
//     if (select) {
//       machines.map((machine) =>
//         dispatch(
//           tgsHandleSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     } else {
//       machines.map((machine) =>
//         dispatch(
//           tgsHandleUnSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     }
//   }
// };

// ========================

// const handleSelect = (option, machine) => {
//   setIsSelected(true);
//   const locationArr = isLocationSelected.map((location) => true);

//   if (scope === 'switch') {
//     if (option === 'all') {
//       // 1. select all
//       dispatch(handleSelectAllBySwitch({ controller: name, status: true }));

//       // 2. update all locations
//       dispatch(
//         handleLocationSelectBySwitch({ controller: name, arr: locationArr })
//       );

//       // 3.update all isSpecificLocationSelected
//       const specificLocationArr = isSpecificLocationSelected.map((el) =>
//         el.map((specLocationState) => true)
//       );

//       dispatch(
//         handleSpecificLocationSelectBySwitch({
//           controller: name,
//           arr: specificLocationArr,
//         })
//       );

//       // 4. update all machines
//       const individualArr = Object.values(data).map((location) =>
//         Object.keys(location).map((machine) => true)
//       );
//       dispatch(
//         handleMachineSelectBySwitch({ controller: name, arr: individualArr })
//       );
//     } else if (option !== 'all' && machine === undefined) {
//       // 2. select location
//       // 2-1 find index and make it true
//       // update the location
//       const index = locations.indexOf(option);
//       const arr = [...isLocationSelected];
//       arr[index] = true;

//       dispatch(handleLocationSelectBySwitch({ controller: name, arr }));

//       // update machines in the location
//       const machineNewArr = isMachineSelected[index].map((machine) => true);
//       const copyArr = [...isMachineSelected];
//       copyArr[index] = machineNewArr;
//       dispatch(
//         handleMachineSelectBySwitch({ controller: name, arr: copyArr })
//       );

//       // for dispatch selected locations
//       const newSelect = [...selectedLocations];
//       newSelect.push(option);
//       dispatch(
//         handleAddLocationsBySwitch({ controller: name, arr: newSelect })
//       );
//     } else {
//       // 3. select individually
//       const locationIdx = Object.keys(data).indexOf(option);
//       const machineIdx = Object.keys(data[option]).indexOf(machine);
//       dispatch(
//         handleMachineSelectAllBySwitch({
//           controller: name,
//           locationIdx,
//           machineIdx,
//         })
//       );
//       // for dispatch selected machines
//       const newSelectedMachineArr = [...selectedMachines];
//       newSelectedMachineArr.push([option, machine]);

//       dispatch(
//         handleAddMachinesBySwitch({
//           controller: name,
//           arr: newSelectedMachineArr,
//         })
//       );
//     }
//   } else {
//     if (option === 'all') {
//       // 1. select all
//       dispatch(handleSelectAllByLocation({ controller: name, status: true }));
//       // 2. update all locations
//       // const locationArr = isLocationSelected.map((location) => true);
//       dispatch(
//         handleLocationSelectByLocation({ controller: name, arr: locationArr })
//       );
//       // 3. update all machines global and local
//       const individualArr = Object.values(data).map((location) =>
//         Object.keys(location).map((machine) => true)
//       );
//       dispatch(
//         handleMachineSelectByLocation({
//           controller: name,
//           arr: individualArr,
//         })
//       );
//     } else if (option !== 'all' && machine === undefined) {
//       // 2. select location
//       // 2-1 find index and make it true
//       // update the location
//       const index = locations.indexOf(option);
//       const arr = [...isLocationSelected];
//       arr[index] = true;
//       dispatch(handleLocationSelectByLocation({ controller: name, arr }));
//       // update machines in the location
//       const machineNewArr = isMachineSelected[index].map((machine) => true);
//       const copyArr = [...isMachineSelected];
//       copyArr[index] = machineNewArr;
//       dispatch(
//         handleMachineSelectByLocation({ controller: name, arr: copyArr })
//       );
//       // for dispatch selected locations
//       const newSelect = [...selectedLocations];
//       newSelect.push(option);
//       dispatch(
//         handleAddLocationsByLocation({ controller: name, arr: newSelect })
//       );
//     } else {
//       // 3. select individually
//       const locationIdx = Object.keys(data).indexOf(option);
//       const machineIdx = Object.keys(data[option]).indexOf(machine);
//       dispatch(
//         handleMachineSelectAllByLocation({
//           controller: name,
//           locationIdx,
//           machineIdx,
//         })
//       );
//       // for dispatch selected machines
//       const newSelectedMachineArr = [...selectedMachines];
//       newSelectedMachineArr.push([option, machine]);
//       dispatch(
//         handleAddMachinesByLocation({
//           controller: name,
//           arr: newSelectedMachineArr,
//         })
//       );
//     }
//   }
// };

// =================================

// const handleSelect = (option, machine, extraOption, machineIndex) => {
//   setIsSelected(true);

//   if (option === 'all') {
// select all Logic
// // 1. select all
// if (scope === 'switch') {
//   dispatch(handleSelectAllBySwitch({ controller: name, status: true }));
// } else {
//   dispatch(handleSelectAllByLocation({ controller: name, status: true }));
// }

// // 2. update all locations
// const locationArr = isLocationSelected.map((location) => true);
// const locationDispatchObj = {
//   controller: name,
//   arr: locationArr,
// };
// if (scope === 'switch') {
//   dispatch(handleLocationSelectBySwitch(locationDispatchObj));
// } else {
//   dispatch(handleLocationSelectByLocation(locationDispatchObj));
// }

// // 3.update all isSpecificLocationSelected
// const specificLocationArr = isSpecificLocationSelected.map((el) =>
//   el.map((specLocationState) => true)
// );
// const specLocationDispatchObj = {
//   controller: name,
//   arr: specificLocationArr,
// };
// if (scope === 'switch') {
//   dispatch(handleSpecificLocationSelectBySwitch(specLocationDispatchObj));
// } else {
//   dispatch(
//     handleSpecificLocationSelectByLocation(specLocationDispatchObj)
//   );
// }

// // 4. update all machines
// const individualArr = Object.values(data)?.map((location) => {
//   const locationArr = Object.values(location);
//   if (locationArr[0]?.machineType) {
//     return locationArr.map((machine) => true);
//   } else {
//     return locationArr.map((specLocation) =>
//       Object.keys(specLocation).map((machine) => true)
//     );
//   }
// });

// const machineDispatchObj = {
//   controller: name,
//   arr: individualArr,
// };
// if (scope === 'switch') {
//   dispatch(handleMachineSelectBySwitch(machineDispatchObj));
// } else {
//   dispatch(handleMachineSelectByLocation(machineDispatchObj));
// }
// } else if (option !== 'all' && machine === undefined) {
// ======= select location logic =====
// // 2. select location
// // 2.1 update the isLocationSelected
// const index = locations.indexOf(option);
// const copyIsLocationSelected = [...isLocationSelected];
// copyIsLocationSelected[index] = true;
// // isSpecificLocation logic
// const exitingSpecLocationsValue = Object.values(data).filter(
//   (el) =>
//     !Object.values(el)[0]?.machineType && Object.keys(el).length !== 0
// );
// if (scope === 'switch') {
//   dispatch(
//     handleLocationSelectBySwitch({
//       controller: name,
//       arr: copyIsLocationSelected,
//     })
//   );
// } else {
//   dispatch(
//     handleLocationSelectByLocation({
//       controller: name,
//       arr: copyIsLocationSelected,
//     })
//   );
// }
// // 2.2 update isSpecificLocationSelected
// const newIsSpecificLocationSelected = [];
// exitingSpecLocationsValue.forEach((specLocationTitle) => {
//   const tempArr = [];
//   newIsSpecificLocationSelected.push(tempArr);
//   Object.keys(data[option]).forEach((el) => {
//     if (el === Object.keys(specLocationTitle)[0]) {
//       tempArr.push(true);
//     } else {
//       tempArr.push(false);
//     }
//   });
// });
// if (newIsSpecificLocationSelected.length > 0) {
//   if (scope === 'switch') {
//     dispatch(
//       handleSpecificLocationSelectBySwitch({
//         controller: name,
//         arr: newIsSpecificLocationSelected,
//       })
//     );
//   } else {
//     dispatch(
//       handleSpecificLocationSelectByLocation({
//         controller: name,
//         arr: newIsSpecificLocationSelected,
//       })
//     );
//   }
// }
// // 2.3 update isMachineSelected
// const machineNewArr = isMachineSelected[index]?.map((el) => {
//   if (typeof el === 'boolean') {
//     return true;
//   } else {
//     const machineArr = el?.map((machine) => true);
//     return machineArr;
//   }
// });
// const copyIsMachineSelected = [...isMachineSelected];
// copyIsMachineSelected[index] = machineNewArr;
// if (scope === 'switch') {
//   dispatch(
//     handleMachineSelectBySwitch({
//       controller: name,
//       arr: copyIsMachineSelected,
//     })
//   );
// } else {
//   dispatch(
//     handleMachineSelectByLocation({
//       controller: name,
//       arr: copyIsMachineSelected,
//     })
//   );
// }
// // for dispatch selected locations
// const newSelect = [...selectedLocations];
// newSelect.push(option);
// if (scope === 'switch') {
//   dispatch(
//     handleAddLocationsBySwitch({ controller: name, arr: newSelect })
//   );
// } else {
//   dispatch(
//     handleAddLocationsByLocation({ controller: name, arr: newSelect })
//   );
// }
// } else if (option !== 'all' && machine === 'isSpecificLocation') {
// ======= select specific location logic =====
// // 3. select specific location
// // 3.1 update isSpecificLocationSelected
// const index = specificLocations.indexOf(extraOption);
// const isSpecificLocationNewArr = isSpecificLocationSelected[index]?.map(
//   (_, idx) => {
//     if (idx === machineIndex) {
//       return true;
//     } else return false;
//   }
// );
// const arr = [...isSpecificLocationSelected];
// arr[index] = isSpecificLocationNewArr;
// if (scope === 'switch') {
//   dispatch(
//     handleSpecificLocationSelectBySwitch({ controller: name, arr })
//   );
// } else {
//   dispatch(
//     handleSpecificLocationSelectByLocation({ controller: name, arr })
//   );
// }
// // 3.2 update isMachineSelected
// // location index
// const locationIndex = locations.indexOf(option);
// const machineNewArr = isMachineSelected[locationIndex][machineIndex]?.map(
//   (machine) => true
// );
// const deepCopyArr = JSON.parse(JSON.stringify(isMachineSelected));
// deepCopyArr[locationIndex][machineIndex] = machineNewArr;
// if (scope === 'switch') {
//   dispatch(
//     handleMachineSelectBySwitch({ controller: name, arr: deepCopyArr })
//   );
// } else {
//   dispatch(
//     handleMachineSelectByLocation({
//       controller: name,
//       arr: deepCopyArr,
//     })
//   );
// }
// // for dispatch selected specific locations
// const newSelect = [...selectedSpecificLocations];
// newSelect.push(extraOption);
// if (scope === 'switch') {
//   dispatch(
//     handleAddSpecificLocationsBySwitch({
//       controller: name,
//       arr: newSelect,
//     })
//   );
// } else {
//   dispatch(
//     handleAddSpecificLocationsByLocation({
//       controller: name,
//       arr: newSelect,
//     })
//   );
// }
// } else {
// ======= select machine logic =====
// // 4. select individually
// const locationIdx = Object.keys(data).indexOf(option);
// const newSelectedMachineArr = [...selectedMachines];
// // 4.1 update isMachineSelected that has a specific location
// if (extraOption) {
//   const specLocationIdx = Object.keys(data[option]).indexOf(extraOption);
//   const machineIdx = Object.values(data[option])
//     .map((el) => Object.keys(el)[0])
//     .indexOf(machine);
//   if (scope === 'switch') {
//     dispatch(
//       handleMachineSelectWithSpecLocationAltBySwitch({
//         controller: name,
//         locationIdx,
//         specLocationIdx,
//         machineIdx,
//       })
//     );
//   } else {
//     dispatch(
//       handleMachineSelectWithSpecLocationAltByLocation({
//         controller: name,
//         locationIdx,
//         specLocationIdx,
//         machineIdx,
//       })
//     );
//   }
//   newSelectedMachineArr.push([option, extraOption, machine]);
// } else {
//   // 4.2 update isMachineSelected that doesn't have a specific location
//   const machineIdx = Object.keys(data[option]).indexOf(machine);
//   if (scope === 'switch') {
//     dispatch(
//       handleMachineSelectAltBySwitch({
//         controller: name,
//         locationIdx,
//         machineIdx,
//       })
//     );
//   } else {
//     dispatch(
//       handleMachineSelectAltByLocation({
//         controller: name,
//         locationIdx,
//         machineIdx,
//       })
//     );
//   }
//   newSelectedMachineArr.push([option, machine]);
// }
// // for dispatch selected machines
// if (scope === 'switch') {
//   dispatch(
//     handleAddMachinesBySwitch({
//       controller: name,
//       arr: newSelectedMachineArr,
//     })
//   );
// } else {
//   dispatch(
//     handleAddMachinesByLocation({
//       controller: name,
//       arr: newSelectedMachineArr,
//     })
//   );
// }
//   }
// };

// const selectAllHandler = () => {
//   // =======logic============
//   // 2. update all locations
//   const locationArr = isLocationSelected.map((location) => true);
//   const locationDispatchObj = {
//     controller: name,
//     arr: locationArr,
//   };

//   // 3.update all isSpecificLocationSelected
//   const specificLocationArr = isSpecificLocationSelected.map((el) =>
//     el.map((specLocationState) => true)
//   );
//   const specLocationDispatchObj = {
//     controller: name,
//     arr: specificLocationArr,
//   };

//   // 4. update all machines
//   const individualArr = Object.values(data)?.map((location) => {
//     const locationArr = Object.values(location);
//     if (locationArr[0]?.machineType) {
//       return locationArr.map((machine) => true);
//     } else {
//       return locationArr.map((specLocation) =>
//         Object.keys(specLocation).map((machine) => true)
//       );
//     }
//   });

//   const machineDispatchObj = {
//     controller: name,
//     arr: individualArr,
//   };

//   // ======dispatches below======

//   if (scope === 'switch') {
//     // dispatch all
//     dispatch(handleSelectAllBySwitch({ controller: name, status: true }));
//     // dispatch locations
//     dispatch(handleLocationSelectBySwitch(locationDispatchObj));
//     // dispatch specific locations
//     dispatch(handleSpecificLocationSelectBySwitch(specLocationDispatchObj));
//     // dispatch machines
//     dispatch(handleMachineSelectBySwitch(machineDispatchObj));
//   } else {
//     // dispatch all
//     dispatch(handleSelectAllByLocation({ controller: name, status: true }));
//     // dispatch locations
//     dispatch(handleLocationSelectByLocation(locationDispatchObj));
//     // dispatch specific locations
//     dispatch(handleSpecificLocationSelectByLocation(specLocationDispatchObj));
//     // dispatch machines
//     dispatch(handleMachineSelectByLocation(machineDispatchObj));
//   }
// };

// const selectLocationHandler = (option) => {
//   // ======= select location logic =====
//   // 2. select location
//   // 2.1 update the isLocationSelected
//   const index = locations.indexOf(option);
//   const copyIsLocationSelected = [...isLocationSelected];
//   copyIsLocationSelected[index] = true;
//   // isSpecificLocation logic
//   const exitingSpecLocationsValue = Object.values(data).filter(
//     (el) => !Object.values(el)[0]?.machineType && Object.keys(el).length !== 0
//   );

//   // 2.2 update isSpecificLocationSelected
//   const newIsSpecificLocationSelected = [];
//   exitingSpecLocationsValue.forEach((specLocationTitle) => {
//     const tempArr = [];

//     newIsSpecificLocationSelected.push(tempArr);

//     Object.keys(data[option]).forEach((el) => {
//       if (el === Object.keys(specLocationTitle)[0]) {
//         tempArr.push(true);
//       } else {
//         tempArr.push(false);
//       }
//     });
//   });

//   // 2.3 update isMachineSelected
//   const machineNewArr = isMachineSelected[index]?.map((el) => {
//     if (typeof el === 'boolean') {
//       return true;
//     } else {
//       const machineArr = el?.map((machine) => true);
//       return machineArr;
//     }
//   });
//   const copyIsMachineSelected = [...isMachineSelected];
//   copyIsMachineSelected[index] = machineNewArr;

//   // for dispatch selected locations
//   const newSelect = [...selectedLocations];
//   if (!newSelect.some((el) => el === option)) {
//     newSelect.push(option);
//   }

//   // ======dispatches below======

//   if (scope === 'switch') {
//     // dispatch locations
//     dispatch(
//       handleLocationSelectBySwitch({
//         controller: name,
//         arr: copyIsLocationSelected,
//       })
//     );
//     // dispatch specific locations
//     if (newIsSpecificLocationSelected.length > 0) {
//       dispatch(
//         handleSpecificLocationSelectBySwitch({
//           controller: name,
//           arr: newIsSpecificLocationSelected,
//         })
//       );
//     }
//     // dispatch machines
//     dispatch(
//       handleMachineSelectBySwitch({
//         controller: name,
//         arr: copyIsMachineSelected,
//       })
//     );

//     // dispatch selected locations
//     dispatch(
//       handleAddLocationsBySwitch({ controller: name, arr: newSelect })
//     );
//   } else {
//     // dispatch locations
//     dispatch(
//       handleLocationSelectByLocation({
//         controller: name,
//         arr: copyIsLocationSelected,
//       })
//     );
//     // dispatch specific locations
//     if (newIsSpecificLocationSelected.length > 0) {
//       dispatch(
//         handleSpecificLocationSelectByLocation({
//           controller: name,
//           arr: newIsSpecificLocationSelected,
//         })
//       );
//     }
//     // dispatch machines
//     dispatch(
//       handleMachineSelectByLocation({
//         controller: name,
//         arr: copyIsMachineSelected,
//       })
//     );
//     // dispatch selected locations
//     dispatch(
//       handleAddLocationsByLocation({ controller: name, arr: newSelect })
//     );
//   }
// };

// const selectSpecificLocationHandler = (option, machineIndex, extraOption) => {
//   // 3. select specific location
//   // 3.1 update isSpecificLocationSelected
//   const index = specificLocations.indexOf(extraOption);

//   const isSpecificLocationNewArr = isSpecificLocationSelected[index]?.map(
//     (_, idx) => {
//       if (idx === machineIndex) {
//         return true;
//       } else return false;
//     }
//   );

//   const arr = [...isSpecificLocationSelected];
//   arr[index] = isSpecificLocationNewArr;

//   // 3.2 update isMachineSelected
//   // location index
//   const locationIndex = locations.indexOf(option);
//   const machineNewArr = isMachineSelected[locationIndex][machineIndex]?.map(
//     (machine) => true
//   );

//   const deepCopyArr = JSON.parse(JSON.stringify(isMachineSelected));

//   deepCopyArr[locationIndex][machineIndex] = machineNewArr;

//   // for dispatch selected specific locations
//   const newSelect = [...selectedSpecificLocations];
//   if (!newSelect.some((el) => el === extraOption)) {
//     newSelect.push(extraOption);
//   }

//   // ======dispatches below======

//   if (scope === 'switch') {
//     // dispatch specific locations
//     dispatch(handleSpecificLocationSelectBySwitch({ controller: name, arr }));
//     // dispatch machines
//     dispatch(
//       handleMachineSelectBySwitch({ controller: name, arr: deepCopyArr })
//     );
//     // dispatch selected specific locations
//     dispatch(
//       handleAddSpecificLocationsBySwitch({
//         controller: name,
//         arr: newSelect,
//       })
//     );
//   } else {
//     // dispatch specific
//     dispatch(
//       handleSpecificLocationSelectByLocation({ controller: name, arr })
//     );
//     // dispatch machines
//     dispatch(
//       handleMachineSelectByLocation({
//         controller: name,
//         arr: deepCopyArr,
//       })
//     );
//     // dispatch selected specific locations
//     dispatch(
//       handleAddSpecificLocationsByLocation({
//         controller: name,
//         arr: newSelect,
//       })
//     );
//   }
// };

// const selectMachineHandler = (option, machine, extraOption) => {
//   // ======= select machine logic =====
//   // 4. select individually
//   const locationIdx = Object.keys(data).indexOf(option);
//   const newSelectedMachineArr = [...selectedMachines];
//   // 4.1 update isMachineSelected that has a specific location
//   let specLocationIdx;
//   let machineIdx;
//   if (extraOption) {
//     specLocationIdx = Object.keys(data[option]).indexOf(extraOption);
//     machineIdx = Object.values(data[option])
//       .flatMap((el) => {
//         return Object.keys(el);
//       })
//       .indexOf(machine);

//     newSelectedMachineArr.push([option, extraOption, machine]);
//   } else {
//     // 4.2 update isMachineSelected that doesn't have a specific location
//     machineIdx = Object.keys(data[option]).indexOf(machine);

//     newSelectedMachineArr.push([option, machine]);
//   }

//   // ======dispatches below======

//   if (scope === 'switch') {
//     if (extraOption) {
//       // dispatch machines that have a specific location
//       dispatch(
//         handleMachineSelectWithSpecLocationAltBySwitch({
//           controller: name,
//           locationIdx,
//           specLocationIdx,
//           machineIdx,
//         })
//       );
//     } else {
//       // dispatch machines that do not have a specific location
//       dispatch(
//         handleMachineSelectAltBySwitch({
//           controller: name,
//           locationIdx,
//           machineIdx,
//         })
//       );
//     }
//     // for dispatch selected machines
//     dispatch(
//       handleAddMachinesBySwitch({
//         controller: name,
//         arr: newSelectedMachineArr,
//       })
//     );
//   } else {
//     if (extraOption) {
//       // dispatch machines that have a specific location
//       dispatch(
//         handleMachineSelectWithSpecLocationAltByLocation({
//           controller: name,
//           locationIdx,
//           specLocationIdx,
//           machineIdx,
//         })
//       );
//     } else {
//       // dispatch machines that do not have a specific location
//       dispatch(
//         handleMachineSelectAltByLocation({
//           controller: name,
//           locationIdx,
//           machineIdx,
//         })
//       );
//     }
//     // for dispatch selected machines
//     dispatch(
//       handleAddMachinesByLocation({
//         controller: name,
//         arr: newSelectedMachineArr,
//       })
//     );
//   }
// };
