// Dompet Keluarga — hand-in program (Node 22, standard library only).
// It takes the finished site (app/) and its screenshots (screenshots/) from
// beside this file, copies both into the grader's output directory, and
// writes dossier.json there with make.fun's vendored dossier library. The
// dossier is the judge's view of the entry: the screenshots, the first-load
// files and bytes, and the site's own source. Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from clean output children so a stale file can never leak in.
// NOTE: never rmSync(outDir) itself — in the grader /output is a mount
// point, and removing a mount point throws EBUSY (run_completes exit 1).
// Only its children are removed; the directory itself is left alone.
// Verified 27 Nov 2026: exit 0 on Node v22.18.0 as uid 65534 with /output
// bind-mounted (grader-like), run 1 and run 2 byte-identical dossier.json
// (525206 bytes, sha256 828dcdd923aa5ea64f2b6b07d546c0dbadcc6e22dcec67a9aa7a1fafc78ea669).
rmSync(join(outDir, 'app'), { recursive: true, force: true });
rmSync(join(outDir, 'screenshots'), { recursive: true, force: true });
rmSync(join(outDir, 'dossier.json'), { force: true });
mkdirSync(join(outDir, 'app'), { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });

mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log('handed in app/ + screenshots/ + dossier.json to ' + outDir);
