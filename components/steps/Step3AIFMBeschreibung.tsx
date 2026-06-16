"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldHelp, TooltipSection } from "@/components/FieldHelp";
import type { AIFMFormData, MarketEntry, InstrumentEntry } from "@/lib/types";
import { SUB_ASSET_TYPES } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface Props {
  data: AIFMFormData;
  onChange: (patch: Partial<AIFMFormData>) => void;
}

const MARKET_CODE_TYPE_LABELS = {
  MIC: "MIC – Handelsplatz mit MIC-Code (z.B. XFRA für Frankfurt)",
  OTC: "OTC – Over-the-Counter / außerbörslich",
  XXX: "XXX – Kein spezifischer Markt (direkte Beteiligungen)",
  NOT: "NOT – Rang wird nicht genutzt",
};

const marketsTooltip = (
  <div>
    <p>Die 5 wichtigsten Märkte, an denen die KVG für ihre AIF handelt — über alle AIF aggregiert, absteigend nach Wert. Nicht genutzte Ränge auf <strong>NOT</strong> setzen (kein Betrag).</p>
    <p className="mt-1"><strong>Markttypen:</strong> MIC = Börse (MIC-Code angeben) · OTC = außerbörslich · XXX = kein spezifischer Markt (direkte Investments) · NOT = Rang nicht genutzt</p>
    <TooltipSection label="PE-Buyout MidCap Beispiel">
      <p>Rang 1: <strong>XXX</strong> – Portfoliounternehmen (Fair Value, z.B. 240.000.000)</p>
      <p>Rang 2: <strong>OTC</strong> – Liquiditätsanlagen / Geldmarkt (z.B. 10.000.000)</p>
      <p>Rang 3: <strong>MIC + XFRA</strong> – falls börsennotierte Positionen (post-IPO, Anteilstausch)</p>
      <p>Ränge ohne Nutzung: <strong>NOT</strong> (kein Betrag)</p>
    </TooltipSection>
    <TooltipSection label="VRUK">
      <p>Bei <strong>NoReportingFlag = true</strong> entfällt dieser Block. Sobald ein AIF aktiv investiert, Flag deaktivieren und Märkte befüllen.</p>
    </TooltipSection>
  </div>
);

const marketTypeTooltip = (
  <div>
    <p><strong>MIC</strong> – Regulierter Handelsplatz mit ISO-10383-Code → MIC-Code pflegen (z.B. XFRA, XETR, XLON). Für börsennotierte Positionen nach IPO oder Anteilstausch.</p>
    <p className="mt-1"><strong>OTC</strong> – Außerbörslich: Geldmarktinstrumente, Schuldscheindarlehen, OTC-Derivate zur Absicherung.</p>
    <p className="mt-1"><strong>XXX</strong> – Kein spezifischer Markt: direkte Unternehmensbeteiligungen (nicht börsennotiert). Wert = Fair Value der Portfoliounternehmen.</p>
    <p className="mt-1"><strong>NOT</strong> – Rang nicht genutzt. Kein Betrag angeben. NOT ≠ XXX.</p>
  </div>
);

const marketValueTooltip = (
  <div>
    <p>Summe aller Assets dieses Markttyps, über alle AIF aggregiert, in der Basiswährung, ohne Dezimalstellen, per letztem Arbeitstag des Meldezeitraums.</p>
    <TooltipSection label="Je nach Markttyp">
      <p><strong>XXX:</strong> Fair Value der direkten Unternehmensbeteiligungen</p>
      <p><strong>OTC:</strong> Wert der Geldmarkt-/Liquiditätsanlagen</p>
      <p><strong>MIC:</strong> Börsenmarktwert der notierten Positionen</p>
      <p><strong>NOT:</strong> kein Betrag</p>
    </TooltipSection>
  </div>
);

