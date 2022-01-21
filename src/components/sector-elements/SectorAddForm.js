import { useEffect, useState, useRef } from "react";
import { TextField, Button, Divider, Card, H6, Subtitle1, Radio, RadioGroup } from "ui-neumorphism";
import { useForm, useFieldArray } from "react-hook-form";
import { MdOutlineAdd } from "react-icons/md";
import { controlViews } from "utils/view";

const getFieldIndex = (fields, item) => {
  return fields.findIndex(field => field.id === item.id);
}

const SectorForm = ({ sector, screen, setScreen, addNewSectors, loading }) => {
  const { setValue, watch, handleSubmit, control } = useForm();
  const { fields, append, replace, remove, swap, move, insert } = useFieldArray({
    control,
    name: "sectors",
  });

  const fieldLengthRef = useRef();

  const [activeTab, setActiveTab] = useState();

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
    addEmptySector();
  }, []);

  useEffect(() => {
    if (fields.length === 1 && !activeTab) {
      setActiveTab(fields[0]);
    } else {
      if (fields.length > fieldLengthRef.current) {
        setActiveTab(fields[fields.length - 1]);
      }
    }
    fieldLengthRef.current = fields.length;
  }, [fields]);

  const setCurrentTab = (tab) => {
    if (tab.id !== activeTab?.id) {
      setActiveTab(tab);
    }
  }

  const removeTabSector = (e) => {
    e.preventDefault();
    const fieldIdx = getFieldIndex(fields, activeTab);
    if (fieldIdx > -1 && fields.length > 1) {
      if (fieldIdx === 0) {
        setActiveTab(fields[fieldIdx + 1]);
      } else {
        setActiveTab(fields[fieldIdx - 1]);
      }
      remove(fieldIdx);
    }
  }

  const addEmptySector = () => {
    append({ 
      name: "", 
      // shortName: "", 
      imageFile: null,
      elementView: "name"
    });
  }

  const onSubmit = (data) => {
    if (addNewSectors) {
      const newFields = fields.map(field => ({
        name: field.name,
        // shortName: field.shortName,
        image: field.imageFile,
        elementView: field.elementView
      }));
      addNewSectors(newFields);
    }
  }

  const handleNameOnChange = (e) => {
    replace(fields.map((field) => {
      if (field.id === activeTab.id) {
        return { ...field, name: e.value };
      } else {
        return { ...field };
      }
    }));
  }

  // const handleShortNameOnChange = (e) => {
  //   replace(fields.map((field) => {
  //     if (field.id === activeTab.id) {
  //       return { ...field, shortName: e.value };
  //     } else {
  //       return { ...field };
  //     }
  //   }));
  // }

  const handleElementViewOnChange = (e) => {
    replace(fields.map((field) => {
      if (field.id === activeTab.id) {
        return { ...field, elementView: e.value };
      } else {
        return { ...field };
      }
    }));
  }
  
  const handleImageFileOnChange = (e) => {
    if (e.target.files[0]) {
      replace(fields.map((field) => {
        if (field.id === activeTab.id) {
          return { ...field, imageFile: e.target.files[0] };
        } else {
          return { ...field };
        }
      }));
    }
  }

  const handleUploadClick = (e) => {
    e.preventDefault();
    const inputUpload = document.getElementById("img-upload");
    if (inputUpload) {
      inputUpload.value = "";
      inputUpload.click();
    }
  }

  const isBtnSubmitDisabled = () => {
    return fields.some(field => !field.name || field.name === ""
      // || !field.shortName || field.shortName === ""
      || !field.imageFile
    );
  }

  return <>
    <H6 className={`fw-700 text-center mb-4`}>{screen?.name || ""}</H6>
    <div className="position-relative h-100">
      <Card elevation={0} className="overflow-auto">
        <Divider dense className="mb-3" />
        <div className="d-flex flex-wrap px-3 mb-3">
          {fields.map((field, fieldIdx) => <Button
            rounded
            key={fieldIdx}
            active={field.id === activeTab?.id}
            size="small"
            className="mx-1 mb-2"
            style={{ minWidth: 45 }}
            onClick={() => setCurrentTab(field)}
          >
            {fieldIdx + 1}
          </Button>)}
          <Button rounded size="small" bgColor="var(--bs-pink)" className="mx-1 px-3 mb-2" style={{ minWidth: "unset" }} onClick={addEmptySector}>
            <MdOutlineAdd size={18} color="#fff" />
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, fieldIdx) => <div key={fieldIdx} className={`px-2 mb-4${field.id === activeTab?.id ? "" : " d-none"}`}>
            <div>
              <Subtitle1 className="mb-2 px-2 fw-600">Sector name:</Subtitle1>
              <TextField id="input-name" name={"name-" + fieldIdx} type="text" disabled={loading} value={field["name"]} onChange={handleNameOnChange} placeholder="Enter Name" className="neu-TextField-full m-0" inputStyles={{ width: "100%" }} />
            </div>
            {/* <div>
              <Subtitle1 className="mb-2 px-2 fw-600">Short name:</Subtitle1>
              <TextField id="input-shortName" name={"shortName-" + fieldIdx} type="text" disabled={loading} value={field["shortName"]} onChange={handleShortNameOnChange} placeholder="Enter Shortname" className="neu-TextField-full m-0" inputStyles={{ width: "100%" }} />
            </div> */}
            <div className="mb-3">
              <Subtitle1 className="mb-2 px-2 fw-600">Image:</Subtitle1>
              <div className="py-1">
                <Card inset className="flex-fill ps-3 d-flex justify-content-between align-items-center overflow-hidden">
                  <div className="pe-3 w-100 text-truncate">
                    {!field["imageFile"] || field["imageFile"] === "" || !field["imageFile"].name ? <span style={{ color: "var(--g-bg-color-disabled-dark)" }}>Choose your image</span> : field["imageFile"].name}
                  </div>
                  <Button disabled={loading} id="btn-upload-container" size="large" color="var(--white)" bgColor="var(--warning)" className="position-relative" onClick={handleUploadClick}>
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
                <Radio value="image" label="Image" disabled={!field.imageFile} />
              </RadioGroup>
            </div>
          </div>)}
          <div className="px-2 py-3 d-flex justify-content-between align-items-center">
            <Button disabled={loading} className="mx-1" onClick={() => setScreen(controlViews.LIST)}>Back</Button>
            {fields.length > 1 && <Button disabled={loading} className="mx-1" color="red" onClick={removeTabSector}>Remove</Button>}
            <Button disabled={loading} id="btn-submit-container" color="var(--success)" className="mx-1 p-0" disabled={isBtnSubmitDisabled()}>Save</Button>
          </div>
        </form>
      </Card>
    </div>
  </>;
}

export default SectorForm;