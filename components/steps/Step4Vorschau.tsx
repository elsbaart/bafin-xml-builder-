"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateXML, downloadXML } from "@/lib/xml-generator";
import type { AIFMFormData } from "@/lib/types";

interface Props {
  data: AIFMFormData;
}

export function Step4Vorschau({ data }: Props) {
  const xml = generateXML(data);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">XML-Vorschau</h3>
          <p className="text-sm text-muted-foreground">
            Bitte prüfen Sie die generierte XML-Datei vor dem Download.
          </p>
        </div>
        <Button onClick={() => downloadXML(data)} size="lg">
          <Download className="mr-2 h-4 w-4" />
          XML herunterladen
        </Button>
      </div>

      <div className="rounded-md border bg-muted/40 overflow-auto max-h-[500px]">
        <pre className="p-4 text-xs font-mono whitespace-pre leading-relaxed">
          {xml}
        </pre>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium mb-1">Hinweise zum Upload im BaFin MVP-Portal</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Die XML-Datei muss vor dem Upload <strong>gzip-komprimiert</strong> werden (.xml.gz)</li>
          <li>Der Dateiname muss der BaFin-Namenskonvention entsprechen (siehe BaFin-Merkblatt)</li>
          <li>
            Der fachliche Schlüssel besteht aus: <strong>AIFMNationalCode + ReportingPeriodType + ReportingPeriodYear</strong> —
            eine erneute Einreichung mit gleichem Schlüssel überschreibt die vorherige Meldung vollständig
          </li>
          <li>Nach dem Upload stellt die BaFin eine Feedback-Datei bereit (kann einige Tage dauern)</li>
          <li>Bei Fehlern in der Feedback-Datei: Datei korrigieren und vollständig neu einreichen</li>
        </ul>
      </div>
    </div>
  );
}