const instrumentsTooltip = (
  <div>
    <p>Die 5 wichtigsten Asset-Klassen (Sub-Asset-Types gemäß Annex II Tabelle 1 AIFMD-Verordnung), über alle AIF aggregiert, absteigend nach Wert. Nicht genutzte Ränge auf <strong>NTA_NTA_NOTA</strong> setzen (kein Betrag).</p>
    <TooltipSection label="PE-Buyout MidCap Beispiel">
      <p>Rang 1: <strong>SEC_SHP_NES</strong> – direkte Eigenkapitalbeteiligungen (nicht börsennotiert), Fair Value z.B. 240 Mio.</p>
      <p>Rang 2: <strong>LON_LON_LCOR</strong> – Mezzanine / Gesellschafterdarlehen, z.B. 30 Mio.</p>
      <p>Rang 3: <strong>SEC_MBO_MMKT</strong> oder <strong>CSH_CSH_DPST</strong> – Liquiditätsreserve / Bankguthaben, z.B. 10 Mio.</p>
      <p>Rang 4: <strong>SEC_SHP_EQS</strong> – falls börsennotierte Positionen (post-IPO, Anteilstausch)</p>
      <p>Rang 4/5: <strong>DER_FEX_HEDG</strong> oder <strong>DER_IRD_INTR</strong> – Währungs- oder Zinsabsicherung falls vorhanden</p>
      <p>Nicht genutzte Ränge: <strong>NTA_NTA_NOTA</strong></p>
    </TooltipSection>
    <TooltipSection label="VRUK">
      <p>Bei <strong>NoReportingFlag = true</strong> entfällt dieser Block. Sobald ein AIF aktiv investiert, Flag deaktivieren und Instrumente befüllen.</p>
    </TooltipSection>
  </div>
);

const subAssetTypeTooltip = (
  <div>
    <p>Asset-Klasse nach Annex II Tabelle 1 AIFMD-Verordnung, höchster verfügbarer Detaillierungsgrad verwenden.</p>
    <TooltipSection label="Wichtigste Typen für PE-Fonds">
      <p><strong>SEC_SHP_NES</strong> – Eigenkapital nicht-börsennotiert (Kernposition PE-Buyout)</p>
      <p><strong>SEC_SHP_EQS</strong> – Aktien börsennotiert (post-IPO, Anteilstausch)</p>
      <p><strong>LON_LON_LCOR</strong> – Unternehmenskredite / Mezzanine</p>
      <p><strong>SEC_MBO_MMKT</strong> – Geldmarktinstrumente (Liquiditätsanlage)</p>
      <p><strong>CSH_CSH_DPST</strong> – Bankguthaben / Einlagen</p>
      <p><strong>DER_FEX_HEDG</strong> – Devisenderivate (Währungsabsicherung)</p>
      <p><strong>DER_IRD_INTR</strong> – Zinsderivate (Zinsabsicherung)</p>
      <p><strong>NTA_NTA_NOTA</strong> – Rang nicht genutzt (kein Betrag)</p>
    </TooltipSection>
  </div>
);

