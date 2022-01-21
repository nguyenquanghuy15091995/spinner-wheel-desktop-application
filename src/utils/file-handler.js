import { Howl } from "howler";
import { filteredSectors } from "./colors";
const { existsSync, writeFileSync, readFileSync, copyFileSync, mkdirSync, unlinkSync } = window.require("fs");

let assetsPath = __dirname.split("node_modules")[0];
let imageLoadPath = "assets/images/data/";
let audioPath = "main_window/assets/audios/";
if (process.env.NODE_ENV === "development") {
  assetsPath += "src\\main_window\\assets\\";
  imageLoadPath = "main_window/" + imageLoadPath;
} else {
  assetsPath += "\\assets\\";
  audioPath = assetsPath + "\\audios\\";
}
const jsonPath = assetsPath + "json\\";
const imagePath = assetsPath + "images\\data\\";

export const audioAssetPath = audioPath;

export const audioWheelScrolling = new Howl({ src: [audioPath + "wheel_scroll.mp3"], loop: false });
export const audioVictory = new Howl({ src: [audioPath + "victory.mp3"], loop: false });

const defaultJsonData = {
  appName: "Lucky Spnnier Wheel",
  sectors: [],
}

export const getDataFromFile = (filename) => {
  try {
    const fileData = readFileSync(jsonPath + filename, "utf8");
    return fileData ? JSON.parse(fileData) : null;
  } catch (error) {
    console.error("there was an error:", error.message);
    return null;
  }
};

export const setDataToFile = (filename, data) => {
  try {
    writeFileSync(jsonPath + filename, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("there was an error:", error.message);
    return false;
  }
}

export const isFileDataExisted = (filename) => {
  try {
    const fileData = existsSync(jsonPath + filename, "utf8");
    return fileData;

  } catch (error) {
    console.error("there was an error:", error.message);
    return false;
  }
}

export const handleCopyFile = (sourceFilename, desFileDirectory, newFilename) => {
  try {
    if (typeof sourceFilename === "string") {
      const extention = sourceFilename.split(".").pop() ? sourceFilename.split(".").pop() : sourceFilename;
      if (!existsSync(desFileDirectory)) {
        mkdirSync(desFileDirectory);
      }
      if (extention) {
        const finalFileName = extention.toUpperCase() + "_" + Date.now() + "_" + newFilename + "." + extention;
        copyFileSync(sourceFilename, desFileDirectory + finalFileName);
        return finalFileName;
      }
      return null;
    }
  } catch (error) {
    console.error("there was an error:", error.message);
    return null;
  }
}

export const removeFile = (sourceDir, filename) => {
  try {
    unlinkSync(sourceDir + filename);
    return true;
  } catch (error) {
    console.error("there was an error:", error.message);
    return false;
  }
}

export const copyImageFile = (sourceFilename, newFilename) => {
  return handleCopyFile(sourceFilename, imagePath, newFilename);
}

export const removeImageFile = (filename) => {
  return removeFile(imagePath, filename);
}

export const createDataJsonFile = () => {
  if (!isFileDataExisted("data.json")) {
    setDataToFile("data.json", defaultJsonData);
  }
}

export const getSectors = () => {
  if (isFileDataExisted("data.json")) {
    const jsonData = getDataFromFile("data.json") || defaultJsonData;

    if (jsonData && jsonData.sectors) {
      return jsonData.sectors;
    } else {
      return [];
    }
  } else {
    setDataToFile("data.json", defaultJsonData);
    return defaultJsonData.sectors;
  }
}

export const updateSectorsToFile = (newSectors, sectors, setSectors, onHandlingEnd) => {
  try {
    let jsonData = defaultJsonData;
    if (isFileDataExisted("data.json")) {
      jsonData = getDataFromFile("data.json") || defaultJsonData;
    }
    const temps = newSectors.map((sector) => {
      const newSector = { ...sector };
      if (sector.image) {
        const newFilename = copyImageFile(sector.image.path, sector.id);
        if (newFilename) {
          newSector.image = imageLoadPath + newFilename;
        }
      }
      return newSector;
    });

    const finalSectors = filteredSectors([...sectors, ...temps]);
    jsonData.sectors = finalSectors;
    setDataToFile("data.json", jsonData);
    setSectors(finalSectors);
    onHandlingEnd("");
  } catch (error) {
    onHandlingEnd("An error occurred while processing data!");
  }
}

export const updateDetailSectorToFile = (newSector, setSectors, onHandlingEnd) => {
  try {
    let jsonData = defaultJsonData;
    if (isFileDataExisted("data.json")) {
      jsonData = getDataFromFile("data.json") || defaultJsonData;
    }
    let oldImagePath = "";
    const temps = jsonData.sectors.map((sector) => {
      if (sector.id === newSector.id) {
        const sectorTemp = { ...newSector };
        if (sectorTemp.image && sectorTemp.image !== sector.image) {
          const arrTemps = sector.image.split("/");
          oldImagePath = arrTemps[arrTemps.length - 1];
          const newFilename = copyImageFile(sectorTemp.image.path, sectorTemp.id);
          if (newFilename) {
            sectorTemp.image = imageLoadPath + newFilename;
          }
        }
        return sectorTemp;
      } else {
        return sector;
      }
    });
    jsonData.sectors = temps;
    setDataToFile("data.json", jsonData);
    setSectors(temps);
    if (oldImagePath && oldImagePath !== "") {
      removeImageFile(oldImagePath);
    }
    onHandlingEnd("");
  } catch (error) {
    onHandlingEnd("An error occurred while processing data!");
  }
}

export const removeSectorInFile = (currentSector, setSectors, onHandlingEnd) => {
  try {
    let jsonData = defaultJsonData;
    if (isFileDataExisted("data.json")) {
      jsonData = getDataFromFile("data.json") || defaultJsonData;
    }
    let oldImagePath = "";
    if (currentSector.image && typeof currentSector.image === "string") {
      const arrTemps = currentSector.image.split("/");
      oldImagePath = arrTemps[arrTemps.length - 1];
    }
    const temps = jsonData.sectors.filter(item => item.id !== currentSector.id);
    jsonData.sectors = temps;
    setDataToFile("data.json", jsonData);
    setSectors(temps);
    if (oldImagePath && oldImagePath !== "") {
      removeImageFile(oldImagePath);
    }
    onHandlingEnd("");
  } catch (error) {
    onHandlingEnd("An error occurred while processing data!");
  }
}