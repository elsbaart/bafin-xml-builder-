"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldHelp } from "@/components/FieldHelp";
import type { AIFMFormData } from "@/lib/types";
import { REPORTING_CODE_LABELS } from "@/lib/types";

interface Props {
  data: AIFMFormData;
  onChange: (patch: Partial<AIFMFormData>) => void;
}

export function Step2AIFMStammdaten({ data, onChange }: Props) {
  return (
    <div className="space-y-5">
      {/* AIFMReportingCode */}
      <div>
        <Label className="flex items-center gap-1">
          AIFM-Status (AIFMReportingCode)
          <FieldHelp text="Gibt an, unter welchem Artikel der AIFMD der AIFM gemeldet wird. Registrierte KVGen nach Art. 3 wählen Code 1. Vollständig zugelassene KVGen nach Art. 7 wählen je nach Frequenz Code 2–5." />
        </Label>
        <Select value={data.aifmReportingCode} onValueChange={(v) => onChange({ aifmReportingCode: v as AIFMFormData["aifmReportingCode"] })}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(REPORTING_CODE_LABELS) as [AIFMFormData["aifmReportingCode"], string][]).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Jurisdiction */}
      <div>
        <Label className="flex items-center gap-1">
          Sitzland des AIFM (AIFMJurisdiction)
          <FieldHelp text="ISO-3166-1 Ländercode des Staates, in dem der AIFM seinen Sitz hat. Für in Deutschland ansässige KVGen: DE." />
        </Label>
        <Input
          className="mt-1 w-24"
          value={data.aifmJurisdiction}
          maxLength={2}
          placeholder="DE"
          onChange={(e) => onChange({ aifmJurisdiction: e.target.value.toUpperCase() })}
        />
      </div>

      {/* NationalCode */}
      <div>
        <Label className="flex items-center gap-1">
          BaFin-ID (AIFMNationalCode)
          <FieldHelp text="Eindeutige BaFin-Kennnummer der KVG, bestehend aus 8 Stellen (z.B. 10162899). Diese wird von der BaFin bei Registrierung oder Zulassung vergeben." />
        </Label>
        <Input
          className="mt-1"
          value={data.aifmNationalCode}
          placeholder="z.B. 10162899"
          onChange={(e) => onChange({ aifmNationalCode: e.target.value })}
        />
      </div>

      {/* Name */}
      <div>
        <Label className="flex items-center gap-1">
          Name der KVG (AIFMName)
          <FieldHelp text="Vollständiger Name der Kapitalverwaltungsgesellschaft gemäß Erlaubniserteilung. Empfehlung: Identisch mit dem zum LEI-Code hinterlegten Namen." />
        </Label>
        <Input
          className="mt-1"
          value={data.aifmName}
          placeholder="z.B. VR Unternehmerkapital GmbH"
          maxLength={300}
          onChange={(e) => onChange({ aifmName: e.target.value })}
        />
      </div>

      {/* EEAFlag */}
      <div className="flex items-start gap-3 p-3 border rounded-md">
        <input
          type="checkbox"
          id="eeaFlag"
          checked={data.aifmEEAFlag}
          onChange={(e) => onChange({ aifmEEAFlag: e.target.checked })}
          className="mt-0.5 h-4 w-4 cursor-pointer"
        />
        <div>
          <Label htmlFor="eeaFlag" className="cursor-pointer flex items-center gap-1">
            AIFM im EWR ansässig (AIFMEEAFlag)
            <FieldHelp text="Aktivieren wenn der AIFM seinen Sitz im Europäischen Wirtschaftsraum (EWR) hat. Für deutsche KVGen immer aktiviert." />
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">Für deutsche KVGen: aktiviert</p>
        </div>
      </div>

      {/* NoReportingFlag */}
      <div className="flex items-start gap-3 p-3 border rounded-md">
        <input
          type="checkbox"
          id="noReporting"
          checked={data.aifmNoReportingFlag}
          onChange={(e) => onChange({ aifmNoReportingFlag: e.target.checked })}
          className="mt-0.5 h-4 w-4 cursor-pointer"
        />
        <div>
          <Label htmlFor="noReporting" className="cursor-pointer flex items-center gap-1">
            Keine AIF-Daten zu melden (AIFMNoReportingFlag)
            <FieldHelp text="Aktivieren wenn für den Meldezeitraum keine Daten zu verwalteten AIF vorliegen – z.B. weil noch keine AIF aufgelegt wurden oder zwischen Zulassung und Erstinvestition. Bei Aktivierung entfällt der Block 'AIFM-Beschreibung'." />
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Wenn aktiviert: Nur Header wird gemeldet, keine Märkte/Instrumente/AuM erforderlich
          </p>
        </div>
      </div>
    </div>
  );
}
