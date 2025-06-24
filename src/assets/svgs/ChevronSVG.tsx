import { cn } from "@/utilities";

type TProps = {
  direction?: "left" | "right" | "top" | "down";
  color?: "black" | "white";
  strokeWidth?: number;
};
export default function ChevronSVG({
  direction,
  color,
  strokeWidth = 1.5,
}: TProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={cn(
        "size-6",
        {
          "-rotate-90": direction === "right",
          "rotate-0": direction === "down",
          "rotate-180": direction === "top",
          "rotate-90": direction === "left",
        },
        {
          "text-black": color === "black",
          "text-white": color === "white",
        }
      )}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
