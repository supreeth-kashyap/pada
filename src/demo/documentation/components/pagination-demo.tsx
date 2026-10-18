import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Pagination } from '../../../components/Pagination';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

export default function PaginationDemo() {
  const [page, setPage] = useState(6);
  const [small, setSmall] = useState(2);
  return (
    <DemoPage
      title="Pagination"
      kind="Component"
      purpose={<p>Pagination splits a long list or table into pages and lets people move between them. Use it when position matters (search results people come back to, audit logs); for a feed people only scroll, load more as they reach the end.</p>}
      design={
        <>
          <p>Previous and next buttons around page numbers. Distant pages collapse into ellipses; <code>siblingCount</code> and <code>boundaryCount</code> decide how many numbers stay visible.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
            <Pagination page={page} totalPages={20} onPageChange={setPage} />
            <Pagination page={page} totalPages={20} onPageChange={setPage} siblingCount={2} boundaryCount={2} label="Results (wide)" />
            <Pagination page={small} totalPages={4} onPageChange={setSmall} label="Comments" />
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Pagination } from 'pada-ds';

<Pagination page={page} totalPages={Math.ceil(total / pageSize)} onPageChange={setPage} />`}
          language="tsx"
          label="Pagination usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>A <code>nav</code> landmark named “Pagination” (set <code>label</code> when a page has more than one).</li>
          <li>Page buttons are labelled “Page 7”; the current page has <code>aria-current="page"</code>. Previous and next are disabled at the ends.</li>
          <li>After changing page, move focus to the top of the new results (or announce them), so keyboard users don’t have to Tab back up.</li>
        </ul>
      }
    />
  );
}
