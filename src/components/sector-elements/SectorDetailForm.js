import { useEffect } from "react";
import { TextField, Button, Divider, Card, H6, Subtitle1, RadioGroup, Radio } from "ui-neumorphism";
import { useForm } from "react-hook-form";
import { controlViews } from "utils/view";

const getImageName = (imagePath) => {
  const imagePaths = imagePath.split('/');
  return imagePaths[imagePaths.length - 1];
}

const SectorForm = ({ sector, screen, setScreen, updateSector, loading }) => {
  const { setValue, watch, handleSubmit } = useForm({
    defaultValues: { ...sector, imageFile: sector.image } || { name: "", imageFile: null, elementView: "name"  }
  });

  useEffect(() => {
    const btnSubmitContainer = document.getElementById("btn-submit-container");
    if (btnSubmitContainer) {
      const btnSubmit = btnSubmitContainer.childNodes[0];
      if (btnSubmit) {
        btnSubmit.type = "submit";
        btnSubmit.classList.add("w-100");
        btnSubmit.classList.add("h-100");
      }
    }
    const btnUploadContainer = document.getElementById("btn-upload-container");
    if (btnUploadContainer) {
      const btnUpload = btnUploadContainer.childNodes[0];
      if (btnUpload) {
        btnUpload.type = "button";
      }
    }
  }, []);


  const onSubmit = (data) => {
    if (updateSector) {
      updateSector({
        id: data.id,
        name: data.name,
        // shortName: data.shortName,
        image: data.imageFile,
        elementView: data.elementView,
        color: data.color
      });
    }
  }

  const handleNameOnChange = (e) => {
    setValue("name", e.value);
  }

  // const handleShortNameOnChange = (e) => {
  //   setValue("shortName", e.value);
  // }

  const handleElementViewOnChange = (e) => {
    setValue("elementView", e.value);
  }

  const handleImageFileOnChange = (e) => {
    if (e.target.files[0]) {
      setValue("imageFile", e.target.files[0]);
    }
  }

  const isBtnSubmitDisabled = () => {
    return !watch("name") || watch("name") === ""
      // || !watch("shortName") || watch("shortName") === ""
      || watch("name") === sector.name
      // && watch("shortName") === sector.shortName 
      && watch("imageFile") === sector.image
      && watch("elementView") === sector.elementView;
  }

  return <>
    <H6 className={`fw-700 text-center mb-4`}>{screen?.name || ""}</H6>
    <div className="position-relative h-100">
      <Card elevation={0} className="position-absolute top-0 left-0 w-100 h-100">
        <Divider dense className="mb-3" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-2 mb-4">
            <div>
              <Subtitle1 className="mb-2 px-2 fw-600">Sector name:</Subtitle1>
              <TextField id="input-name" name="name" type="text" disabled={loading} value={watch("name")} onChange={handleNameOnChange} placeholder="Enter Name" className="neu-TextField-full m-0" inputStyles={{ width: "100%" }} />
            </div>
            {/* <div>
              <Subtitle1 className="mb-2 px-2 fw-600">Short name:</Subtitle1>
              <TextField id="input-shortName" name="shortName" type="text" disabled={loading} value={watch("shortName")} onChange={handleShortNameOnChange} placeholder="Enter Shortname" className="neu-TextField-full m-0" inputStyles={{ width: "100%" }} />
            </div> */}
            <div>
              <Subtitle1 className="mb-2 px-2 fw-600">Image:</Subtitle1>
              <div className="py-1">
                <Card inset className="flex-fill ps-3 d-flex justify-content-between align-items-center overflow-hidden">
                  <div className="pe-3 w-100 text-truncate">
                    {
                      typeof watch("imageFile") === "string" ? <span>{getImageName(watch("imageFile"))}</span> : <>
                        {!watch("imageFile") || !watch("imageFile").name ? <span style={{ color: "var(--g-bg-color-disabled-dark)" }}>Choose your image</span> : watch("imageFile").name}
                      </>
                    }
                  </div>
                  <Button disabled={loading} id="btn-upload-container" size="large" color="var(--white)" bgColor='var(--warning)' className="position-relative">
                    <label htmlFor="img-upload" className="position-absolute top-0 left-0 w-100 h-100" />
                    Upload
                  </Button>
                </Card>
                <input disabled={loading} onChange={handleImageFileOnChange} id="img-upload" type="file" className="d-none" accept="image/*" />
              </div>
            </div>
            <div>
              <Subtitle1 className="mb-2 px-2 fw-600">Element to view:</Subtitle1>
              <RadioGroup value="name" color="var(--primary)" onChange={handleElementViewOnChange}>
                <Radio value="name" label="Name" />
                <Radio value="image" label="Image" />
              </RadioGroup>
            </div>
          </div>
          <div className="px-2 py-3 d-flex justify-content-between align-items-center">
            <Button disabled={loading} className="mx-1" onClick={() => setScreen(controlViews.LIST)}>Back</Button>
            <Button disabled={loading} id="btn-submit-container" color="var(--success)" className="mx-1 p-0" disabled={isBtnSubmitDisabled()}>Save</Button>
          </div>
        </form>
      </Card>
    </div>
  </>;
}

export default SectorForm;