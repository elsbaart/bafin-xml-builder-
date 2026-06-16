import { XMLParser } from "fast-xml-parser";
import type { AIFMFormData, MarketEntry, InstrumentEntry, Assumption } from "./types";
import { DEFAULT_MARKETS, DEFAULT_INSTRUMENTS } from "./types";

export function parseXMLToFormData(xmlString: string): Partial<AIFMFormData> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: false,
    parseTagValue: true,
  });

  const doc = parser.parse(xmlString);
  const root = doc?.AIFMReportingInfo;
  if (!root) throw new Error("Kein gültiges AIFMReportingInfo-Dokument");

  const rec = root.AIFMRecordInfo;
  if (!rec) throw new Error("AIFMRecordInfo nicht gefunden");

  const result: Partial<AIFMFormData> = {};

  result.filingType = str(rec.FilingType) as AIFMFormData["filingType"] || "INIT";
  result.aifmContentType = str(rec.AIFMContentType) as AIFMFormData["aifmContentType"] || "2";
  result.reportingPeriodStartDate = str(rec.ReportingPeriodStartDate);
  result.reportingPeriodEndDate = str(rec.ReportingPeriodEndDate);
  result.reportingPeriodType = str(rec.ReportingPeriodType) as AIFMFormData["reportingPeriodType"] || "Y1";
  result.reportingPeriodYear = str(rec.ReportingPeriodYear);
  result.lastReportingFlag = parseBool(rec.LastReportingFlag);
  result.aifmReportingCode = str(rec.AIFMReportingCode) as AIFMFormData["aifmReportingCode"] || "1";
  result.aifmJurisdiction = str(rec.AIFMJurisdiction) || "DE";
  result.aifmNationalCode = str(rec.AIFMNationalCode);
  result.aifmName = str(rec.AIFMName);
  result.aifmEEAFlag = parseBool(rec.AIFMEEAFlag, true);
  result.aifmNoReportingFlag = parseBool(rec.AIFMNoReportingFlag);

  // Assumptions
  const assumptionsRaw = rec.Assumptions?.Assumption;
  if (assumptionsRaw) {
    const list = Array.isArray(assumptionsRaw) ? assumptionsRaw : [assumptionsRaw];
    result.assumptions = list.map((a: Record<string, unknown>) => ({
      questionNumber: Number(a.QuestionNumber) || 1,
      assumptionDescription: str(a.AssumptionDescription),
    } as Assumption));
  } else {
    result.assumptions = [];
  }

  const desc = rec.AIFMCompleteDescription;
  if (desc) {
    result.aifmIdentifierLEI = str(desc.AIFMIdentifier?.AIFMIdentifierLEI);
    result.aifmIdentifierBIC = str(desc.AIFMIdentifier?.AIFMIdentifierBIC);

    // Markets
    const marketsRaw = desc.AIFMPrincipalMarkets?.AIFMFivePrincipalMarket;
    if (marketsRaw) {
      const list = Array.isArray(marketsRaw) ? marketsRaw : [marketsRaw];
      const markets: MarketEntry[] = DEFAULT_MARKETS.map((def) => {
        const found = list.find((m: Record<string, unknown>) => Number(m.Ranking) === def.ranking);
        if (!found) return def;
        return {
          ranking: def.ranking,
          marketCodeType: str((found.MarketIdentification as Record<string, unknown>)?.MarketCodeType) as MarketEntry["marketCodeType"] || "NOT",
          marketCode: str((found.MarketIdentification as Record<string, unknown>)?.MarketCode),
          aggregatedValueAmount: str(found.AggregatedValueAmount),
        };
      });
      result.principalMarkets = markets;
    }

    // Instruments
    const instrRaw = desc.AIFMPrincipalInstruments?.AIFMPrincipalInstrument;
    if (instrRaw) {
      const list = Array.isArray(instrRaw) ? instrRaw : [instrRaw];
      const instruments: InstrumentEntry[] = DEFAULT_INSTRUMENTS.map((def) => {
        const found = list.find((i: Record<string, unknown>) => Number(i.Ranking) === def.ranking);
        if (!found) return def;
        return {
          ranking: def.ranking,
          subAssetType: str(found.SubAssetType) || "NTA_NTA_NOTA",
          aggregatedValueAmount: str(found.AggregatedValueAmount),
        };
      });
      result.principalInstruments = instruments;
    }

    result.aumAmountInEuro = str(desc.AUMAmountInEuro);

    const bcd = desc.AIFMBaseCurrencyDescription;
    if (bcd) {
      result.baseCurrency = str(bcd.BaseCurrency) || "EUR";
      result.aumAmountInBaseCurrency = str(bcd.AUMAmountInBaseCurrency);
      result.fxEURReferenceRateType = str(bcd.FXEURReferenceRateType) as AIFMFormData["fxEURReferenceRateType"] || "";
      result.fxEURRate = str(bcd.FXEURRate);
      result.fxEUROtherReferenceRateDescription = str(bcd.FXEUROtherReferenceRateDescription);
    }
  }

  return result;
}

function str(val: unknown): string {
  if (val === null || val === undefined) return "";
  return String(val);
}

function parseBool(val: unknown, def = false): boolean {
  if (val === true || val === "true") return true;
  if (val === false || val === "false") return false;
  return def;
}
