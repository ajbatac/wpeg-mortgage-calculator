import { AlertTriangle } from "lucide-react";

interface MortgageWarningsProps {
  warnings: string[];
}

export default function MortgageWarnings({ warnings }: MortgageWarningsProps) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div
      className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-8"
      role="region"
      aria-label="Mortgage considerations and warnings"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" aria-hidden="true" />
        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400">
          Important Considerations
        </h3>
      </div>
      <ul className="space-y-2">
        {warnings.map((warning, index) => (
          <li key={index} className="text-amber-700 dark:text-amber-300 text-sm">
            • {warning}
          </li>
        ))}
      </ul>
    </div>
  );
}

