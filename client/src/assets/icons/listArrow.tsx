import { motion } from "motion/react";

export default function ListArrow({ rotate }: { rotate?: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ rotate: 0 }}
      animate={{ rotate: rotate ? -90 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <g data-name="Layer 2">
        <g data-name="arrow-ios-downward">
          <rect width="16" height="16" opacity="0" />
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15 1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16z"
            clip-rule="evenodd"
          />
        </g>
      </g>
    </motion.svg>
  );
}
