import { Burst, Engraving, Hand, Pen, ScaleBox } from "@/components/v3/ink";
import { CASES } from "@/lib/content-v3";
import { CaseFrame } from "./CaseFrame";

const c = CASES.sampaio;

/**
 * As peças do escritório (landing, card do Instagram, seta e nota), todas
 * posicionadas a partir do canto da landing. O chamador escolhe onde esse
 * canto fica: no palco do desktop ou na caixa do celular.
 *
 * Ilustrativas: o botão da landing é um span, nada aqui é link (seção 4.6).
 */
function Pecas() {
  return (
    <>
      <div className="absolute top-0 left-0 z-[1] h-[440px] w-[620px] rounded-[14px] bg-chalk px-9 py-7 text-case-navy">
        <div className="font-serif text-[15px] leading-[1.55] font-semibold">
          {c.landing.brand}
        </div>
        <p className="mt-12 mb-6 max-w-[9.5ch] font-serif text-[42px] leading-[1.02] font-medium tracking-[-0.02em]">
          {c.landing.title}
        </p>
        <span className="inline-flex h-[42px] items-center rounded-[4px] bg-case-gold px-5 text-[14px] text-case-navy">
          {c.landing.button}
        </span>
      </div>
      <div className="adin absolute top-[100px] left-[420px] z-[2] w-[250px] rounded-[16px] border border-line-dark bg-ink p-3">
        <div className="flex aspect-[4/5] flex-col justify-end rounded-[10px] bg-case-navy p-6 font-serif text-[24px] leading-[1.1] text-chalk">
          <small className="mb-2 font-sans text-[12px] text-case-gold">
            {c.card.tag}
          </small>
          {c.card.text}
        </div>
      </div>
      <svg
        className="pointer-events-none absolute top-[410px] left-[390px] z-[3] overflow-visible"
        width="160"
        height="80"
        aria-hidden="true"
      >
        <Pen
          d="M150 70 C 110 70, 70 50, 40 14 M40 14 L 52 18 M40 14 L 42 27"
          delay={0.3}
        />
      </svg>
      <Hand
        delay={0.6}
        className="absolute top-[466px] left-[550px] z-[3] text-[24px] whitespace-nowrap"
      >
        {c.note}
      </Hand>
    </>
  );
}

export function Sampaio() {
  return (
    <CaseFrame
      label={c.stageLabel}
      name={c.name}
      description={c.description}
      link={c.url ? { href: c.url, label: c.linkLabel } : undefined}
      desk={
        <>
          <Burst
            viewBox="0 0 440 600"
            cx={220}
            cy={250}
            r={180}
            n={72}
            min={20}
            max={90}
            seed={13}
            ring
            opacity={0.45}
            delay={0.2}
            dur={1.8}
            className="top-0 right-0 h-[600px] w-[440px]"
          />
          <Engraving
            src="/v3/justica.webp"
            alt={c.statueAlt}
            width={440}
            height={600}
            className="absolute top-0 right-0 h-[600px] w-[440px]"
          />
          {/* Canto da landing: 80,70 na referência */}
          <div className="absolute top-[70px] left-[80px]">
            <Pecas />
          </div>
        </>
      }
      mobile={
        <>
          <div className="relative mx-auto h-[320px] w-[235px]">
            <Burst
              viewBox="0 0 440 600"
              cx={220}
              cy={250}
              r={180}
              n={72}
              min={20}
              max={90}
              seed={13}
              ring
              opacity={0.45}
              delay={0.2}
              dur={1.8}
              className="inset-0 h-full w-full"
            />
            <Engraving
              src="/v3/justica.webp"
              alt={c.statueAlt}
              width={440}
              height={600}
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <div className="px-3 pb-3">
            <ScaleBox w={760} h={520}>
              <div className="absolute top-[10px] left-[20px]">
                <Pecas />
              </div>
            </ScaleBox>
          </div>
        </>
      }
    />
  );
}
