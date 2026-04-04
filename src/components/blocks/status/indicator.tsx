import { CheckCircle, XCircle } from "lucide-react";

interface IndicatorProps {
  online: boolean;
}

export function Indicator({ online }: IndicatorProps) {
  return (
    <div className="mt-6 flex items-center gap-2">
      {online ? (
        <>
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-400">Online</span>
        </>
      ) : (
        <>
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-400">Offline</span>
        </>
      )}
    </div>
  );
}
