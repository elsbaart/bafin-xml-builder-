"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepHeader } from "@/components/StepHeader";
import { Step1Meldungsart } from "@/components/steps/Step1Meldungsart";
import { Step2AIFMStammdaten } from "@/components/steps/Step2AIFMStammdaten";
import { Step3AIFMBeschreibung } from "@/components/steps/Step3AIFMBeschreibung";
import { Step4Vorschau } from "@/components/steps/Step4Vorschau";
import type { AIFMFormData } from "@/lib/types";
import { DEFAULT_FORM_DATA } from "@/lib/types";
import { parseXMLToFormData } from "@/lib/xml-parser";
import { Upload, AlertCircle } from "lucide-react";

const STEP_TITLES = [
  "Meldungsart & Zeitraum",
  "AIFM-Stammdaten",
  "AIFM-Beschreibung",
  "Vorschau & Download",
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AIFMFormData>(DEFAULT_FORM_DATA);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When noReporting=true we skip step 3 (AIFM Description)
  const totalSteps = data.aifmNoReportingFlag ? 3 : 4;

  const stepTitles = data.aifmNoReportingFlag
    ? [STEP_TITLES[0], STEP_TITLES[1], STEP_TITLES[3]]
    : STEP_TITLES;

  function patch(p: Partial<AIFMFormData>) {
    setData((prev) => ({ ...prev, ...p }));
  }

  function handleXMLUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const xml = ev.target?.result as string;
        const parsed = parseXMLToFormData(xml);
        setData((prev) => ({ ...prev, ...parsed }));
        setStep(1);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Fehler beim Lesen der XML-Datei");
      }
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  }

  // Map display step to actual step component (skip 3 when noReporting)
  function getComponentStep(): number {
    if (!data.aifmNoReportingFlag) return step;
    if (step >= 3) return step + 1; // display step 3 → component step 4
    return step;
  }

  const componentStep = getComponentStep();

  function renderStep() {
    if (componentStep === 1) return <Step1Meldungsart data={data} onChange={patch} />;
    if (componentStep === 2) return <Step2AIFMStammdaten data={data} onChange={patch} />;
    if (componentStep === 3) return <Step3AIFMBeschreibung data={data} onChange={patch} />;
    return <Step4Vorschau data={data} />;
  }

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">BaFin AIFMD XML-Generator</h1>
          <p className="text-muted-foreground mt-1">
            AIFM-Jahres­meldung für das MVP-Portal der BaFin (Schema Version 1.2)
          </p>
        </div>

        {/* XML Upload */}
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Vorhandene XML hochladen
          </Button>
          <span className="text-sm text-muted-foreground">
            Befüllt das Formular aus einer bestehenden XML-Datei vor
          </span>
          <input ref={fileInputRef} type="file" accept=".xml" className="hidden" onChange={handleXMLUpload} />
        </div>

        {uploadError && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {uploadError}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal">
              <StepHeader step={step} total={totalSteps} title={stepTitles[step - 1]} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
                Zurück
              </Button>
              {step < totalSteps && (
                <Button onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}>
                  Weiter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Basiert auf AIFMD_DATMAN_V1.2.xsd · BaFin MVP-Portal · Art. 3 Abs. 3 d) und Art. 24 AIFMD
        </p>
      </div>
    </main>
  );
}
