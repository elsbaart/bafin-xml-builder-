"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldHelp } from "@/components/FieldHelp";
import type { AIFMFormData } from "@/lib/types";
import {
  FILING_TYPE_LABELS,
  CONTENT_TYPE_LABELS,
  PERIOD_TYPE_LABELS,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";

interface Props {
  data: AIFMFormData;
  onChange: (patch: Partial<AIFMFormData>) => void;
}

export function Step1Meldungsart({ data, onChange }: Props) {
  const addAssumption = () =>
    onChange({ assumptions: [...data.assumptions, { questionNumber: 1, assumptionDescription: "" }] });

  const removeAssumption = (i: number) =>
    onChange({ assumptions: data.assumptions.filter((_, idx) => idx !== i) });

  const updateAssumption = (i: number, patch: Partial<typeof data.assumptions[0]>) => {
    const updated = data.assumptions.map((a, idx) => (idx === i ? { ...a, ...patch } : a));
    onChange({ assumptions: updated });
  };

  return (
    <div className="space-y-5">
      {/* FilingType */}
      <div>
        <Label className="flex items-center gap-1">
          Meldungsart (FilingType)
          <FieldHelp text="INIT: Erstmeldung für diesen Meldezeitraum. AMND: Korrektur einer bereits übermittelten Meldung. Auch AMND ohne vorheriges INIT ist möglich." />
        </Label>
        <Select value={data.filingType} onValueChange={(v) => onChange({ filingType: v as AIFMFormData["filingType"] })}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(FILING_TYPE_LABELS) as [AIFMFormData["filingType"], string][]).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* AIFMContentType */}
      <div>
        <Label className="flex items-center gap-1">
          Meldeinhalt (AIFMContentType)
          <FieldHelp text="1 = Vollständige Meldung nach Art. 24 Abs. 1 für alle verwalteten AIF. 2 = Vereinfachte Meldung nach Art. 3 Abs. 3 d) für registrierte KVGen. 3 = Vollständige Meldung für alle in DE vertriebenen AIF." />
        </Label>
        <Select value={data.aifmContentType} onValueChange={(v) => onChange({ aifmContentType: v as AIFMFormData["aifmContentType"] })}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(CONTENT_TYPE_LABELS) as [AIFMFormData["aifmContentType"], string][]).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reporting Period */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-1">
            Beginn des Meldezeitraums
            <FieldHelp text="Startdatum des Meldezeitraums im Format JJJJ-MM-TT. Muss auf den 1. Januar, April, Juli oder Oktober fallen." />
          </Label>
          <Input
            type="date"
            className="mt-1"
            value={data.reportingPeriodStartDate}
            onChange={(e) => onChange({ reportingPeriodStartDate: e.target.value })}
          />
        </div>
        <div>
          <Label className="flex items-center gap-1">
            Ende des Meldezeitraums
            <FieldHelp text="Enddatum des Meldezeitraums im Format JJJJ-MM-TT. Muss auf den letzten Tag eines Quartals fallen (31. März, 30. Juni, 30. September oder 31. Dezember)." />
          </Label>
          <Input
            type="date"
            className="mt-1"
            value={data.reportingPeriodEndDate}
            onChange={(e) => onChange({ reportingPeriodEndDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-1">
            Periodentyp (ReportingPeriodType)
            <FieldHelp text="Y1 für jährliche, Q1–Q4 für quartalsweise, H1/H2 für halbjährliche Meldungen. X1/X2 sind Sonderfälle bei Wechsel der Meldefrequenz." />
          </Label>
          <Select value={data.reportingPeriodType} onValueChange={(v) => onChange({ reportingPeriodType: v as AIFMFormData["reportingPeriodType"] })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(PERIOD_TYPE_LABELS) as [AIFMFormData["reportingPeriodType"], string][]).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="flex items-center gap-1">
            Meldejahr (ReportingPeriodYear)
            <FieldHelp text="Vierstelliges Kalenderjahr des Meldezeitraums (z.B. 2025). Gültig sind das aktuelle sowie die zwei vorangegangenen Kalenderjahre." />
          </Label>
          <Input
            type="number"
            className="mt-1"
            value={data.reportingPeriodYear}
            onChange={(e) => onChange({ reportingPeriodYear: e.target.value })}
            min={2013}
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      {/* LastReportingFlag */}
      <div className="flex items-start gap-3 p-3 border rounded-md">
        <input
          type="checkbox"
          id="lastReporting"
          checked={data.lastReportingFlag}
          onChange={(e) => onChange({ lastReportingFlag: e.target.checked })}
          className="mt-0.5 h-4 w-4 cursor-pointer"
        />
        <div>
          <Label htmlFor="lastReporting" className="cursor-pointer flex items-center gap-1">
            Letzte Meldung (LastReportingFlag)
            <FieldHelp text="Nur aktivieren, wenn dies die letzte Meldung ist und keine Folgemeldungen mehr eingereicht werden (z.B. bei Auflösung der KVG). Andernfalls werden weitere Meldungen von der BaFin erwartet." />
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">Aktivieren wenn keine weiteren Meldungen folgen werden</p>
        </div>
      </div>

      {/* Assumptions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="flex items-center gap-1">
            Anmerkungen / Annahmen (Assumptions)
            <FieldHelp text="Optionaler Block für Anmerkungen zu bestimmten Datenpunkten. Geben Sie die Fragennummer und eine Beschreibung (max. 300 Zeichen) an. Wird oft mit Fragennummer 1 und Text 'None' befüllt." />
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={addAssumption}>
            <PlusCircle className="h-4 w-4 mr-1" /> Hinzufügen
          </Button>
        </div>
        {data.assumptions.length === 0 && (
          <p className="text-sm text-muted-foreground">Keine Anmerkungen eingetragen</p>
        )}
        <div className="space-y-3">
          {data.assumptions.map((a, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-24 shrink-0">
                <Label className="text-xs">Frage Nr.</Label>
                <Input
                  type="number"
                  min={1}
                  value={a.questionNumber}
                  onChange={(e) => updateAssumption(i, { questionNumber: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">Beschreibung (max. 300 Zeichen)</Label>
                <Input
                  value={a.assumptionDescription}
                  maxLength={300}
                  onChange={(e) => updateAssumption(i, { assumptionDescription: e.target.value })}
                  className="mt-1"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-6"
                onClick={() => removeAssumption(i)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
