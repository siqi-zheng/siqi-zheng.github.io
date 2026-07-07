import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Github, Linkedin, Twitter, ExternalLink, FileText, ChevronDown, MapPin, GraduationCap, Download } from "lucide-react";
import FeaturedArticles from "@/components/FeaturedArticles";
import BackToTop from "@/components/BackToTop";
import { PublicationCard } from "@/components/PublicationCard";
import { parseBibtex, groupByYear, type BibEntry } from "@/lib/parseBibtex";
const AVATAR_URL = `${import.meta.env.BASE_URL}avatar.jpg`;
const CV_URL = `${import.meta.env.BASE_URL}Siqi_Zheng_CV.pdf`;

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const SKILLS = [
  { category: "Research", items: ["Bayesian Statistics", "In-context Learning", "Machine Learning", "Reproducibility"] },
  { category: "Programming", items: ["R", "Python", "SQL", "JavaScript", "Bash"] },
  { category: "Tools & Platforms", items: ["JupyterHub", "REDCap", "Git/GitHub", "Hydra"] },
  { category: "Teaching", items: ["Course Instruction", "Curriculum Design", "Auto-Grading Systems"] },
];

const EXPERIENCES = [
  {
    period: "2026 - Present",
    title: "PhD Student",
    org: "Dept. of Statistics & Data Science, National University of Singapore",
    description: "Supervisor: David Nott"
  },
  {
    period: "2025",
    title: "Sessional Instructor",
    org: "Dept. of Statistical Sciences, University of Toronto",
    description: "Instructor for Statistical Theory (STA255), a core undergraduate course for statistics minors with ~50 students; delivered 6 hours of lectures per week over a 6-week term.",
  },
  {
    period: "2022 - 2025",
    title: "Business Systems Analyst",
    org: "Academic, Research & Collaborative (ARC), University of Toronto",
    description: "Administered UofT JupyterHub (10K+ users) and REDCap survey platform (3K+ users), supporting scientific computation and research data collection for 50+ departments. Led the AI Virtual Tutors Pilot Project, deploying Generative AI chatbots across 6 courses.",
  },
  {
    period: "2023 - 2025",
    title: "Software Developer (Part-time)",
    org: "Dept. of Statistical Sciences, University of Toronto",
    description: "Developed and maintained RMarkUs, an open-source R package for automated grading of R assignments across 5 courses with class sizes up to 500 students.",
  },
  {
    period: "2020 - 2024",
    title: "Teaching Assistant (Part-time)",
    org: "Dept. of Statistical Sciences, University of Toronto",
    description: "TA for multiple undergraduate and graduate statistics courses, supporting instruction and student learning.",
  },
];

const PROJECTS = [
  {
    title: "Auto-grading with RMarkUs",
    description: (
      <>
        Built an open-source R package for automated grading of complex technical assignments, including statistical models and visualizations. Adopted by five undergraduate courses at UofT in three years, saving over {" "}
        <TooltipText
          text={<strong>750 hours</strong>}
          tooltip={"300 students × 5 courses × 10 assignments × ~15 mins manual grading time - 5 courses × 10 assignments × 60 minutes testing & deployment = ~750 hours saved per year."}
        />{" "}
        of manual grading time per year.
      </>
    ),
    link: "https://github.com/RAutoGrading/RMarkUs",
    tags: ["R", "Open Source", "Education"],
    id: "autograde",
  },
  {
    title: "AI Virtual Tutors Pilot",
    description: "Led the deployment of Generative AI chatbots across 6 university courses (60–200 students each), exploring AI-assisted learning at scale.",
    tags: ["Generative AI", "EdTech", "Leadership"],
    id: "ai-tutor",
  },
  {
    title: "Scientific Computational Systems Management",
    description: (
      <>
        Scaled two platforms at UofT-<a href="/blog/scaling-jupyterhub-university-60-yoy" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">JupyterHub</a> and <a href="/blog/strategic-redcap-management-university" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">REDCap</a> (an on-premise survey tool for researchers)-to 17K+ active users across 3 campuses, driving 60% YoY growth through a streamlined application process and cross-departmental collaboration.
      </>
    ),
    link: "https://datatools.utoronto.ca",
    tags: ["R", "Python", "Education"],
    id: "datatools",
  },
];

