"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldHelp } from "@/components/FieldHelp";
import type { AIFMFormData, MarketEntry, InstrumentEntry } from "@/lib/types";
import { SUB_ASSET_TYPES } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface Props {
  data: AIFMFormData;
  onChange: (patch: Partial<AIFMFormData>) => void;
}

const MARKET_CODE_TYPE_LABELS = {
  MIC: "MIC – Handelsplatz mit MIC-Code",
  OTC: "OTC – Over-the-Counter",
  XXX: "XXX – Kein spezifischer Markt",
  NOT: "NOT – Kein Eintrag für diesen Rang",
};

export function Step3AIFMBeschreibung({ data, onChange }: Props) {
  const updateMarket = (i: number, patch: Partial<MarketEntry>) => {
    const updated = data.principalMarkets.map((m, idx) => (idx === i ? { ...m, ...patch } : m));
    onChange({ principalMarkets: updated });
  };

  const updateInstrument = (i: number, patch: Partial<InstrumentEntry>) => {
    const updated = data.principalInstruments.map((inst, idx) => (idx === i ? { ...inst, ...patch } : inst));
    onChange({ principalInstruments: updated });
  };

  const nonEUR = data.baseCurrency && data.baseCurrency !== "EUR";

  return (
    <div className="space-y-8">
      {/* Identifier */}
      <div>
        <h3 className="font-medium mb-3">Identifikation der KVG</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-1">
              LEI-Code (AIFMIdentifierLEI)
              <FieldHelp text="Legal Entity Identifier nach ISO 17442, 20-stellig. Empfehlung: Angabe des LEI sofern vorhanden. Die BaFin prüft die Prüfsumme. Bei Änderung des LEI sind zusätzlich ReportingMemberState und AIFMNationalCode anzugeben." />
            </Label>
            <Input
              className="mt-1 font-mono"
              value={data.aifmIdentifierLEI}
              maxLength={20}
              placeholder="z.B. 529900T8BM49AURSDO55"
              onChange={(e) => onChange({ aifmIdentifierLEI: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <Label className="flex items-center gap-1">
              BIC-Code (AIFMIdentifierBIC)
              <FieldHelp text="BIC-Code nach ISO 9362, 8 oder 11 Stellen. Optional, kann anstelle eines LEI angegeben werden wenn kein LEI verfügbar ist." />
            </Label>
            <Input
              className="mt-1 font-mono"
              value={data.aifmIdentifierBIC}
              maxLength={11}
              placeholder="z.B. TESTDE20XXX"
              onChange={(e) => onChange({ aifmIdentifierBIC: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </div>

      {/* Principal Markets */}
      <div>
        <h3 className="font-medium mb-1 flex items-center gap-1">
          5 wichtigste Handelsmärkte (AIFMPrincipalMarkets)
          <FieldHelp text="Die 5 wichtigsten Märkte, an denen die KVG für ihre AIF handelt. Sortierung absteigend nach aggregiertem Wert. Werden weniger als 5 Märkte genutzt, die verbleibenden Ränge auf 'NOT' setzen." />
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Absteigend nach Handelswert sortieren. Nicht genutzte Ränge auf &quot;NOT&quot; setzen.
        </p>
        <div className="space-y-4">
          {data.principalMarkets.map((m, i) => (
            <div key={i} className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">Rang {m.ranking}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs flex items-center gap-1">
                    Markttyp
                    <FieldHelp text="MIC: Handelsplatz mit bekanntem ISO-10383-Code. OTC: außerbörslicher Handel. XXX: kein spezifischer Markt. NOT: dieser Rang wird nicht genutzt." />
                  </Label>
                  <Select
                    value={m.marketCodeType}
                    onValueChange={(v) => updateMarket(i, { marketCodeType: v as MarketEntry["marketCodeType"], marketCode: "" })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MARKET_CODE_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1">
                    MIC-Code
                    <FieldHelp text="Nur ausfüllen wenn Markttyp = MIC. Vierstelliger ISO-10383-Code des Handelsplatzes (z.B. XMUN für Börse München, XFRA für Frankfurt)." />
                  </Label>
                  <Input
                    className="mt-1 font-mono"
                    value={m.marketCode}
                    maxLength={4}
                    disabled={m.marketCodeType !== "MIC"}
                    placeholder={m.marketCodeType === "MIC" ? "z.B. XFRA" : "—"}
                    onChange={(e) => updateMarket(i, { marketCode: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1">
                    Aggregierter Wert (Basiswährung)
                    <FieldHelp text="Aggregierter Wert aller Assets, die an diesem Markt gehandelt werden. In der Basiswährung des AIFM, ohne Dezimalstellen, per letztem Arbeitstag des Meldezeitraums. Entfällt bei Markttyp NOT." />
                  </Label>
                  <Input
                    className="mt-1"
                    value={m.aggregatedValueAmount}
                    disabled={m.marketCodeType === "NOT"}
                    placeholder={m.marketCodeType === "NOT" ? "—" : "z.B. 3657723241"}
                    onChange={(e) => updateMarket(i, { aggregatedValueAmount: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Principal Instruments */}
      <div>
        <h3 className="font-medium mb-1 flex items-center gap-1">
          5 wichtigste Instrumentenklassen (AIFMPrincipalInstruments)
          <FieldHelp text="Die 5 wichtigsten Asset-Klassen (Sub-Asset-Types), in denen die KVG für ihre AIF handelt. Sortierung absteigend nach aggregiertem Wert. Werden weniger als 5 genutzt, die restlichen Ränge auf NTA_NTA_NOTA setzen." />
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Absteigend nach Handelswert sortieren. Nicht genutzte Ränge auf &quot;NTA_NTA_NOTA&quot; setzen.
        </p>
        <div className="space-y-4">
          {data.principalInstruments.map((inst, i) => (
            <div key={i} className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">Rang {inst.ranking}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs flex items-center gap-1">
                    Sub-Asset-Typ
                    <FieldHelp text="Asset-Klasse gemäß Annex II, Tabelle 1 der delegierten AIFMD-Verordnung (ESMA 2014/869). Es ist der höchste verfügbare Detaillierungsgrad zu verwenden." />
                  </Label>
                  <Select
                    value={inst.subAssetType}
                    onValueChange={(v) => updateInstrument(i, { subAssetType: v ?? "" })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {SUB_ASSET_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1">
                    Aggregierter Wert (Basiswährung)
                    <FieldHelp text="Aggregierter Wert aller Assets dieser Klasse in der Basiswährung des AIFM, ohne Dezimalstellen, per letztem Arbeitstag des Meldezeitraums. Entfällt bei NTA_NTA_NOTA." />
                  </Label>
                  <Input
                    className="mt-1"
                    value={inst.aggregatedValueAmount}
                    disabled={inst.subAssetType === "NTA_NTA_NOTA"}
                    placeholder={inst.subAssetType === "NTA_NTA_NOTA" ? "—" : "z.B. 3210283231"}
                    onChange={(e) => updateInstrument(i, { aggregatedValueAmount: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AUM */}
      <div>
        <h3 className="font-medium mb-3">Verwaltete Vermögenswerte (AuM)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-1">
              AuM in Euro (AUMAmountInEuro)
              <FieldHelp text="Gesamte verwaltete Vermögenswerte aller AIF in Euro, berechnet nach Art. 2 der delegierten AIFMD-Verordnung. Angabe ohne Dezimalstellen." />
            </Label>
            <Input
              className="mt-1"
              value={data.aumAmountInEuro}
              placeholder="z.B. 300000001"
              onChange={(e) => onChange({ aumAmountInEuro: e.target.value })}
            />
          </div>
          <div>
            <Label className="flex items-center gap-1">
              Basiswährung (BaseCurrency)
              <FieldHelp text="ISO-4217-Währungscode der Basiswährung des AIFM (z.B. EUR, USD, GBP). Nur anzugeben, wenn alle AIF dieselbe Basiswährung haben. Bei EUR entfallen FX-Rate-Angaben." />
            </Label>
            <Input
              className="mt-1 w-28 font-mono"
              value={data.baseCurrency}
              maxLength={3}
              placeholder="EUR"
              onChange={(e) => onChange({ baseCurrency: e.target.value.toUpperCase() })}
            />
          </div>
        </div>

        {/* Non-EUR fields */}
        {nonEUR && (
          <div className="mt-4 p-4 border rounded-md space-y-4 bg-muted/30">
            <p className="text-sm font-medium">Wechselkursangaben (erforderlich bei Nicht-EUR-Basiswährung)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1 text-sm">
                  AuM in Basiswährung
                  <FieldHelp text="Gesamte verwaltete Vermögenswerte in der Basiswährung des AIFM, ohne Dezimalstellen. Sollte identisch sein mit: AuM in EUR × Wechselkurs." />
                </Label>
                <Input
                  className="mt-1"
                  value={data.aumAmountInBaseCurrency}
                  placeholder="z.B. 350000000"
                  onChange={(e) => onChange({ aumAmountInBaseCurrency: e.target.value })}
                />
              </div>
              <div>
                <Label className="flex items-center gap-1 text-sm">
                  Wechselkursquelle
                  <FieldHelp text="ECB: Wechselkurs aus dem EZB-Referenzkurs. OTH: Andere Quelle (dann Quellenname angeben)." />
                </Label>
                <Select
                  value={data.fxEURReferenceRateType}
                  onValueChange={(v) => onChange({ fxEURReferenceRateType: v as AIFMFormData["fxEURReferenceRateType"] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Quelle wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ECB">ECB – EZB-Referenzkurs</SelectItem>
                    <SelectItem value="OTH">OTH – Andere Quelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1 text-sm">
                  Wechselkurs EUR (FXEURRate)
                  <FieldHelp text="EZB-Referenzkurs für die Umrechnung der Basiswährung in Euro per letztem Arbeitstag des Meldezeitraums. 4 Dezimalstellen." />
                </Label>
                <Input
                  className="mt-1"
                  value={data.fxEURRate}
                  placeholder="z.B. 1.0823"
                  onChange={(e) => onChange({ fxEURRate: e.target.value })}
                />
              </div>
              {data.fxEURReferenceRateType === "OTH" && (
                <div>
                  <Label className="flex items-center gap-1 text-sm">
                    Name der Wechselkursquelle
                    <FieldHelp text="Freitext: Name der Quelle des verwendeten Wechselkurses, wenn nicht EZB (z.B. Bloomberg, Reuters)." />
                  </Label>
                  <Input
                    className="mt-1"
                    value={data.fxEUROtherReferenceRateDescription}
                    maxLength={30}
                    placeholder="z.B. Bloomberg"
                    onChange={(e) => onChange({ fxEUROtherReferenceRateDescription: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
