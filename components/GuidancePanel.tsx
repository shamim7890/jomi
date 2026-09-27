// components/GuidancePanel.tsx
// একটি আইটেমের বিস্তারিত "কীভাবে করবেন" গাইড দেখানোর জন্য কম্পোনেন্ট।

import { HelpGuide } from "@/lib/types";

interface GuidancePanelProps {
  guidance: HelpGuide;
}

export default function GuidancePanel({ guidance }: GuidancePanelProps) {
  return (
    <div className="mt-2 rounded-md border border-emerald-100 bg-emerald-50/60 p-3 text-sm">
      <p className="font-medium text-gray-800">{guidance.summary}</p>

      {guidance.steps.length > 0 ? (
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-gray-700">
          {guidance.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      ) : null}

      {guidance.whereToGo && guidance.whereToGo.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            কোথায় যাবেন
          </p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {guidance.whereToGo.map((place, index) => (
              <li
                key={index}
                className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-700 ring-1 ring-inset ring-gray-200"
              >
                📍 {place}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {guidance.documentsNeeded && guidance.documentsNeeded.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            প্রয়োজনীয় কাগজপত্র
          </p>
          <ul className="mt-1 space-y-1 text-gray-700">
            {guidance.documentsNeeded.map((doc, index) => (
              <li key={index} className="flex items-start gap-1.5">
                <span>📄</span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {guidance.officialLink ? (
        <div className="mt-3">
          <a
            href={guidance.officialLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
          >
            🔗 {guidance.officialLink.label} ভিজিট করুন
          </a>
        </div>
      ) : null}

      {guidance.tip ? (
        <p className="mt-3 rounded bg-amber-50 p-2 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
          💡 <span className="font-medium">টিপ:</span> {guidance.tip}
        </p>
      ) : null}
    </div>
  );
}