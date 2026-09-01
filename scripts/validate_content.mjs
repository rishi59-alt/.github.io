import { Chess } from '/app/frontend/node_modules/chess.js/dist/esm/chess.js';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('/app/backend/content_seed.json', 'utf8'));
let errors = 0;
let checks = 0;

function ok(cond, msg) {
  checks++;
  if (!cond) { errors++; console.log('  ❌ ' + msg); }
}

console.log('=== OPENINGS (move sequences legal) ===');
for (const o of data.openings) {
  const g = new Chess();
  let failedAt = -1;
  for (let i = 0; i < o.moves.length; i++) {
    try {
      const m = g.move(o.moves[i]);
      if (!m) { failedAt = i; break; }
    } catch (e) { failedAt = i; break; }
  }
  if (failedAt >= 0) { errors++; console.log(`  ❌ ${o.name}: illegal move '${o.moves[failedAt]}' at index ${failedAt}`); }
  else console.log(`  ✅ ${o.name} (${o.moves.length} plies)`);
}

console.log('\n=== LESSONS (move steps legal + annotations) ===');
for (const l of data.lessons) {
  for (let s = 0; s < l.steps.length; s++) {
    const step = l.steps[s];
    // validate FEN loads
    let g;
    try { g = new Chess(step.fen); } catch (e) { errors++; console.log(`  ❌ ${l.id} step ${s}: bad FEN`); continue; }
    if (step.type === 'move') {
      let anyLegal = false;
      for (const exp of step.expected) {
        const gg = new Chess(step.fen);
        try {
          const m = gg.move(exp);
          if (m) {
            anyLegal = true;
            if (exp.includes('#')) ok(gg.isCheckmate(), `${l.id} step ${s}: '${exp}' annotated # but not checkmate`);
            if (exp.includes('+') && !exp.includes('#')) ok(gg.inCheck(), `${l.id} step ${s}: '${exp}' annotated + but not check`);
          }
        } catch (e) { /* illegal */ }
      }
      ok(anyLegal, `${l.id} step ${s}: none of expected ${JSON.stringify(step.expected)} are legal from FEN`);
      if (anyLegal) console.log(`  ✅ ${l.id} step ${s}: ${JSON.stringify(step.expected)}`);
    }
  }
}

console.log('\n=== TACTICS (solution + accept legal, annotations, side to move) ===');
for (const t of data.tactics) {
  let g;
  try { g = new Chess(t.fen); } catch (e) { errors++; console.log(`  ❌ ${t.id}: bad FEN`); continue; }
  ok(g.turn() === (t.side_to_move === 'white' ? 'w' : 'b'), `${t.id}: side_to_move mismatch (fen turn=${g.turn()})`);
  // main solution line applied in order
  const line = new Chess(t.fen);
  let lineOk = true;
  for (const mv of t.solution) {
    try { const m = line.move(mv); if (!m) { lineOk = false; break; } }
    catch (e) { lineOk = false; break; }
  }
  ok(lineOk, `${t.id}: solution line ${JSON.stringify(t.solution)} not fully legal`);
  // annotation check on first move
  const first = t.solution[0];
  const gg = new Chess(t.fen);
  try {
    gg.move(first);
    if (first.includes('#')) ok(gg.isCheckmate(), `${t.id}: '${first}' annotated # but not checkmate`);
    else if (first.includes('+')) ok(gg.inCheck(), `${t.id}: '${first}' annotated + but not check`);
  } catch (e) {}
  // accept alternatives legal from start fen
  for (const a of (t.accept || [])) {
    const ga = new Chess(t.fen);
    let good = false;
    try { good = !!ga.move(a); } catch (e) {}
    ok(good, `${t.id}: accept move '${a}' not legal`);
  }
  if (lineOk) console.log(`  ✅ ${t.id} [${t.theme}]: ${JSON.stringify(t.solution)}${(t.accept&&t.accept.length)?' accept '+JSON.stringify(t.accept):''}`);
}

console.log(`\n=== RESULT: ${errors} error(s) across ${checks} assertions ===`);
process.exit(errors > 0 ? 1 : 0);
