import { cn } from "@/utilities";

type TProps = {
  direction?: "left" | "right" | "top" | "down";
};
export default function ArrowSVG({ direction ="right" }: TProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("size-6", {
        "rotate-45": direction === "right",
        "rotate-[135deg]": direction === "down",
        "-rotate-45": direction === "top",
        "-rotate-[135deg]": direction === "left",
      })}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
      />
    </svg>
  );
}
