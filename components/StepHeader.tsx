export function StepHeader({ step, total, title }: { step: number; total: number; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-1">Schritt {step} von {total}</p>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
    </div>
  );
}
