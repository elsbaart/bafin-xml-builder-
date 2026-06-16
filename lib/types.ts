export type FilingType = "INIT" | "AMND";
export type AIFMContentType = "1" | "2" | "3";
export type ReportingPeriodType = "Q1" | "Q2" | "Q3" | "Q4" | "H1" | "H2" | "Y1" | "X1" | "X2";
export type AIFMReportingCode = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type MarketCodeType = "MIC" | "OTC" | "XXX" | "NOT";
export type FXEURReferenceRateType = "ECB" | "OTH";

export interface Assumption {
  questionNumber: number;
  assumptionDescription: string;
}

export interface MarketEntry {
  ranking: number;
  marketCodeType: MarketCodeType;
  marketCode: string;
  aggregatedValueAmount: string;
}

export interface InstrumentEntry {
  ranking: number;
  subAssetType: string;
  aggregatedValueAmount: string;
}

export interface AIFMFormData {
  filingType: FilingType;
  aifmContentType: AIFMContentType;
  reportingPeriodStartDate: string;
  reportingPeriodEndDate: string;
  reportingPeriodType: ReportingPeriodType;
  reportingPeriodYear: string;
  lastReportingFlag: boolean;
  assumptions: Assumption[];
  aifmReportingCode: AIFMReportingCode;
  aifmJurisdiction: string;
  aifmNationalCode: string;
  aifmName: string;
  aifmEEAFlag: boolean;
  aifmNoReportingFlag: boolean;
  aifmIdentifierLEI: string;
  aifmIdentifierBIC: string;
  principalMarkets: MarketEntry[];
  principalInstruments: InstrumentEntry[];
  aumAmountInEuro: string;
  baseCurrency: string;
  aumAmountInBaseCurrency: string;
  fxEURReferenceRateType: FXEURReferenceRateType | "";
  fxEURRate: string;
  fxEUROtherReferenceRateDescription: string;
}

export const FILING_TYPE_LABELS: Record<FilingType, string> = {
  INIT: "INIT – Erstmeldung für den Meldezeitraum",
  AMND: "AMND – Korrektur einer bereits übermittelten Meldung",
};

export const CONTENT_TYPE_LABELS: Record<AIFMContentType, string> = {
  "1": "1 – Art. 24 Abs. 1 für alle verwalteten AIF",
  "2": "2 – Art. 3 Abs. 3 d) für alle verwalteten AIF (registrierte KVG)",
  "3": "3 – Art. 24 Abs. 1 für alle in Deutschland vertriebenen AIF",
};

export const PERIOD_TYPE_LABELS: Record<ReportingPeriodType, string> = {
  Y1: "Y1 – Jährlich",
  Q1: "Q1 – 1. Quartal",
  Q2: "Q2 – 2. Quartal",
  Q3: "Q3 – 3. Quartal",
  Q4: "Q4 – 4. Quartal",
  H1: "H1 – 1. Halbjahr",
  H2: "H2 – 2. Halbjahr",
  X1: "X1 – Q1–Q3 (Sonderfall Periodenwechsel)",
  X2: "X2 – Q2–Q4 (Sonderfall Periodenwechsel)",
};

export const REPORTING_CODE_LABELS: Record<AIFMReportingCode, string> = {
  "1": "1 – Registrierter AIFM (Art. 3)",
  "2": "2 – AIFM mit Erlaubnis, opt-in (Art. 7)",
  "3": "3 – AIFM mit Erlaubnis, nur ungehebelte AIF / Private Equity (Art. 7)",
  "4": "4 – AIFM mit Erlaubnis, halbjährige Meldepflicht (Art. 7)",
  "5": "5 – AIFM mit Erlaubnis, quartalsweise Meldepflicht (Art. 7)",
  "6": "6 – Non-EU-AIFM, Private Placement, jährlich (Art. 42)",
  "7": "7 – Non-EU-AIFM, Private Placement, ungehebelte AIF / PE (Art. 42)",
  "8": "8 – Non-EU-AIFM, Private Placement, halbjährlich (Art. 42)",
  "9": "9 – Non-EU-AIFM, Private Placement, quartalsweise (Art. 42)",
};

