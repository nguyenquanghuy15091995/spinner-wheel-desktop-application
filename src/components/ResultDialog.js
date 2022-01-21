import { useContext, useEffect } from "react";
import { Dialog, Card, H4, H6, Button } from "ui-neumorphism";
import { AppContext } from "contexts/app-context";

const ResultDialog = () => {
  const { luckySector, setDialogResultVisible, resultVisible, playVictorySound, updateSector } = useContext(AppContext);
  useEffect(() => {
    if (resultVisible) {
      playVictorySound();
    }
  }, [resultVisible]);

  const toggleSectorVisible = (sector) => {
    const newSector = { ...sector, visible: !sector.visible };
    setDialogResultVisible(false);
    updateSector(newSector);
  }


  return <>
    <Dialog
      visible={resultVisible}
      width={450}
    >
      <Card className="p-4">
        <H4 className="fw-700 mb-4 text-center" style={{ color: "var(--success)" }}>Congratulations!</H4>
        <div className="d-flex flex-column align-items-center mb-4">
          {luckySector && luckySector.image && <img src={luckySector.image} width={200} height="auto" className="mb-2" alt="image" />}
          <H6 className="text-center mb-2">{luckySector?.name}</H6>
          {/* <H6 className="text-center">{luckySector?.shortName}</H6> */}
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <Button className="mx-2" onClick={() => toggleSectorVisible(luckySector)} color="var(--primary)">Hide Choice</Button>
          <Button className="mx-2" onClick={() => setDialogResultVisible(false)}>Close</Button>
        </div>
      </Card>
    </Dialog>
  </>;
}

export default ResultDialog;