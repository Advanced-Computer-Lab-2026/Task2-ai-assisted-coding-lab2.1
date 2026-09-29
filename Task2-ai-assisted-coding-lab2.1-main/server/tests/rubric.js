// Functional grading rubric: each check is reported on its own, so a grade is a
// breakdown rather than a single number. Every graded test in grade.test.js is
// registered through graded(), which records PASS/FAIL for the final report.
// The GRADE_BREAKDOWN line is read by the grading workflow; keep its format.

export const RUBRIC = [
  ['model_fields', 'Model fields'],
  ['model_rules', 'Model rules'],
  ['unique_index', 'Timestamps and unique index'],
  ['create', 'Create'],
  ['list', 'List'],
  ['get_one', 'Get one'],
  ['summary', 'Summary aggregation'],
  ['summary_query', 'Summary query and routing']
];

export const TOTAL_CHECKS = RUBRIC.length;

const results = new Map();

export function graded(key, fn) {
  const entry = RUBRIC.find(([k]) => k === key);
  if (!entry) throw new Error(`Unknown rubric item ${key}`);
  test(`[check] ${entry[1]}`, async () => {
    results.set(key, false);
    await fn();
    results.set(key, true);
  });
}

export function printReport() {
  const breakdown = Object.fromEntries(RUBRIC.map(([key]) => [key, results.get(key) === true ? 1 : 0]));
  const lines = RUBRIC.map(([key, name]) => `${breakdown[key] ? 'PASS' : 'FAIL'} [check] ${name}`);
  const passed = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  lines.push('', `Functional grade: ${passed}/${TOTAL_CHECKS}`, `GRADE_BREAKDOWN ${JSON.stringify(breakdown)}`);
  process.stdout.write(`\n${lines.join('\n')}\n\n`);
  return passed;
}
