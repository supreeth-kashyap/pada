import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { AspectRatio } from '../../../components/AspectRatio';
import { Container } from '../../../components/Container';
import { Grid } from '../../../components/Grid';
import { Stack } from '../../../components/Stack';

const tile = {
  display: 'grid',
  placeItems: 'center',
  minHeight: 64,
  borderRadius: 'var(--pada-radius-lg)',
  background: 'var(--pada-color-accent-subtle)',
  color: 'var(--pada-color-accent-fg)',
  fontWeight: 600,
} as const;
const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function LayoutDemo() {
  return (
    <DemoPage
      title="Layout"
      kind="Foundation"
      purpose={<p>Four primitives cover most page layout: Stack for rows and columns, Grid for two-dimensional arrangements, Container for a readable page width, and AspectRatio for media. Their gaps come from the spacing tokens, so layouts tighten and loosen with density.</p>}
      design={
        <>
          <p><strong>Grid with <code>minItemWidth</code></strong> fits as many columns as there is room for. Resize the window to watch it reflow without breakpoints.</p>
          <div className="demo-page__showcase" style={{ display: 'block' }}>
            <Grid minItemWidth="140px" gap={3}>
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} style={tile}>{index + 1}</div>
              ))}
            </Grid>
          </div>
          <p><strong>Stack</strong> lays items in a row or column with token gaps; <strong>Container</strong> centres content at a breakpoint width with growing gutters.</p>
          <div className="demo-page__showcase" style={{ display: 'block' }}>
            <Container size="sm" style={{ background: 'var(--pada-color-surface)', borderRadius: 'var(--pada-radius-lg)', paddingBlock: 16 }}>
              <Stack direction="row" gap={2} justify="between" align="center">
                <div style={{ ...tile, minHeight: 40, paddingInline: 16 }}>Container size="sm"</div>
                <Stack direction="row" gap={2}>
                  <div style={{ ...tile, minHeight: 40, width: 40 }}>A</div>
                  <div style={{ ...tile, minHeight: 40, width: 40 }}>B</div>
                </Stack>
              </Stack>
            </Container>
          </div>
          <p><strong>AspectRatio</strong> keeps media at a fixed shape and crops what is inside to fit.</p>
          <div className="demo-page__showcase" style={{ display: 'block' }}>
            <Grid columns={3} gap={3}>
              {[16 / 9, 4 / 3, 1].map((ratio) => (
                <AspectRatio key={ratio} ratio={ratio} style={{ borderRadius: 'var(--pada-radius-lg)', background: 'linear-gradient(135deg, var(--pada-color-accent-subtle), var(--pada-color-info-subtle))' }}>
                  <div style={{ ...tile, background: 'none', height: '100%' }}>{ratio === 1 ? '1 : 1' : ratio > 1.5 ? '16 : 9' : '4 : 3'}</div>
                </AspectRatio>
              ))}
            </Grid>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { AspectRatio, Container, Grid, Stack } from 'pada-ds';

<Container as="main" size="lg">
  <Stack gap={6}>
    <PageHeader title="Projects" />
    <Grid minItemWidth="16rem" gap={4} as="ul">
      {projects.map((project) => (
        <li key={project.id}>
          <AspectRatio ratio={16 / 9}><img src={project.cover} alt="" /></AspectRatio>
          …
        </li>
      ))}
    </Grid>
  </Stack>
</Container>`}
          language="tsx"
          label="Layout usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>The primitives add no roles; use <code>as</code> to render the right element (<code>main</code>, <code>section</code>, <code>ul</code>) so structure stays meaningful.</li>
          <li>Visual order follows DOM order; avoid reordering with CSS so keyboard and reading order match.</li>
        </ul>
      }
    />
  );
}
