import { useState, useEffect } from "react";
import { TextField, Button, IconButton, Divider, Card, Avatar, H6, Subtitle2 } from "ui-neumorphism";
import { MdSettings, MdEdit, MdRemoveCircleOutline, MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { controlViews } from "utils/view";
import DefaultImage from "main_window/assets/images/default/default-image.png";

const SectorList = ({ sectors, screen, setScreen, setSector, removeSector, loading, isSpinning, updateSector }) => {
  const [itemHoverIdx, setItemHoverIdx] = useState();
  const [sectorTemp, setSectorTemp] = useState();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (Array.isArray(sectors) && sectorTemp && sectors.every(item => item.id !== sectorTemp.id)) {
      setSectorTemp(null);
    }
  }, [sectors]);

  const toggleSectorVisible = (sector) => {
    const newSector = { ...sector, visible: !sector.visible };
    updateSector(newSector);
  }

  return <div className="position-relative h-100">
    <div className="d-flex justify-content-between mb-3 px-2">
      <div className="d-flex align-items-center flex-fill">
        <H6 className={`fw-700 flex-fill`}>{screen?.name || ""}</H6>
      </div>
      <div className="d-flex align-items-center">
        <Button color="var(--success)" className="mx-2" onClick={() => setScreen(controlViews.ADD)} disabled={loading || isSpinning}>Add New</Button>
        {/* <IconButton rounded text={false} color="var(--dark-bg)" className="mx-2">
          <MdSettings size={18} />
        </IconButton> */}
      </div>
    </div>
    <div className="position-relative h-100">
      <div>
        <TextField placeholder="Type to Search..." value={searchText} onChange={(e) => setSearchText(e.value)} className="neu-TextField-full m-0" disabled={loading || isSpinning || sectors.length === 0} inputStyles={{ width: "100%" }} />
      </div>
      <Divider dense className="mb-3" />
      <ul className="p-2 overflow-y-scroll" style={{ maxHeight: 400 }}>
        {sectors.filter(item => `${item.name} ${item.shortName}`.toLowerCase().includes(searchText.toLowerCase())).map((sector, sectorIdx) => <li key={sectorIdx} className="mb-3" onMouseEnter={() => setItemHoverIdx(sectorIdx)} onMouseLeave={() => setItemHoverIdx(null)} >
          <Card
            rounded
            inset={sectorIdx === itemHoverIdx}
            elevation={0}
            className={`position-relative d-flex overflow-hidden${sector.visible ? "" : " bg-invisible"}`}
            height={150}
          >
            <div className="w-50">
              {sector.image ? <>
                <img
                  src={sector.image}
                  width={50}
                  height={50}
                  className={`w-100 h-100 object-cover${sector.visible ? "" : " opacity-60"}`}
                  alt={`image-${sectorIdx + 1}`}
                /></>
                : <img
                  src={DefaultImage}
                  width={50}
                  height={50}
                  className="w-100 h-100 object-cover opacity-60"
                  alt={`image-${sectorIdx + 1}`}
                />}
            </div>
            <div className="position-absolute top-2 left-2">
              <Avatar color="var(--dark)" bgColor={sector.color} className="fw-500 shadow-neu">{sectorIdx + 1}</Avatar>
            </div>
            <div className="w-50 p-3 d-flex justify-content-between flex-column">
              <div>
                <H6 className="mb-2">{sector.name}</H6>
                {/* <Subtitle2>{sector.shortName}</Subtitle2> */}
              </div>
              <div className="d-flex justify-content-end">
                {loading || isSpinning ? <></> : <>
                  <IconButton rounded text={!(sectorIdx === itemHoverIdx)} disabled={loading || isSpinning} onClick={() => toggleSectorVisible(sector)} size="small" color={sectorIdx === itemHoverIdx ? "var(--primary-light)" : "var(--light-bg)"} className="ms-2">
                    {sector.visible ? <MdOutlineVisibility size={16} /> : <MdOutlineVisibilityOff size={16} />}
                  </IconButton>
                  <IconButton rounded text={!(sectorIdx === itemHoverIdx)} disabled={loading || isSpinning} onClick={() => setSector(sector)} size="small" color={sectorIdx === itemHoverIdx ? "var(--primary-light)" : "var(--light-bg)"} className="ms-2">
                    <MdEdit size={16} />
                  </IconButton>
                  <IconButton rounded text={!(sectorIdx === itemHoverIdx)} disabled={loading || isSpinning} onClick={() => setSectorTemp(sector)} size="small" color={sectorIdx === itemHoverIdx ? "var(--error)" : "var(--light-bg)"} className="ms-2">
                    <MdRemoveCircleOutline size={24} />
                  </IconButton>
                </>}
              </div>
            </div>
          </Card>
        </li>)}
      </ul>
    </div>
    {sectorTemp && <div
      className="position-absolute left-0 top-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 4
      }}
    >
      <Card className="py-4 px-3">
        <H6 className="mb-4 text-center">Are you sure you want to delete <span className="fw-700">{sectorTemp.name}</span>?</H6>
        <div className="d-flex justify-content-center align-items-center">
          <Button className="mx-2" disabled={loading || isSpinning} onClick={() => setSectorTemp(null)}>Cancel</Button>
          <Button className="mx-2" disabled={loading || isSpinning} color="var(--white)" bgColor="var(--error)" onClick={() => removeSector(sectorTemp)}>Remove</Button>
        </div>
      </Card>
    </div>}
  </div>;
}

export default SectorList;