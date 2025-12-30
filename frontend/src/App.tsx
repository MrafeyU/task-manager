import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Button from './components/Button';
import Tasks from "./pages/Tasks";
import Completed from "./pages/Completed";
import Login from './pages/Login';
import Register from './pages/Register';
import { getToken } from './auth';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');
  // No manual dark toggle UI anymore; determine effective theme from `forceTheme` (dev-only) or system preference
  // and apply the `dark` class accordingly.

  const [forceTheme, setForceTheme] = useState<'light'|'dark'>(() => {
    // Prefer an explicit stored choice; otherwise use OS preference
    try {
      const stored = localStorage.getItem('forceTheme') as 'light'|'dark' | null;
      if (stored === 'light' || stored === 'dark') return stored;
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Apply force theme overrides (DEV only). This injects a high-specificity stylesheet
  // to help with debugging situations where OS/browser forces a dark presentation.
  useEffect(() => {
    // Apply force-theme overrides (used to help with debug and to allow explicit user control).

    const lightStyles = `
/* Force Light overrides (dev-only) */
html.force-light #app-root,
html.force-light .bg-gray-50,
html.force-light .bg-white,
html.force-light .bg-gray-900,
html.force-light .bg-gray-800,
html.force-light .rounded-2xl {
  background-image: none !important;
  background-color: #ffffff !important;
  color: #0f172a !important;
}

/* Normalize page-level gradients to white (dev-only) */
html.force-light .bg-gradient-to-br:not(.text-white),
html.force-light .bg-gradient-to-b:not(.text-white),
html.force-light .bg-gradient-to-r:not(.text-white),
html.force-light .from-gray-50,
html.force-light .to-gray-100,
html.force-light .via-purple-50 {
  background-image: none !important;
  background-color: #ffffff !important;
  color: #0f172a !important;
}
html.force-light .text-white,
html.force-light .dark\\:text-white,
html.force-light .text-gray-900,
html.force-light .text-gray-700 {
  color: #0f172a !important;
}
html.force-light .border-gray-200,
html.force-light .border-gray-300 {
  border-color: #e6eef8 !important;
}
/* Preserve gradients (do not strip background-image) and ensure readable button text */
html.force-light .bg-gradient-to-r.text-white,
html.force-light .bg-gradient-to-br.text-white,
html.force-light .bg-gradient-to-l.text-white,
html.force-light .bg-gradient-to-b.text-white {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}
/* Ensure solid colored buttons (non-gradient utilities) keep white text */
html.force-light .from-blue-600.text-white, html.force-light .from-indigo-600.text-white, html.force-light .from-red-600.text-white, html.force-light .from-green-600.text-white,
html.force-light .bg-blue-600.text-white, html.force-light .bg-indigo-600.text-white, html.force-light .bg-red-600.text-white, html.force-light .bg-green-500.text-white {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}
/* Ensure card containers (rounded-xl) use white background and dark text */
html.force-light .rounded-xl,
html.force-light .bg-white {
  background-color: #ffffff !important;
  color: #0f172a !important;
  border-color: #e6eef8 !important;
}
`;

    const darkStyles = `
/* Force Dark overrides (dev-only) */
html.force-dark #app-root,
html.force-dark .bg-gray-50,
html.force-dark .bg-white,
html.force-dark .bg-gray-50,
html.force-dark .rounded-2xl {
  background-image: none !important;
  background-color: #0b1220 !important;
  color: #e6eef8 !important;
}
html.force-dark .text-gray-900,
html.force-dark .text-gray-700,
html.force-dark .text-white,
html.force-dark .dark\\:text-white {
  color: #e6eef8 !important;
}
html.force-dark .border-gray-200,
html.force-dark .border-gray-300,
html.force-dark .border-gray-700 {
  border-color: #213042 !important;
}
/* Preserve gradients (do not strip background-image) and ensure readable button text */
html.force-dark .bg-gradient-to-r.text-white,
html.force-dark .bg-gradient-to-br.text-white,
html.force-dark .bg-gradient-to-l.text-white,
html.force-dark .bg-gradient-to-b.text-white {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}
/* Ensure solid colored buttons (non-gradient utilities) keep white text */
html.force-dark .from-blue-600.text-white, html.force-dark .from-indigo-600.text-white, html.force-dark .from-red-600.text-white, html.force-dark .from-green-600.text-white,
html.force-dark .bg-blue-600.text-white, html.force-dark .bg-indigo-600.text-white, html.force-dark .bg-red-600.text-white, html.force-dark .bg-green-500.text-white {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}
/* Ensure card containers (rounded-xl) use dark background and light text */
html.force-dark .rounded-xl,
html.force-dark .bg-white {
  background-color: #0b1220 !important;
  color: #e6eef8 !important;
  border-color: #213042 !important;
}
`;

    const apply = (mode: 'light'|'dark') => {
      const existing = document.getElementById('force-theme-style');
      if (existing) existing.remove();
      document.documentElement.classList.remove('force-light', 'force-dark');
      const style = document.createElement('style');
      style.id = 'force-theme-style';
      style.textContent = mode === 'light' ? lightStyles : darkStyles;
      document.head.appendChild(style);
      document.documentElement.classList.add(mode === 'light' ? 'force-light' : 'force-dark');
      try { localStorage.setItem('forceTheme', mode); } catch (e) { /* ignore */ }
    };

    apply(forceTheme);
  }, [forceTheme]);

  useEffect(() => {
    const prefersDark = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    const effectiveDark = forceTheme === 'dark';

    if (effectiveDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const root = document.getElementById('app-root');
    const bg = root ? window.getComputedStyle(root).backgroundColor : 'n/a';

    console.log('App: effectiveDark ->', effectiveDark, 'prefersDark =', prefersDark, 'forceTheme =', forceTheme);
    console.log('App: html.classList.contains("dark") =', document.documentElement.classList.contains('dark'), 'root backgroundColor =', bg);
  }, [forceTheme]);

  const renderPage = () => {
    switch (currentPage) {
      case "Tasks":
        return <Tasks searchTerm={searchTerm} />;
      case "Completed":
        return <Completed searchTerm={searchTerm} />;
      default:
        return (
          <Dashboard
            showModal={showModal}
            setShowModal={setShowModal}
            searchTerm={searchTerm}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <div className="dark:bg-gray-900">
        <Login onLogin={() => setIsAuthenticated(true)} />
        <div className="fixed bottom-4 left-4">
          <Button size="sm" variant="ghost" className="underline dark:text-white" onClick={() => setAuthMode('register')}>Create an account</Button>
        </div>
      </div>
    ) : (
      <div className="dark:bg-gray-900">
        <Register onRegister={() => setIsAuthenticated(true)} />
        <div className="fixed bottom-4 left-4">
          <Button size="sm" variant="ghost" className="underline dark:text-white" onClick={() => setAuthMode('login')}>Have an account? Login</Button>
        </div>
      </div>
    );
  }

  function DebugHUD({ effectiveDark, forceTheme }: { effectiveDark: boolean; forceTheme: 'light'|'dark' }) {
    const [htmlClass, setHtmlClass] = useState(document.documentElement.className || '');
    const [prefersDark, setPrefersDark] = useState(false);
    const [rootBg, setRootBg] = useState('');
    // Hidden by default to avoid showing the dev HUD to everyone — click 'Show HUD' to open
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      const update = () => {
        setHtmlClass(document.documentElement.className || '');
        setPrefersDark(!!(m && m.matches));
        const root = document.getElementById('app-root');
        setRootBg(root ? window.getComputedStyle(root).backgroundColor : 'n/a');
      };

      update();
      const interval = setInterval(update, 400); // keep it fresh while debugging
      m && m.addEventListener && m.addEventListener('change', update);
      return () => { clearInterval(interval); m && m.removeEventListener && m.removeEventListener('change', update); };
    }, [effectiveDark]);

    const [verifyResults, setVerifyResults] = useState<{ selector: string; ok: boolean; msg: string }[] | null>(null);

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const parseBrightness = (cssColor: string): number | null => {
      if (!cssColor) return null;
      cssColor = cssColor.trim();
      if (cssColor.startsWith('rgb')) {
        const nums = cssColor.replace(/rgba?\(/, '').replace(/\)/, '').split(',').map(s => parseFloat(s));
        if (nums.length >= 3 && !nums.some(isNaN)) {
          const [r, g, b] = nums;
          // quick luminance approximation
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }
      }
      if (cssColor.startsWith('oklch')) {
        // oklch(L C H) -> take L as brightness (0..1) and scale to 0..255 range
        const match = cssColor.match(/oklch\(([^\s]+) /);
        if (match) {
          const L = parseFloat(match[1]);
          if (!isNaN(L)) return L * 255;
        }
      }
      // fallback: return null which means we can't decide
      return null;
    };

    const verifyThemes = async () => {
      const selectors = ['#app-root', '.rounded-2xl', '.bg-white', '.bg-gray-50', '.bg-gradient-to-r', '.bg-gray-900'];
      const original = forceTheme;
      const results: { selector: string; ok: boolean; msg: string }[] = [];

      // set light
      setVerifyResults(null);
      setForceTheme('light');
      await sleep(500);

      const lightData: Record<string, { bg: string; fg: string; b: number | null } | null> = {};
      selectors.forEach((sel) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (!el) { lightData[sel] = null; return; }
        const cs = getComputedStyle(el);
        const bg = cs.backgroundColor || cs.getPropertyValue('background-color');
        const fg = cs.color || cs.getPropertyValue('color');
        const b = parseBrightness(bg);
        lightData[sel] = { bg, fg, b };
      });

      // set dark
      setForceTheme('dark');
      await sleep(500);

      const darkData: Record<string, { bg: string; fg: string; b: number | null } | null> = {};
      selectors.forEach((sel) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (!el) { darkData[sel] = null; return; }
        const cs = getComputedStyle(el);
        const bg = cs.backgroundColor || cs.getPropertyValue('background-color');
        const fg = cs.color || cs.getPropertyValue('color');
        const b = parseBrightness(bg);
        darkData[sel] = { bg, fg, b };
      });

      // evaluate
      selectors.forEach((sel) => {
        const L = lightData[sel];
        const D = darkData[sel];
        if (!L || !D) {
          results.push({ selector: sel, ok: false, msg: 'element not found' });
          return;
        }
        if (L.bg === D.bg && L.fg === D.fg) {
          results.push({ selector: sel, ok: false, msg: `colors identical (${L.bg})` });
          return;
        }
        if (L.b !== null && D.b !== null) {
          if (L.b <= D.b) {
            results.push({ selector: sel, ok: false, msg: `bg not lighter in light mode (light=${L.b.toFixed(1)} dark=${D.b.toFixed(1)})` });
            return;
          }
        }
        results.push({ selector: sel, ok: true, msg: `ok (light=${L.bg}, dark=${D.bg})` });
      });

      // restore original
      setForceTheme(original);
      setVerifyResults(results);
    };

    if (!visible) return (
      <div className="fixed z-50 right-4 bottom-4 text-xs p-1">
        <Button size="sm" variant="secondary" onClick={() => { setVisible(true); localStorage.removeItem('debugHUDHidden'); }}>Show HUD</Button>
      </div>
    );

    return (
      <div className="fixed z-50 right-4 bottom-4 bg-black/70 text-white text-xs p-2 rounded-md pointer-events-auto select-none">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <div><strong>html.class:</strong> <span>{htmlClass || '<none>'}</span></div>
            <div><strong>prefers-dark:</strong> <span>{prefersDark ? 'yes' : 'no'}</span></div>
            <div><strong>root-bg:</strong> <span>{rootBg}</span></div>
            <div><strong>effectiveDark:</strong> <span>{effectiveDark ? 'true' : 'false'}</span></div>
            <div><strong>forceTheme:</strong> <span>{forceTheme}</span></div>
          </div>
          <div className="flex-shrink-0">
            <Button size="sm" variant="ghost" className="text-[12px] text-white/70 rounded px-1 hover:text-white" onClick={() => { setVisible(false); localStorage.setItem('debugHUDHidden', 'true'); }} aria-label="Close">✕</Button>
          </div>
        </div>

        <div className="mt-1 text-[10px] opacity-80">NOTE: macOS/browser can force dark mode — use the Force selector to override (dev-only).</div>
        <div className="mt-2">
          <Button size="sm" variant="primary" className="px-2 py-1 text-[11px]" onClick={verifyThemes}>Verify themes</Button>
        </div>
        {verifyResults && (
          <div className="mt-2 text-left">
            <div className="text-[11px] font-semibold">Verification</div>
            <ul className="list-disc ml-4 text-[11px] mt-1">
              {verifyResults.map((r) => (
                <li key={r.selector} className={r.ok ? 'text-green-400' : 'text-red-400'}>{r.selector}: {r.msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const prefersDark = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  const effectiveDark = forceTheme === 'dark' ? true : forceTheme === 'light' ? false : prefersDark;

  return (
    <div id="app-root" className="flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          setShowModal={setShowModal}
          onSearch={setSearchTerm}
          forceTheme={forceTheme}
          setForceTheme={setForceTheme}
        />
        <div className="flex-1 overflow-auto dark:bg-gray-900">
          {renderPage()}
        </div>
      </div>

      {/* Debug HUD - visible only in development to help diagnose dark mode issues */}
      {import.meta.env.DEV && (
        <DebugHUD effectiveDark={effectiveDark} forceTheme={forceTheme} />
      )}
    </div>
  );
}
