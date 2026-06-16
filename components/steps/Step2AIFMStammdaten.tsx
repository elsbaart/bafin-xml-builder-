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
          <FieldHelp text="Gibt an, unter welchem Artikel der AIFMD die KVG gemeldet wird. Typisch für VRUK und einen PE-Buyout-Fonds als registrierte KVG nach Art. 3: Code 1. Für zugelassene KVGen mit nur ungehebelten PE-Fonds: Code 3." />
        </Label>
        <Select value={data.aifmReportingCode} onValueChange={(v) => onChange({ aifmReportingCode: v as AIFMFormData["aifmReportingCode"] })}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[620px]">
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
          <FieldHelp text="ISO-3166-1 Ländercode des Staates, in dem der AIFM seinen Sitz hat. Für deutsche KVGen immer: DE." />
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
          <FieldHelp text="Eindeutige BaFin-Kennnummer der KVG, bestehend aus 8 Stellen. Diese wird bei Registrierung oder Zulassung von der BaFin vergeben. Für VRUK: 10162899." />
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
          <FieldHelp text="Vollständiger rechtlicher Name der Kapitalverwaltungsgesellschaft gemäß Erlaubniserteilung bzw. Registrierung. Empfehlung: identisch mit dem zum LEI-Code hinterlegten Namen." />
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
            <FieldHelp text="Aktivieren wenn der AIFM seinen Sitz im Europäischen Wirtschaftsraum (EWR / EEA) hat. Für deutsche KVGen wie VRUK: immer aktiviert." />
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">Für deutsche KVGen: immer aktiviert</p>
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
            <FieldHelp text="Aktivieren wenn für den Meldezeitraum keine Daten zu verwalteten AIF vorliegen — z.B. weil noch keine AIF aufgelegt wurden oder zwischen Zulassung und Erstinvestition. Bei Aktivierung entfällt der nächste Schritt (Märkte, Instrumente, AuM). Bisherige VRUK-Meldungen: aktiviert. Sobald ein AIF aktiv investiert ist: deaktivieren." />
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deaktivieren sobald AIF aktiv investiert ist → dann Schritt 3 ausfüllen
          </p>
        </div>
      </div>
    </div>
  );
}
