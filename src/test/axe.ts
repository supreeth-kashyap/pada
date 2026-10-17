import axe from 'axe-core';

/**
 * Runs axe on `container` and returns the violations as readable strings, so a test can
 * `expect(await axeViolations(document.body)).toEqual([])`. Colour contrast is skipped
 * because jsdom does not compute styles.
 */
export async function axeViolations(container: Element = document.body): Promise<string[]> {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help} (${violation.nodes.map((node) => node.target.join(' ')).join(', ')})`,
  );
}
