const colorBaseList = [
  // "#e91e63",
  // "#880e4f",
  // "#c51162",
  // "#9c27b0",
  // "#4a148c",
  // "#aa00ff",
  // "#2196f3",
  // "#0d47a1",
  // "#0d47a1",
  // "#009688",
  // "#004d40",
  // "#00838f",
  // "#ff5722",
  // "#bf360c",
  // "#dd2c00",
  // "#1A2421",
  // "#1A1110",
  // "#0C090A",
  // "#010127",
  // "#191C20",
  // "#1A1A1A",
  // "#0E161A",
  // "#060D0D",
  // "#1F2024"
  "#eeeee4",
  "#abdbe3",
  "#Ebfdd6",
  "#F9e2ff",
  "#f7b71d",
  "#fdef96",
  "#afa939",
]

export const getRandomColor = () => {
  return colorBaseList[Math.floor(Math.random() * colorBaseList.length)];
}

export const reAssignColor = (sectors, currentSector) => {
  // if (sectors.length === 0) {
  //   return colorBaseList[Math.floor(Math.random() * colorBaseList.length)];
  // } else {
  //   const newColors = colorBaseList.filter(item => item !== sectors[0].color && item !== sectors[sectors.length - 1].color);
  //   return newColors[Math.floor(Math.random() * newColors.length)];
  // }
  if (currentSector.index === 0) {
    return currentSector.color;
  }
  if (currentSector.index === (sectors.length - 1)) {
    const newColors = colorBaseList.filter(item => item !== sectors[0].color);
    return newColors[Math.floor(Math.random() * newColors.length)];
  }
  //  const temps = sectors.filter((item, index) => index > 0 && )
}

export const filteredSectors = (sectors) => {
  if (Array.isArray(sectors)) {
    if (sectors.length === 1) { return sectors; }
    const arrTemp = [...sectors];
    if (sectors.length >= 2) {
      if (arrTemp[0].color === arrTemp[arrTemp.length - 1].color) {
        const colorTemps = colorBaseList.filter(item => item !== arrTemp[0].color);
        arrTemp[arrTemp.length - 1].color = colorTemps[Math.floor(Math.random() * colorTemps.length)];
      }
      if (sectors.length > 2) {
        for (let i = 1; i < arrTemp.length - 1; i++) {
          if (arrTemp[i].color === arrTemp[i - 1].color || arrTemp[i].color === arrTemp[i + 1].color) {
            const colorTemps = colorBaseList.filter(item => item !== arrTemp[i - 1].color && item !== arrTemp[i + 1].color);
            arrTemp[i].color = colorTemps[Math.floor(Math.random() * colorTemps.length)];
          }
        }
      }
    }
    return arrTemp;
  }
  return sectors;
}