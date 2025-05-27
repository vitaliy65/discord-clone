import { motion } from "motion/react";

export default function ListArrow({
  size,
  rotate,
  angle,
  initialAngle,
}: {
  size: string;
  rotate?: boolean;
  angle: number;
  initialAngle: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ rotate: initialAngle }}
      animate={{ rotate: rotate ? angle : initialAngle }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <g data-name="Layer 2">
        <g data-name="arrow-ios-downward">
          <rect width={size} height={size} opacity="0" />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 16a1 1 0 0 1-.64-.23l-6-5a1 1 0 1 1 1.28-1.54L12 13.71l5.36-4.32a1 1 0 0 1 1.41.15 1 1 0 0 1-.14 1.46l-6 4.83A1 1 0 0 1 12 16z"
            clipRule="evenodd"
          />
        </g>
      </g>
    </motion.svg>
  );
}
