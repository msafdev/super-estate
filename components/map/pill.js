"use client";
import useClickOutside from "@/utils/hooks/useClickOutside";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowLeftIcon, Bed, ShowerHead, Star } from "lucide-react";
import { useRef, useState, useEffect, useId } from "react";

const TRANSITION = {
  type: "spring",
  bounce: 0.05,
  duration: 0.3,
};

export default function Pill({ name, price, address, type }) {
  const uniqueId = useId();
  const pillRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [pill, setPill] = useState(null);

  const openMenu = () => {
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setPill(null);
  };

  useClickOutside(pillRef, () => {
    closeMenu();
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <MotionConfig transition={TRANSITION}>
      <div
        className="relative flex items-center justify-center"
        onMouseLeave={closeMenu}
      >
        <motion.div
          key="pill"
          layoutId={`popover-${uniqueId}`}
          className="marker-pill price"
          style={{
            borderRadius: 96,
          }}
          onMouseEnter={openMenu}
        >
          <motion.span
            layoutId={`popover-label-${uniqueId}`}
            className="text-xs text-nowrap"
          >
            {price}
          </motion.span>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={pillRef}
              layoutId={`popover-${uniqueId}`}
              className="absolute shadow-md min-h-[100px] w-[264px] overflow-hidden border outline-none bg-zinc-700 border-zinc-50/10"
              style={{
                borderRadius: 8,
                zIndex: isOpen ? 100 : 0,
              }}
            >
              <div className="flex h-full flex-col gap-y-3">
                <motion.span
                  layoutId={`popover-label-${uniqueId}`}
                  aria-hidden="true"
                  style={{
                    opacity: pill ? 0 : 1,
                  }}
                  className="absolute left-4 top-3 select-none text-sm text-zinc-400"
                >
                  {price}
                </motion.span>
                <motion.div
                  style={{
                    opacity: pill ? 0 : 1,
                  }}
                  key="close"
                  className="flex w-full px-4 pt-3"
                >
                  <span className="text-sm text-white ml-auto">{type}</span>
                </motion.div>
                <motion.div
                  key="content"
                  style={{
                    opacity: pill ? 0 : 1,
                  }}
                  className="flex flex-col w-full px-4 pb-3 gap-y-1.5"
                >
                  <span className="text-sm text-white mr-auto">{name}</span>
                  <span className="text-xs text-zinc-400 mr-auto">
                    {address}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
