import { createContext, useState, useReducer } from "react";
import { getRandomColor } from "utils/colors";
import { updateSectorsToFile, getSectors, updateDetailSectorToFile, removeSectorInFile, audioWheelScrolling, audioVictory } from "utils/file-handler";
import { controlViews } from "utils/view";

export const AppContext = createContext({});

const initAppState = {
  isSpinning: false,
  luckySector: null,
  loading: false,
  resultVisible: false,
  errorMessage: "",
  screen: controlViews.LIST,
};

const jsonSectors = getSectors();

const reducer = (state, action) => {
  switch (action.type) {
    case "app_update":
      return {
        ...state,
        ...action.payload
      };
    case "app_start_handling":
      return {
        ...state,
        loading: true,
        errorMessage: ""
      };
    case "app_end_handling":
      return {
        ...state,
        loading: false,
        screen: controlViews.LIST,
        errorMessage: action.payload.errorMessage
      };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [sectors, setSectors] = useState(jsonSectors);
  const [state, dispatch] = useReducer(reducer, initAppState);
  const setSpinning = (newSpinningState) => {
    dispatch({
      type: "app_update",
      payload: {
        isSpinning: newSpinningState
      }
    });
  }
  const onSpinnerEnd = (newSector) => {
    dispatch({
      type: "app_update",
      payload: {
        luckySector: newSector,
        isSpinning: false,
        resultVisible: true,
      }
    });
  }

  const addNewSectors = (data) => {
    if (Array.isArray(data)) {
      dispatch({ type: "app_start_handling" });

      const newSectors = data.map((sector, sectorIdx) => ({
        ...sector,
        id: `sector-${Date.now() + sectorIdx}`,
        color: getRandomColor(),
        visible: true
      }));
      updateSectorsToFile(
        newSectors,
        sectors,
        setSectors,
        (errorMessage) => dispatch({ type: "app_end_handling", payload: { errorMessage: errorMessage } })
      );
    }
  }

  const updateSector = (data) => {
    updateDetailSectorToFile(data, setSectors, (errorMessage) => dispatch({ type: "app_end_handling", payload: { errorMessage: errorMessage } }));
  }

  const removeSector = (data) => {
    removeSectorInFile(data, setSectors, (errorMessage) => dispatch({ type: "app_end_handling", payload: { errorMessage: errorMessage } }));
  }

  const setScreen = (newScreen) => {
    dispatch({
      type: "app_update",
      payload: {
        screen: newScreen
      }
    });
  }

  const playWheelScrollingSound = () => {
    audioWheelScrolling.play();
  }

  const playVictorySound = () => {
    audioVictory.play();
  }

  const stopAllAudio = () => {
    audioWheelScrolling.stop();
    audioVictory.stop();
  }

  const setDialogResultVisible = (visible) => {
    dispatch({
      type: "app_update",
      payload: {
        resultVisible: visible
      }
    });
  }

  return <AppContext.Provider value={{
    sectors: sectors,
    luckySector: state.luckySector,
    setSectors: setSectors,
    isSpinning: state.isSpinning,
    loading: state.loading,
    errorMessage: state.errorMessage,
    setSpinning: setSpinning,
    onSpinnerEnd: onSpinnerEnd,
    addNewSectors: addNewSectors,
    screen: state.screen,
    setScreen: setScreen,
    updateSector: updateSector,
    removeSector: removeSector,
    playWheelScrollingSound: playWheelScrollingSound,
    resultVisible: state.resultVisible,
    setDialogResultVisible: setDialogResultVisible,
    playVictorySound: playVictorySound,
    stopAllAudio: stopAllAudio
  }}>
    {children}
  </AppContext.Provider>;
}