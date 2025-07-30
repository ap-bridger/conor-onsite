type AscendingSortIconProps = {
  marginTop?: string;
  marginRight?: string;
  size?: string;
};
export function AscendingSortIcon({
  marginTop,
  marginRight,
}: AscendingSortIconProps) {
  return (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      // Note: It is important to set the min width and height, since SVGs
      // will naturally try to shrink to the parent container, which will
      // happen if the table gets truncated
      style={{
        minWidth: "24px",
        minHeight: "24px",
        marginTop,
        marginRight,
      }}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m8 10 4 4 4-4"
      />
    </svg>
  );
}