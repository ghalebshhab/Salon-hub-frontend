import SideRays from "../../shared/components/SideRays.jsx";
import useDocumentTheme from "../../shared/theme/useDocumentTheme.js";

export default function AppBackground() {
  const theme = useDocumentTheme();
  const dark = theme === "dark";

  return (
    <div className="app-side-rays-layer" aria-hidden="true">
      <SideRays
        rayColor1={dark ? "#c58eba" : "#76546f"}
        rayColor2={dark ? "#d7a8ce" : "#a8799e"}
        origin="top-right"
        speed={0.75}
        intensity={dark ? 1.15 : 0.8}
        spread={3.1}
        density={4.6}
        sharpness={0.64}
        tilt={-4}
        falloff={1.35}
        glow={0.72}
        saturation={0.86}
        dust={0.08}
        followMouse
        mouseInfluence={0.2}
        lightMode={!dark}
        opacity={0.82}
        maxDevicePixelRatio={1.35}
      />
    </div>
  );
}
