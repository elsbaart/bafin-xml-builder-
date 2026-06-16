import type { AIFMFormData } from "./types";

function esc(val: string): string {
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateXML(data: AIFMFormData): string {
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, "");

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<AIFMReportingInfo`;
  xml += ` xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`;
  xml += ` xsi:noNamespaceSchemaLocation="AIFMD_DATMAN_V1.2.xsd"`;
  xml += ` ReportingMemberState="DE"`;
  xml += ` Version="1.2"`;
  xml += ` CreationDateAndTime="${now}">\n`;

  xml += `\t<AIFMRecordInfo>\n`;
  xml += `\t\t<FilingType>${data.filingType}</FilingType>\n`;
  xml += `\t\t<AIFMContentType>${data.aifmContentType}</AIFMContentType>\n`;
  xml += `\t\t<ReportingPeriodStartDate>${data.reportingPeriodStartDate}</ReportingPeriodStartDate>\n`;
  xml += `\t\t<ReportingPeriodEndDate>${data.reportingPeriodEndDate}</ReportingPeriodEndDate>\n`;
  xml += `\t\t<ReportingPeriodType>${data.reportingPeriodType}</ReportingPeriodType>\n`;
  xml += `\t\t<ReportingPeriodYear>${data.reportingPeriodYear}</ReportingPeriodYear>\n`;
  xml += `\t\t<LastReportingFlag>${data.lastReportingFlag}</LastReportingFlag>\n`;

  if (data.assumptions.length > 0) {
    xml += `\t\t<Assumptions>\n`;
    for (const a of data.assumptions) {
      xml += `\t\t\t<Assumption>\n`;
      xml += `\t\t\t\t<QuestionNumber>${a.questionNumber}</QuestionNumber>\n`;
      xml += `\t\t\t\t<AssumptionDescription>${esc(a.assumptionDescription)}</AssumptionDescription>\n`;
      xml += `\t\t\t</Assumption>\n`;
    }
    xml += `\t\t</Assumptions>\n`;
  }

  xml += `\t\t<AIFMReportingCode>${data.aifmReportingCode}</AIFMReportingCode>\n`;
  xml += `\t\t<AIFMJurisdiction>${data.aifmJurisdiction}</AIFMJurisdiction>\n`;
  xml += `\t\t<AIFMNationalCode>${esc(data.aifmNationalCode)}</AIFMNationalCode>\n`;
  xml += `\t\t<AIFMName>${esc(data.aifmName)}</AIFMName>\n`;
  xml += `\t\t<AIFMEEAFlag>${data.aifmEEAFlag}</AIFMEEAFlag>\n`;
  xml += `\t\t<AIFMNoReportingFlag>${data.aifmNoReportingFlag}</AIFMNoReportingFlag>\n`;

  if (!data.aifmNoReportingFlag) {
    xml += `\t\t<AIFMCompleteDescription>\n`;

    const hasLEI = data.aifmIdentifierLEI.trim();
    const hasBIC = data.aifmIdentifierBIC.trim();
    if (hasLEI || hasBIC) {
      xml += `\t\t\t<AIFMIdentifier>\n`;
      if (hasLEI) xml += `\t\t\t\t<AIFMIdentifierLEI>${esc(data.aifmIdentifierLEI.trim())}</AIFMIdentifierLEI>\n`;
      if (hasBIC) xml += `\t\t\t\t<AIFMIdentifierBIC>${esc(data.aifmIdentifierBIC.trim())}</AIFMIdentifierBIC>\n`;
      xml += `\t\t\t</AIFMIdentifier>\n`;
    }

    xml += `\t\t\t<AIFMPrincipalMarkets>\n`;
    for (const m of data.principalMarkets) {
      xml += `\t\t\t\t<AIFMFivePrincipalMarket>\n`;
      xml += `\t\t\t\t\t<Ranking>${m.ranking}</Ranking>\n`;
      xml += `\t\t\t\t\t<MarketIdentification>\n`;
      xml += `\t\t\t\t\t\t<MarketCodeType>${m.marketCodeType}</MarketCodeType>\n`;
      if (m.marketCodeType === "MIC" && m.marketCode.trim()) {
        xml += `\t\t\t\t\t\t<MarketCode>${esc(m.marketCode.trim())}</MarketCode>\n`;
      }
      xml += `\t\t\t\t\t</MarketIdentification>\n`;
      if (m.marketCodeType !== "NOT" && m.aggregatedValueAmount.trim()) {
        xml += `\t\t\t\t\t<AggregatedValueAmount>${m.aggregatedValueAmount.trim()}</AggregatedValueAmount>\n`;
      }
      xml += `\t\t\t\t</AIFMFivePrincipalMarket>\n`;
    }
    xml += `\t\t\t</AIFMPrincipalMarkets>\n`;

    xml += `\t\t\t<AIFMPrincipalInstruments>\n`;
    for (const inst of data.principalInstruments) {
      xml += `\t\t\t\t<AIFMPrincipalInstrument>\n`;
      xml += `\t\t\t\t\t<Ranking>${inst.ranking}</Ranking>\n`;
      xml += `\t\t\t\t\t<SubAssetType>${inst.subAssetType}</SubAssetType>\n`;
      if (inst.subAssetType !== "NTA_NTA_NOTA" && inst.aggregatedValueAmount.trim()) {
        xml += `\t\t\t\t\t<AggregatedValueAmount>${inst.aggregatedValueAmount.trim()}</AggregatedValueAmount>\n`;
      }
      xml += `\t\t\t\t</AIFMPrincipalInstrument>\n`;
    }
    xml += `\t\t\t</AIFMPrincipalInstruments>\n`;

    xml += `\t\t\t<AUMAmountInEuro>${data.aumAmountInEuro.trim()}</AUMAmountInEuro>\n`;

    const nonEUR = data.baseCurrency && data.baseCurrency !== "EUR";
    if (data.baseCurrency && (nonEUR || data.aumAmountInBaseCurrency.trim())) {
      xml += `\t\t\t<AIFMBaseCurrencyDescription>\n`;
      xml += `\t\t\t\t<BaseCurrency>${data.baseCurrency}</BaseCurrency>\n`;
      xml += `\t\t\t\t<AUMAmountInBaseCurrency>${data.aumAmountInBaseCurrency.trim()}</AUMAmountInBaseCurrency>\n`;
      if (nonEUR && data.fxEURReferenceRateType) {
        xml += `\t\t\t\t<FXEURReferenceRateType>${data.fxEURReferenceRateType}</FXEURReferenceRateType>\n`;
        if (data.fxEURRate.trim()) {
          xml += `\t\t\t\t<FXEURRate>${data.fxEURRate.trim()}</FXEURRate>\n`;
        }
        if (data.fxEURReferenceRateType === "OTH" && data.fxEUROtherReferenceRateDescription.trim()) {
          xml += `\t\t\t\t<FXEUROtherReferenceRateDescription>${esc(data.fxEUROtherReferenceRateDescription.trim())}</FXEUROtherReferenceRateDescription>\n`;
        }
      }
      xml += `\t\t\t</AIFMBaseCurrencyDescription>\n`;
    }

    xml += `\t\t</AIFMCompleteDescription>\n`;
  }

  xml += `\t</AIFMRecordInfo>\n`;
  xml += `</AIFMReportingInfo>`;

  return xml;
}

export function downloadXML(data: AIFMFormData): void {
  const xml = generateXML(data);
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const year = data.reportingPeriodYear;
  const period = data.reportingPeriodType;
  const code = data.aifmNationalCode || "AIFM";
  a.href = url;
  a.download = `AIFM_${code}_${year}_${period}.xml`;
  a.click();
  URL.revokeObjectURL(url);
}
