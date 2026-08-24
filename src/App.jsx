import { useEffect, useState } from "react";
import { Mail, ExternalLink, Play, Sun, Moon } from "lucide-react";
import "./App.css";

function getInitialTheme() {
  // The inline script in index.html already set this on <html> before
  // first paint; just read it back so React's state agrees with the DOM.
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function GithubIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0c-4.42 0-8 3.58-8 8a8.013 8.013 0 0 0 5.47 7.59c.4.08.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

// lucide-react has no LinkedIn brand icon either; standard "in" glyph.
function LinkedinIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const USERNAME = "jjcc2000";
const GITHUB_URL = `https://github.com/${USERNAME}`;
const LINKEDIN_URL = "https://www.linkedin.com/in/johan-chacon";
const EMAIL = "johanchaconchacon@gmail.com";

// Shown immediately and used as a fallback if the GitHub API is
// unreachable or rate-limited (60 unauthenticated requests/hour/IP).
const FALLBACK_PROFILE = {
  name: "Johan Chacon Chacon",
  bio: "Nodejs | TypeScript | Golang | Java | Solidity | Docker/Kubernetes | Terraform",
  avatar_url: "https://avatars.githubusercontent.com/u/114323459?v=4",
};

// Primary way to attach a hover-preview video to a project: open the repo
// on GitHub → Settings → General → "Website" field, and paste the
// YouTube link there (any watch/youtu.be/embed/shorts URL works). It's
// fetched live as `repo.homepage`, same as the rest of the repo data —
// no code changes needed when you upload a new walkthrough.
//
// This map is a fallback/override for repos where you'd rather not touch
// the Website field (e.g. it's already used for a live demo link).
const PROJECT_VIDEOS = {
  "Cross-Chain-Bridge": "dQw4w9WgXcQ",
};

function extractYouTubeId(url) {
  if (!url) return undefined;
  const match = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : undefined;
}

function attachVideos(list) {
  return list.map((project) => ({
    ...project,
    videoId:
      extractYouTubeId(project.homepage) || PROJECT_VIDEOS[project.name],
  }));
}

const FALLBACK_PROJECTS = attachVideos([
  {
    name: "Cross-Chain-Bridge",
    description:
      "A cross-chain bridge for moving assets between Arbitrum, Sepolia and Polygon.",
    language: "TypeScript",
    url: `${GITHUB_URL}/Cross-Chain-Bridge`,
  },
  {
    name: "blockchainIndexer",
    description:
      "Scalable indexer that listens to smart contract events and persists them to PostgreSQL.",
    language: "TypeScript",
    url: `${GITHUB_URL}/blockchainIndexer`,
  },
  {
    name: "AaveProtocol",
    description:
      "Solidity contracts exploring Aave-style lending protocol mechanics.",
    language: "Solidity",
    url: `${GITHUB_URL}/AaveProtocol`,
  },
  {
    name: "meta-relayer",
    description:
      "Ethereum transaction relayer API for meta-transactions, built with Express and ethers.js.",
    language: "JavaScript",
    url: `${GITHUB_URL}/meta-relayer`,
  },
  {
    name: "fee-recommendation-microservice",
    description:
      "Microservice that recommends transaction fees for on-chain activity.",
    language: "TypeScript",
    url: `${GITHUB_URL}/fee-recommendation-microservice`,
  },
  {
    name: "tradingBotKalshi",
    description: "Automated trading bot for the Kalshi prediction market.",
    language: "Python",
    url: `${GITHUB_URL}/tradingBotKalshi`,
  },
]);

function App() {
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [previewing, setPreviewing] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`),
          fetch(
            `https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=100`,
          ),
        ]);
        if (!userRes.ok || !reposRes.ok)
          throw new Error("GitHub API request failed");

        const user = await userRes.json();
        const repos = await reposRes.json();

        const topRepos = repos
          .filter((repo) => !repo.fork && repo.name !== USERNAME)
          .sort(
            (a, b) =>
              b.stargazers_count - a.stargazers_count ||
              new Date(b.pushed_at) - new Date(a.pushed_at),
          )
          .slice(0, 6)
          .map((repo) => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            url: repo.html_url,
            homepage: repo.homepage,
          }));
        const reposWithVideos = attachVideos(topRepos);

        if (!cancelled) {
          setProfile(user);
          if (reposWithVideos.length) setProjects(reposWithVideos);
        }
      } catch {
        // GitHub unreachable/rate-limited — fallback data already showing
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const skills = (profile.bio || "")
    .split("|")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <>
      <div className="grid-glow" aria-hidden="true"></div>

      <button
        type="button"
        className="theme-toggle"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? (
          <Sun size={18} strokeWidth={1.75} />
        ) : (
          <Moon size={18} strokeWidth={1.75} />
        )}
      </button>

      <section id="hero">
        <div className="hero-left">
          <img
            className="avatar"
            src={profile.avatar_url}
            alt={profile.name}
          />
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-role gradient-text">
            Backend &amp; Blockchain Engineer
          </p>
          <span className="hero-meta">
            <span className="pulse-dot" aria-hidden="true"></span>
            Costa Rica · Remote
          </span>

          <div className="social-row">
            <a
              className="social-icon"
              href={`mailto:${EMAIL}`}
              aria-label="Email"
            >
              <Mail size={18} strokeWidth={1.75} />
            </a>
            <a
              className="social-icon"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a
              className="social-icon"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
          </div>
        </div>

        <div className="hero-right">
          <p className="bio">
            I build backend systems and on-chain infrastructure — from
            cross-chain bridges and smart-contract indexers to
            Kubernetes-orchestrated microservices.
          </p>

          {skills.length > 0 && (
            <ul className="tags">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          )}

          <div className="cta-row">
            <a className="btn btn-primary" href="#projects">
              View Projects
            </a>
            <a
              className="btn btn-outline"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon size={18} />
              GitHub
            </a>
          </div>
        </div>
      </section>

      <section id="projects">
        <h2>
          <span className="gradient-text">Projects</span>
        </h2>

        <div className="project-grid">
          {projects.map((project) => (
            <a
              key={project.name}
              className="project-card"
              href={project.url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() =>
                project.videoId && setPreviewing(project.name)
              }
              onMouseLeave={() => setPreviewing(null)}
              onFocus={() => project.videoId && setPreviewing(project.name)}
              onBlur={() => setPreviewing(null)}
            >
              <div className="project-card-head">
                <h3>{project.name}</h3>
                <ExternalLink
                  size={16}
                  strokeWidth={1.75}
                  className="external-icon"
                />
              </div>
              {project.description && <p>{project.description}</p>}
              <div className="card-meta">
                {project.language && (
                  <span className="lang-badge">{project.language}</span>
                )}
                {project.videoId && (
                  <span className="video-badge">
                    <Play size={11} strokeWidth={2} fill="currentColor" />
                    Watch
                  </span>
                )}
              </div>
              {project.videoId && previewing === project.name && (
                <div className="project-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${project.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${project.videoId}`}
                    title={`${project.name} walkthrough`}
                    allow="autoplay; encrypted-media"
                  />
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      <section id="contact">
        <div className="contact-card">
          <h2>
            Let's build something{" "}
            <span className="gradient-text">together</span>
          </h2>
          <p>
            Open to backend, infra, and blockchain engineering opportunities.
          </p>
          <div className="contact-links">
            <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
              <Mail size={18} strokeWidth={1.75} />
              Email me
            </a>
            <a
              className="btn btn-outline"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon size={18} />
              GitHub
            </a>
            <a
              className="btn btn-primary"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
            >
              Linkedin
            </a>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2026 {profile.name}</p>
      </footer>
    </>
  );
}

export default App;