// Scroll-reveal hook
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        filter: visible ? "blur(0px)" : "blur(4px)",
        transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 600ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// --- Nav ---
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-14">
        <a
          href="#"
          className="text-[2.2rem] md:text-[2.3rem] lg:text-[2.4rem] font-semibold tracking-tight text-primary"
          style={{ fontFamily: "var(--font-cg)" }}
        >
          Siqi Zheng
        </a>

        <ul className="hidden md:flex gap-6 text-lg">
          {NAV_ITEMS.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
          aria-label="Toggle navigation"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 pb-4">
          {NAV_ITEMS.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground">
              {n.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// --- Hero ---
// function Hero() {
//   return (
//     <section className="min-h-screen flex items-center pt-14">
//       <div className="max-w-4xl mx-auto px-6 w-full py-16 md:py-24">
//         <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
//           <RevealSection className="shrink-0">
//             <img
//               src={AVATAR_URL}
//               alt="Siqi Zheng, PhD student at the National University of Singapore"
//               className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover shadow-lg shadow-foreground/5 ring-1 ring-border"
//               loading="eager"
//             />
//           </RevealSection>
//           <div className="text-center md:text-left">
//             <RevealSection delay={100}>
//               <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-foreground text-balance" style={{ fontFamily: "var(--font-serif)" }}>
//                 Siqi Zheng
//               </h1>
//             </RevealSection>
//             <RevealSection delay={200}>
//               <p className="mt-3 text-lg text-muted-foreground flex items-center justify-center md:justify-start gap-2 flex-wrap">
//                 <GraduationCap className="w-5 h-5" />
//                 PhD Student · Bayesian Statistics
//                 <span className="text-border">|</span>
//                 <MapPin className="w-4 h-4" /> NUS, Singapore
//               </p>
//             </RevealSection>
//             <RevealSection delay={300}>
//               <div className="mt-6 flex items-center gap-3 justify-center md:justify-start flex-wrap">
//                 <a
//                   href="mailto:timothyzheng2000@gmail.com"
//                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all duration-200 shadow-sm"
//                 >
//                   <Mail className="w-4 h-4" /> Get in Touch
//                 </a>
//                 <a
//                   href={CV_URL}
//                   download
//                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary active:scale-[0.97] transition-all duration-200"
//                 >
//                   <Download className="w-4 h-4" /> Download CV
//                 </a>
//               </div>
//             </RevealSection>
//             <RevealSection delay={400}>
//               <div className="mt-5 flex gap-4 justify-center md:justify-start">
//                 {[
//                   { href: "https://github.com/siqi-zheng", icon: Github, label: "GitHub" },
//                   { href: "https://www.linkedin.com/in/siqi-zheng-nus/", icon: Linkedin, label: "LinkedIn" },
//                   { href: "https://x.com/SiqiiiTim", icon: Twitter, label: "X / Twitter" },
//                 ].map(({ href, icon: Icon, label }) => (
//                   <a
//                     key={href}
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     aria-label={label}
//                     className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95 transition-all duration-200"
//                   >
//                     <Icon className="w-5 h-5" />
//                   </a>
//                 ))}
//               </div>
//             </RevealSection>
//           </div>
//         </div>
//         <div className="mt-16 flex justify-center">
//           <a href="#about" className="text-muted-foreground/50 hover:text-muted-foreground transition-colors animate-bounce">
//             <ChevronDown className="w-6 h-6" />
//           </a>
//         </div>
//       </div>

//     </section>
//   );
// }
function Hero() {
  const socialLinks = [
    { href: "https://github.com/siqi-zheng", icon: Github, label: "GitHub" },
    { href: "https://www.linkedin.com/in/siqi-zheng-nus/", icon: Linkedin, label: "LinkedIn" },
    { href: "https://x.com/SiqiiiTim", icon: Twitter, label: "X / Twitter" },
  ];
  return (

    <section className="min-h-screen flex items-center pt-14">
      <div className="max-w-6xl mx-auto px-6 w-full py-16 md:py-24">

        {/* <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-16"> */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 md:gap-10 lg:gap-16">          {/* Left Column: Profile Image & Social Icons */}
          <div className="flex flex-col items-center md:items-end w-full max-w-[340px] md:max-w-[380px] shrink-0 gap-6 mt-6 md:mt-0 md:self-stretch">
            <RevealSection className="w-full md:h-full flex justify-center md:justify-end">
              <img
                src={AVATAR_URL}
                alt="Siqi Zheng, PhD student at the National University of Singapore"
                className="w-full md:h-full rounded-2xl object-cover shadow-lg shadow-foreground/5 ring-1 ring-border"
                loading="eager"
              />
            </RevealSection>
          </div>

          {/* Right Column: Clear academic hero text */}
          <div className="text-center md:text-left max-w-xl h-full flex flex-col justify-between">
            <RevealSection delay={100}>
              <p className="text-sm md:text-base uppercase tracking-[0.18em] text-slate-500 mb-3">
                Probabilistic Machine Learning · Foundational Model · Open-Source Software
              </p>
            </RevealSection>

            <RevealSection delay={150}>
              <h1
                className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-normal tracking-tight leading-[1.08] text-muted-foreground mb-5"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                PhD Student in Statistics & Data Science
              </h1>
              <h2
                className="text-[1rem] md:text-[1.25rem] lg:text-[1.5rem] font-normal tracking-tight leading-[1.08] text-secondary-foreground mb-5"
                style={{ fontFamily: "var(--font-lora), serif" }}
              >
                National University of Singapore
              </h2>
            </RevealSection>

            <RevealSection delay={250}>
              <p className="text-lg md:text-[1.35rem] text-slate-700 leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8">
                Advancing Bayesian inference with deep learning models and in-context learning for tabular data.
              </p>
            </RevealSection>

            <RevealSection delay={350}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5 justify-center md:justify-start">
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a
                    href="#about"
                    className="inline-flex items-center justify-center rounded-md bg-[#021A40] px-6 py-3 text-white font-medium hover:bg-[#16325c] transition-colors duration-200"
                  >
                    About Me
                  </a>
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 text-[#021A40] font-medium hover:bg-slate-50 transition-colors duration-200"
                  >
                    View Research
                  </a>
                </div>

                {/* Social Icons */}
                <div className="flex flex-nowrap items-center justify-center md:justify-start gap-3">
                  {socialLinks.map(({ href, icon: Icon, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-[#021A40] hover:text-[#021A40] hover:shadow-md active:scale-95 transition-all duration-200"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </RevealSection>


          </div>
        </div>

        {/* Bouncing Scroll Indicator */}
        <div className="mt-16 flex justify-center">
          <a href="#about" className="text-muted-foreground/50 hover:text-[#021A40] transition-colors animate-bounce">
            <ChevronDown className="w-8 h-8" />
          </a>
        </div>

      </div>
    </section>
  );
}

// --- Section wrapper ---
function Section({ id, title, children, className = "" }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        <RevealSection>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-10" style={{ fontFamily: "var(--font-serif)" }}>
            {title}
          </h2>
        </RevealSection>
        {children}
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" title="About">
      <div className="max-w-prose space-y-5 md:space-y-6">
        <p className="text-base md:text-lg leading-relaxed text-muted-foreground text-left hyphens-auto">
          I am a first-year PhD student in Statistics and Data Science at the National University of Singapore, supervised by{" "}
          <a
            href="https://blog.nus.edu.sg/davidnott/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline underline-offset-4"
          >
            Prof. David Nott
          </a>
          . My research focuses on advancing Bayesian inference for modern learning systems, with interests spanning deep learning-based Bayesian methods, in-context learning for tabular data, simulation-based inference, and the Relative Belief Framework.
        </p>

        <p className="text-base md:text-lg leading-relaxed text-muted-foreground text-left hyphens-auto">
          Previously, I completed my MSc and HBSc in Statistics at the University of Toronto, where I worked with Professor Mike Evans and Scott Schwartz on the {" "}
          <a
            href="https://github.com/siqi-zheng/rbinfer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline underline-offset-4"
          >application of probabilistic programming in Relative Belief Inference</a>.
        </p>

        <p className="text-base md:text-lg leading-relaxed text-muted-foreground text-left hyphens-auto">
          Beyond research, I have  {" "}
          <a
            href="/blog/teaching-stats"
            className="text-primary hover:underline underline-offset-4"
          >
            taught statistics at UofT
          </a>, built {" "}
          <a
            href="#project-autograde"
            className="text-primary hover:underline underline-offset-4"
          >
            automatic grading tools for large-scale statistical education
          </a>
          , and managed research computing infrastructure, including work related to{" "}
          <a
            href="#project-datatools"
            className="text-primary hover:underline underline-offset-4"
          >
            JupyterHub and REDCap
          </a>
          .
        </p>
      </div>
    </Section>
  );
}

function SkillsSection() {
  return (
    <Section id="skills" title="Skills" className="bg-card">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {SKILLS.map((group, i) => (
          <RevealSection key={group.category} delay={i * 80}>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 rounded-md text-sm bg-background text-foreground border border-border shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </Section>
  );
}

function ExperienceSection() {
  return (
    <Section id="experience" title="Experience">
      <div className="space-y-10">
        {EXPERIENCES.map((exp, i) => (
          <RevealSection key={i} delay={i * 80}>
            <div className="flex gap-6">
              <div className="hidden sm:flex flex-col items-center pt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                {i < EXPERIENCES.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{exp.period}</p>
                <h3 className="text-lg font-semibold text-foreground mt-1" style={{ fontFamily: "var(--font-serif)" }}>{exp.title}</h3>
                <p className="text-sm text-primary mt-0.5">{exp.org}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed text-pretty">{exp.description}</p>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </Section>
  );
}



// 1. A simple custom tooltip component using Tailwind
function TooltipText({ text, tooltip }) {
  return (
    <span className="group relative inline-block border-b border-dashed border-muted-foreground/50 cursor-help">
      {text}
      {/* Tooltip Card */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-xs text-left bg-popover text-popover-foreground rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {tooltip}
        {/* Tooltip Arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-border"></span>
        <span className="absolute top-[calc(100%-1px)] left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-popover"></span>
      </span>
    </span>
  );
}

export function ProjectsSection() {
  return (
    <Section id="projects" title="Projects" className="bg-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROJECTS.map((proj, i) => (
          <RevealSection key={proj.title} delay={i * 100}>
            <article
              id={`project-${proj.id}`}
              className="scroll-mt-24 p-6 rounded-xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
            >
              <h3
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {proj.title}
              </h3>

              {/* 2. Render description natively so our React Component works */}
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1 text-pretty">
                {proj.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {proj.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
                >
                  View on GitHub <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </article>
          </RevealSection>
        ))}
      </div>
    </Section>
  );
}



// function PublicationsSection() {
//   return (
//     <Section id="publications" title="Publications">
//       <RevealSection>
//         <div className="p-6 rounded-xl border border-border bg-card">
//           <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">2022</p>
//           <h3 className="text-lg font-semibold text-foreground mt-1" style={{ fontFamily: "var(--font-serif)" }}>
//             A Comparison of Reproducibility Guidelines and Its Implications on Undergraduate Statistical Education
//           </h3>
//           <p className="text-sm text-foreground mt-1">Siqi Zheng</p>
//           <p className="text-sm text-accent mt-1 italic">
//             Best Undergraduate Oral Presentation — The Tenth Annual Canadian Statistics Student Conference (CSSC)
//           </p>
//           <div className="mt-4 flex gap-3">
//             <a href="https://arxiv.org/abs/2210.16350" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4">
//               <FileText className="w-3.5 h-3.5" /> arXiv
//             </a>
//             <a href="https://github.com/siqi-zheng/SSC_Reproducibility_Presentation" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4">
//               <ExternalLink className="w-3.5 h-3.5" /> Presentation
//             </a>
//           </div>
//         </div>
//       </RevealSection>
//     </Section>
//   );
// }
function PublicationsSection() {
  const [byYear, setByYear] = useState<Map<string, BibEntry[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}publications.bib`)
      .then((r) => r.text())
      .then((raw) => {
        setByYear(groupByYear(parseBibtex(raw)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Section id="publications" title="Publications">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        [...byYear.entries()].map(([year, pubs]) => (
          <div key={year} className="space-y-4 mb-8">
            <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              {year}
            </p>
            {pubs.map((entry) => (
              <RevealSection key={entry.id}>
                <PublicationCard entry={entry} />
              </RevealSection>
            ))}
          </div>
        ))
      )}
    </Section>
  );
}
function ContactSection() {
  return (
    <Section id="contact" title="Contact" className="bg-card">
      <RevealSection>
        <p className="text-muted-foreground text-pretty max-w-prose">
          I'm always open to discussing research collaborations, teaching opportunities, or internship positions. Feel free to reach out.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a href="mailto:timothyzheng2000@gmail.com" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.97] transition-all duration-200 shadow-sm">
            <Mail className="w-4 h-4" /> timothyzheng2000@gmail.com
          </a>
        </div>
        <div className="mt-4 flex gap-4">
          {[
            { href: "https://github.com/siqi-zheng", icon: Github, label: "GitHub" },
            { href: "https://www.linkedin.com/in/siqi-zheng-nus/", icon: Linkedin, label: "LinkedIn" },
            { href: "https://x.com/SiqiiiTim", icon: Twitter, label: "X" },
          ].map(({ href, icon: Icon, label }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Icon className="w-4 h-4" /> {label}
            </a>
          ))}
        </div>
      </RevealSection>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="py-8 border-t border-border">
      <div className="max-w-4xl mx-auto px-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Siqi Zheng. All rights reserved.
      </div>
    </footer>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const handleBlogNavigate = (slug: string) => navigate(`/blog/${slug}`);

  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <About />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <PublicationsSection />
      <FeaturedArticles onNavigate={handleBlogNavigate} />
      <ContactSection />
      <Footer />
      <BackToTop />
    </main>
  );
}
