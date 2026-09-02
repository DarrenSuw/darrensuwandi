'use client';


export default function AboutSection() {
  const highlights = [
    { label: 'Current', value: 'XAI Research', sub: 'IET target' },
    { label: 'Latest ship', value: 'Resume Forge', sub: 'v1 · Aug 2026' },
    { label: 'Award', value: 'Silver', sub: 'SEA-CICSIC 2026' },
  ];

  return (
    <section id="about" className="glass-section" style={{ paddingTop: 'var(--section-gap)', paddingBottom: 'var(--section-gap)', borderTop: '1px solid var(--border)' }}>
      <div className="sc">
        <div className="grid md:grid-cols-[200px_1fr] gap-16 md:gap-24 items-start">

          {/* Left */}
          <div style={{ paddingTop: '2px' }}>
            <span className="t-label" style={{ display: 'block', marginBottom: '16px' }}>// About</span>
            <h2 className="t-display" style={{ fontSize: '1.75rem' }}>Who I am</h2>
            <div style={{ width: '28px', height: '2px', background: 'var(--gold)', borderRadius: '1px', marginTop: '12px' }} />
          </div>

          {/* Right */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <p className="t-body" style={{ fontSize: '0.9375rem' }}>
                I&apos;m two years into a Bachelor of Digital Media &amp; Technology at Xiamen
                University Malaysia on a full scholarship — three Dean&apos;s List semesters,
                3.86 GPA, and still figuring out the difference between research I can
                publish and engineering I can ship. Most of my work lives in that gap.
              </p>
              <p className="t-body" style={{ fontSize: '0.9375rem' }}>
                Right now that means co-authoring a paper with Dr. Teh Jia Yew and Dr.
                Goh Sim Kuan on why most SHAP pipelines are quietly broken, while also
                running Resume Forge, a SaaS I built solo over six months. Omni-QC, a PCB
                inspection system I led for a 7-person team, won Silver at SEA-CICSIC
                earlier this year.
              </p>
              <p className="t-body" style={{ fontSize: '0.9375rem' }}>
                I&apos;m Indonesian, based in Malaysia. I write mostly in Python. I think about pipelines a lot.
              </p>
            </div>

            {/* Inline highlights — hairline bordered, no heavy cards */}
            <style>{`
              .about-highlight-cell {
                transition: transform 0.2s var(--ease-entrance), border-color 0.2s;
              }
              .about-highlight-cell:hover {
                transform: translateY(-2px);
                border-color: var(--gold) !important;
              }
            `}</style>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {highlights.map((item, i) => (
                <div
                  key={item.label}
                  className="about-highlight-cell flex flex-col gap-1.5 p-5"
                  style={{ borderRight: i < highlights.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <span className="t-eyebrow">{item.label}</span>
                  <span className="t-display" style={{ fontSize: '1rem' }}>{item.value}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--gold)' }}>{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
