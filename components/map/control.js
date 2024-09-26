import { Earth, Minus, Plus } from "lucide-react";

const Control = ({ map }) => {
  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const toggleMap = () => {
    if (map) {
      map.setMapTypeId(
        map.getMapTypeId() === "roadmap" ? "satellite" : "roadmap"
      );
    }
  };

  return (
    <div className="map-control-wrapper">
      <div className="map-control">
        <button onClick={toggleMap} className="map-control-button">
          <Earth className="text-black/60 size-5" />
        </button>
      </div>
      <div className="map-control">
        <button onClick={zoomIn} className="map-control-button button-plus">
          <Plus className="text-black/60 size-5" />
        </button>
        <button onClick={zoomOut} className="map-control-button button-minus">
          <Minus className="text-black/60 size-5" />
        </button>
      </div>
    </div>
  );
};

export default Control;