const instrumentValueTooltip = (
  <div>
    <p>Fair Value bzw. Marktwert aller Positionen dieser Klasse über alle AIF, in Basiswährung, ohne Dezimalstellen, per letztem Arbeitstag des Meldezeitraums.</p>
    <p className="mt-1">Bei <strong>NTA_NTA_NOTA</strong>: kein Betrag angeben.</p>
  </div>
);

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
              <FieldHelp text="Legal Entity Identifier nach ISO 17442, 20-stellig. Die BaFin prüft die Prüfsumme. Bei Änderung des LEI sind zusätzlich ReportingMemberState und AIFMNationalCode in den Identifier-Block aufzunehmen. LEI abrufbar über gleif.org oder die Bundesbank." />
            </Label>
            <Input
              className="mt-1 font-mono"
              value={data.aifmIdentifierLEI}
              maxLength={20}
              placeholder="20-stelliger LEI-Code"
              onChange={(e) => onChange({ aifmIdentifierLEI: e.target.value.toUpperCase() })}
            />
          </div>
          <div>
            <Label className="flex items-center gap-1">
              BIC-Code (AIFMIdentifierBIC)
              <FieldHelp text="BIC-Code nach ISO 9362, 8 oder 11 Stellen. Optional — kann angegeben werden wenn kein LEI verfügbar ist oder zusätzlich zum LEI." />
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
        <h3 className="font-medium mb-3 flex items-center gap-1">
          5 wichtigste Handelsmärkte (AIFMPrincipalMarkets)
          <FieldHelp text={marketsTooltip} />
        </h3>
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
                    <FieldHelp text={marketTypeTooltip} />
                  </Label>
                  <Select
                    value={m.marketCodeType}
                    onValueChange={(v) => updateMarket(i, { marketCodeType: v as MarketEntry["marketCodeType"], marketCode: "" })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-[380px]">
                      {Object.entries(MARKET_CODE_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1">
                    MIC-Code
                    <FieldHelp text="Nur ausfüllen wenn Markttyp = MIC. Vierstelliger ISO-10383-Code. Beispiele: XFRA (Frankfurt), XETR (Xetra), XMUN (München), XLON (London), XPAR (Paris)." />
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
                    <FieldHelp text={marketValueTooltip} />
                  </Label>
                  <Input
                    className="mt-1"
                    value={m.aggregatedValueAmount}
                    disabled={m.marketCodeType === "NOT"}
                    placeholder={m.marketCodeType === "NOT" ? "—" : "Betrag ohne Dezimalstellen"}
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
        <h3 className="font-medium mb-3 flex items-center gap-1">
          5 wichtigste Instrumentenklassen (AIFMPrincipalInstruments)
          <FieldHelp text={instrumentsTooltip} />
        </h3>
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
                    <FieldHelp text={subAssetTypeTooltip} />
                  </Label>
                  <Select
                    value={inst.subAssetType}
                    onValueChange={(v) => updateInstrument(i, { subAssetType: v ?? "" })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-[460px] max-h-72">
                      {SUB_ASSET_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1">
                    Aggregierter Wert (Basiswährung)
                    <FieldHelp text={instrumentValueTooltip} />
                  </Label>
                  <Input
                    className="mt-1"
                    value={inst.aggregatedValueAmount}
                    disabled={inst.subAssetType === "NTA_NTA_NOTA"}
                    placeholder={inst.subAssetType === "NTA_NTA_NOTA" ? "—" : "Betrag ohne Dezimalstellen"}
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
              <FieldHelp text="Gesamte verwaltete Vermögenswerte aller AIF in Euro, berechnet nach Art. 2 der delegierten AIFMD-Verordnung (Brutto-Methode). Angabe ohne Dezimalstellen. PE-Buyout MidCap: typisch 150–500 Mio. EUR." />
            </Label>
            <Input
              className="mt-1"
              value={data.aumAmountInEuro}
              placeholder="z.B. 250000000"
              onChange={(e) => onChange({ aumAmountInEuro: e.target.value })}
            />
          </div>
          <div>
            <Label className="flex items-center gap-1">
              Basiswährung (BaseCurrency)
              <FieldHelp text="ISO-4217-Währungscode der Basiswährung des AIFM (z.B. EUR, USD, GBP). Nur anzugeben wenn alle AIF dieselbe Basiswährung haben. Bei EUR entfallen FX-Rate-Angaben. Typisch für deutsche PE-Fonds: EUR." />
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
                  placeholder="Betrag ohne Dezimalstellen"
                  onChange={(e) => onChange({ aumAmountInBaseCurrency: e.target.value })}
                />
              </div>
              <div>
                <Label className="flex items-center gap-1 text-sm">
                  Wechselkursquelle
                  <FieldHelp text="ECB: Wechselkurs aus dem EZB-Referenzkurs (tägliche Veröffentlichung). OTH: Andere Quelle (z.B. Bloomberg, Reuters) — dann Quellenname im nächsten Feld angeben." />
                </Label>
                <Select
                  value={data.fxEURReferenceRateType}
                  onValueChange={(v) => onChange({ fxEURReferenceRateType: v as AIFMFormData["fxEURReferenceRateType"] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Quelle wählen" />
                  </SelectTrigger>
                  <SelectContent className="min-w-[280px]">
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
                  <FieldHelp text="EZB-Referenzkurs der Basiswährung gegenüber EUR per letztem Arbeitstag des Meldezeitraums. 4 Dezimalstellen. Beispiel USD: 1.0823 bedeutet 1 EUR = 1.0823 USD." />
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
                    <FieldHelp text="Freitext: Name der Quelle des verwendeten Wechselkurses wenn nicht EZB. Beispiele: Bloomberg, Reuters, Bundesbank." />
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
