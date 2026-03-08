'use client'

function StepCard({
  step,
  badgeClass,
  title,
  desc,
}: {
  step: string;
  badgeClass: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative z-10 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white shadow-md ${badgeClass}`}>
        {step}
      </div>
      <h4 className="mb-3 text-xl font-bold">{title}</h4>
      <p className="text-slate-600">{desc}</p>
    </div>
  );
}

export default StepCard;