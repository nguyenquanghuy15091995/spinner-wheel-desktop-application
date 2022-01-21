import { useContext, useState, useEffect } from "react";
import { AppContext } from "contexts/app-context";
import { controlViews } from "utils/view";
import SectorList from "./sector-elements/SectorList";
import SectorAddForm from "./sector-elements/SectorAddForm";
import SectorDetailForm from "./sector-elements/SectorDetailForm";

const Controller = () => {
  const { sectors, addNewSectors, loading, screen, setScreen, updateSector, removeSector, isSpinning } = useContext(AppContext);
  const [sector, setSector] = useState();

  useEffect(() => {
    if (sector && screen.id !== controlViews.DETAIL.id) {
      setScreen(controlViews.DETAIL);
    }
  }, [sector]);

  useEffect(() => {
    if (screen.id === controlViews.LIST.id && sector) {
      setSector(null);
    }
  }, [screen]);

  return <div className="d-flex flex-column h-100 overflow-hidden position-relative">
    {screen && screen.id === controlViews.LIST.id && <SectorList sectors={sectors} screen={screen} setScreen={setScreen} setSector={setSector} removeSector={removeSector} loading={loading} isSpinning={isSpinning} updateSector={updateSector} />}
    {screen && screen.id === controlViews.ADD.id && <SectorAddForm screen={screen} setScreen={setScreen} addNewSectors={addNewSectors} loading={loading} />}
    {screen && screen.id === controlViews.DETAIL.id && <SectorDetailForm screen={screen} setScreen={setScreen} loading={loading} sector={sector} updateSector={updateSector} />}
  </div>
}

export default Controller;