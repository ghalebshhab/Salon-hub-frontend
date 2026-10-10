import { Scissors } from "lucide-react";

function BarberAnimation() {
  return (
    <div className="barber-animation">
      <div className="barber-bg-circle circle-one"></div>
      <div className="barber-bg-circle circle-two"></div>

      <div className="barber-card-animation">
        <div className="barber-pole">
          <div className="pole-stripes"></div>
        </div>

        <div className="mirror">
          <div className="mirror-shine"></div>
        </div>

        <div className="barber-chair">
          <div className="chair-head"></div>
          <div className="chair-back"></div>
          <div className="chair-seat"></div>
          <div className="chair-base"></div>
          <div className="chair-stand"></div>
        </div>

        <div className="floating-scissors">
          <Scissors size={48} />
        </div>

        <div className="clipper">
          <div className="clipper-head"></div>
          <div className="clipper-body"></div>
        </div>

        <div className="spark spark-one"></div>
        <div className="spark spark-two"></div>
        <div className="spark spark-three"></div>
      </div>
    </div>
  );
}

export default BarberAnimation;
