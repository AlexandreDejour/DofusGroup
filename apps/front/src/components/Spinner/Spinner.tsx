import "./Spinner.scss";

import { ClipLoader } from "react-spinners";

interface SpinnerProps {
  size: number;
  color: string;
  loading: boolean;
}

export default function Spinner({ size, color, loading }: SpinnerProps) {
  return (
    <div className="spinner_container">
      <ClipLoader
        size={size}
        color={color}
        loading={loading}
        aria-label="Loading Spinner"
      />
    </div>
  );
}