export const SUB_ASSET_TYPES: { value: string; label: string }[] = [
  { value: "NTA_NTA_NOTA", label: "Kein Eintrag (NTA_NTA_NOTA)" },
  { value: "SEC_SHP_EQS", label: "Aktien börsennotiert (SEC_SHP_EQS)" },
  { value: "SEC_SHP_NES", label: "Aktien nicht börsennotiert (SEC_SHP_NES)" },
  { value: "SEC_SHP_UCIT", label: "UCITS-Fondsanteile (SEC_SHP_UCIT)" },
  { value: "SEC_SHP_AIFS", label: "AIF-Anteile (SEC_SHP_AIFS)" },
  { value: "SEC_SHP_OTHR", label: "Sonstige Eigenkapitalinstrumente (SEC_SHP_OTHR)" },
  { value: "SEC_DEB_CBON", label: "Unternehmensanleihen (SEC_DEB_CBON)" },
  { value: "SEC_DEB_CPIN", label: "Commercial Paper / Kurzläufer (SEC_DEB_CPIN)" },
  { value: "SEC_DEB_SBON", label: "Staatsanleihen (SEC_DEB_SBON)" },
  { value: "SEC_DEB_CVBD", label: "Wandelanleihen (SEC_DEB_CVBD)" },
  { value: "SEC_DEB_OTHR", label: "Sonstige Schuldtitel (SEC_DEB_OTHR)" },
  { value: "SEC_SSP_ABSS", label: "ABS (SEC_SSP_ABSS)" },
  { value: "SEC_SSP_RMBS", label: "RMBS (SEC_SSP_RMBS)" },
  { value: "SEC_SSP_CMBS", label: "CMBS (SEC_SSP_CMBS)" },
  { value: "SEC_SSP_CLO", label: "CLO (SEC_SSP_CLO)" },
  { value: "SEC_SSP_CDO", label: "CDO (SEC_SSP_CDO)" },
  { value: "SEC_SSP_OTHR", label: "Sonstige strukturierte Wertpapiere (SEC_SSP_OTHR)" },
  { value: "SEC_MBO_MMKT", label: "Geldmarktinstrumente (SEC_MBO_MMKT)" },
  { value: "SEC_MBO_OTHR", label: "Sonstige übertragbare Wertpapiere (SEC_MBO_OTHR)" },
  { value: "DER_EQD_EQD", label: "Aktienderivate (DER_EQD_EQD)" },
  { value: "DER_FID_FID", label: "Zinsinstrumentderivate (DER_FID_FID)" },
  { value: "DER_CDS_CDS", label: "Credit Default Swaps (DER_CDS_CDS)" },
  { value: "DER_FEX_INVT", label: "Devisenderivate Investment (DER_FEX_INVT)" },
  { value: "DER_FEX_HEDG", label: "Devisenderivate Hedging (DER_FEX_HEDG)" },
  { value: "DER_IRD_INTR", label: "Zinsderivate (DER_IRD_INTR)" },
  { value: "DER_CTY_CTY", label: "Rohstoffderivate (DER_CTY_CTY)" },
  { value: "DER_OTH_OTH", label: "Sonstige Derivate (DER_OTH_OTH)" },
  { value: "PHY_RES_RESL", label: "Wohnimmobilien (PHY_RES_RESL)" },
  { value: "PHY_RES_COML", label: "Gewerbeimmobilien (PHY_RES_COML)" },
  { value: "PHY_RES_OTHR", label: "Sonstige Immobilien (PHY_RES_OTHR)" },
  { value: "PHY_GDS_COMD", label: "Rohstoffe physisch (PHY_GDS_COMD)" },
  { value: "PHY_GDS_OTHR", label: "Sonstige physische Güter (PHY_GDS_OTHR)" },
  { value: "CSH_CSH_DPST", label: "Einlagen / Bargeld (CSH_CSH_DPST)" },
  { value: "CSH_CSH_OTHR", label: "Sonstige liquide Mittel (CSH_CSH_OTHR)" },
  { value: "LON_LON_LCOR", label: "Unternehmenskredite (LON_LON_LCOR)" },
  { value: "LON_LON_LRET", label: "Privatkredite (LON_LON_LRET)" },
  { value: "LON_LON_ICCF", label: "Inter-Company-Kredite (LON_LON_ICCF)" },
  { value: "LON_LON_OTHR", label: "Sonstige Kredite (LON_LON_OTHR)" },
  { value: "OTH_OTH_OTH", label: "Sonstige Vermögenswerte (OTH_OTH_OTH)" },
];

export const DEFAULT_MARKETS: MarketEntry[] = Array.from({ length: 5 }, (_, i) => ({
  ranking: i + 1,
  marketCodeType: "NOT" as MarketCodeType,
  marketCode: "",
  aggregatedValueAmount: "",
}));

export const DEFAULT_INSTRUMENTS: InstrumentEntry[] = Array.from({ length: 5 }, (_, i) => ({
  ranking: i + 1,
  subAssetType: "NTA_NTA_NOTA",
  aggregatedValueAmount: "",
}));

export const DEFAULT_FORM_DATA: AIFMFormData = {
  filingType: "INIT",
  aifmContentType: "2",
  reportingPeriodStartDate: "2025-01-01",
  reportingPeriodEndDate: "2025-12-31",
  reportingPeriodType: "Y1",
  reportingPeriodYear: "2025",
  lastReportingFlag: false,
  assumptions: [{ questionNumber: 1, assumptionDescription: "None" }],
  aifmReportingCode: "1",
  aifmJurisdiction: "DE",
  aifmNationalCode: "10162899",
  aifmName: "VR Unternehmerkapital GmbH",
  aifmEEAFlag: true,
  aifmNoReportingFlag: true,
  aifmIdentifierLEI: "",
  aifmIdentifierBIC: "",
  principalMarkets: DEFAULT_MARKETS,
  principalInstruments: DEFAULT_INSTRUMENTS,
  aumAmountInEuro: "",
  baseCurrency: "EUR",
  aumAmountInBaseCurrency: "",
  fxEURReferenceRateType: "",
  fxEURRate: "",
  fxEUROtherReferenceRateDescription: "",
};
