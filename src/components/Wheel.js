import { useRef, useContext, useEffect, useMemo, useCallback } from "react";
import { Card, Fab } from "ui-neumorphism";
import { AppContext } from "contexts/app-context";
import { controlViews } from "utils/view";

const rand = (m, M) => Math.random() * (M - m) + m;
// let engine;
let dia = 0;
let rad = 0;
const PI = Math.PI;
const TAU = 2 * PI;

const friction = 0.9955; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians

const getIndex = (sectors) => {
  const tot = sectors.length;
  return Math.floor(tot - (ang - 1.5708) / TAU * tot) % tot
};

const frame = () => {
  if (!angVel) return;
  angVel *= friction; // Decrement velocity by friction
  if (angVel < 0.003) angVel = 0; // Bring to stop
  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
}

const WheelCanvas = ({ sectors, isSpinning, setSpinning, onSpinnerEnd, loading, screen, playWheelScrollingSound }) => {
  const wheelRef = useRef();
  const spiningRef = useRef(false);
  const sectorRef = useRef({});
  const memories = useMemo(() => {
    const sectorTemps = sectors.filter(item => item.visible);
    if (Array.isArray(sectors)) {
      return sectorTemps.map((sector, sectorIdx) => ({
        arc: TAU / sectorTemps.length,
        ang: (TAU * sectorIdx) / sectorTemps.length,
      }));
    }
    return [];
  }, [sectors]);

  useEffect(() => {
    if (wheelRef.current) {
      dia = wheelRef.current.width;
      rad = dia / 2;
    }
    return () => {
      cancelAnimationFrame(wheelRef.current);
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(sectors) && wheelRef.current) {
      const ctx = wheelRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, wheelRef.current.width, wheelRef.current.height);
        sectors.filter(item => item.visible).forEach((sector, sectorIdx) => {
          const arc = memories[sectorIdx].arc;
          const ang = memories[sectorIdx].ang;
          const background = new Image();
          if (sector.image) {
            background.src = sector.image;
          }
          background.onload = () => {
            ctx.save();
            // COLOR
            ctx.beginPath();
            ctx.fillStyle = sector.color;
            ctx.moveTo(rad, rad);
            ctx.arc(rad, rad, rad, ang, ang + arc);
            ctx.lineTo(rad, rad);
            ctx.fill();
            ctx.clip();
            //BACKGROUND
            ctx.translate(rad, rad);
            ctx.rotate(ang + arc / 2);
            ctx.textAlign = "right";
            ctx.font = "bold 30px sans-serif";
            if (sector.elementView === "image") {
              const ratio = background.width / background.height;
              const divideNumber = 5.6;
              ctx.drawImage(background, 70, -(dia / (divideNumber + ratio)), dia * ratio / (divideNumber / 2 + 0.3), (dia / ratio) / (divideNumber / 2 + 0.3));
            }
            // TEXT
            // if (sectors.length > 1) {
            //   ctx.fillStyle = "rgba(0,0,0,0.3)";
            //   ctx.fillRect(0, -(dia / 2), dia, dia);
            // }
            if (sector.elementView === "name") {
              ctx.fillStyle = "#333";
              ctx.fillText(sector.name, dia * 3 / 6.5, 10);
            }
            //
            ctx.restore();
          }
        });
      }
      const engine = () => {
        frame();
        // rotate
        const sectorTemps = sectors.filter(item => item.visible);
        if (sectorTemps.length > 0) {
          const sector = sectorTemps[getIndex(sectorTemps)];
          wheelRef.current.style.transform = `rotate(${ang - PI / 2}rad)`;
          if (angVel) {
            if (!spiningRef.current) {
              setSpinning(true);
              spiningRef.current = true;
            }
            if (sectorRef.current.id !== sector.id) {
              playWheelScrollingSound();
              sectorRef.current = sector;
            }
          } else {
            if (spiningRef.current) {
              onSpinnerEnd(sector);
              spiningRef.current = false;
            }
          }
        }
        requestAnimationFrame(engine);
      };
      cancelAnimationFrame(engine);
      engine();
    }
  }, [sectors]);

  return <canvas ref={wheelRef} id="wheel" width="500" height="500" className="rounded-circle overflow-hidden" />;
}

const Wheel = () => {
  const { sectors, isSpinning, setSpinning, onSpinnerEnd, loading, screen, playWheelScrollingSound } = useContext(AppContext);
  const WheelCanvasMemo = useCallback(() => <WheelCanvas
    sectors={sectors}
    isSpinning={isSpinning}
    setSpinning={setSpinning}
    onSpinnerEnd={onSpinnerEnd}
    loading={loading}
    screen={screen}
    playWheelScrollingSound={playWheelScrollingSound}
  />, [sectors]);
  const handleSpinClick = () => {
    if (!angVel) angVel = rand(0.2 * sectors.length / 2, 0.45 * sectors.length / 2);
  }

  return <div>
    <Card className="position-relative rounded-circle p-3 d-flex align-items-center justify-content-center overflow-hidden">
      <WheelCanvasMemo />
      {/* <canvas ref={wheelRef} id="wheel" width="500" height="500" className="rounded-circle overflow-hidden" /> */}
      <div className="position-absolute top-1/2 -right-1 -translate-y-1/2">
        <div className="translate-x-1/2">
          <Card bordered className="p-3 rotate-45 rounded-none bg-neu-blue shadow-none" />
        </div>
      </div>
      <Card inset className="position-absolute rounded-circle top-1/2 left-1/2 -translate-1/2 p-3 bg-white">
        <Fab size="large" disabled={isSpinning || sectors.filter(item => item.visible).length < 2 || loading || screen.id !== controlViews.LIST.id} onClick={handleSpinClick}>Spin</Fab>
      </Card>
    </Card>
  </div>
}

export default Wheel;