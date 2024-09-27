import { getSummary } from "@/utils/actions";
import { Bot, Earth, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Control = ({ map, bounds }) => {
  const [summary, setSummary] = useState("");

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

  const handleBot = async () => {
    if (bounds) {
      const { summary } = await getSummary(
        `Provide a summary for the area within the bounds: ${JSON.stringify(
          bounds
        )}`
      );
      setSummary(summary);
    }

    setTimeout(() => setSummary(""), 5000);
  };

  return (
    <div className="map-control-wrapper justify-end items-end">
      <AnimatePresence>
        {summary && (
          <motion.div
            className="map-control-summary px-4 py-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-zinc-600 text-sm font-medium">{summary}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="map-control">
        <button
          onClick={handleBot}
          className="map-control-button"
          title="Get Summary"
        >
          <Bot className="text-black/60 size-5" />
        </button>
      </div>
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
