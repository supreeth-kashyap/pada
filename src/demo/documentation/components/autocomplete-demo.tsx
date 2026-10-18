import { useState } from 'react';
import DemoPage from '../DemoPage';
import { CodeSnippet } from '../../../components/CodeSnippet/CodeSnippet';
import { Autocomplete, type AutocompleteOption } from '../../../components/Autocomplete';

const list = { margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 } as const;

const PEOPLE: AutocompleteOption[] = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Engineering' },
  { value: 'grace', label: 'Grace Hopper', description: 'Platform' },
  { value: 'alan', label: 'Alan Turing', description: 'Research' },
  { value: 'edsger', label: 'Edsger Dijkstra', description: 'Research' },
  { value: 'barbara', label: 'Barbara Liskov', description: 'Architecture' },
  { value: 'margaret', label: 'Margaret Hamilton', description: 'Flight software' },
];

const COUNTRIES: AutocompleteOption[] = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Denmark', 'Germany', 'India', 'Japan', 'Kenya', 'Mexico', 'Norway', 'Portugal', 'Spain', 'Sweden'].map((name) => ({ value: name.toLowerCase(), label: name }));

export default function AutocompleteDemo() {
  const [country, setCountry] = useState<string | null>('india');
  const [reviewers, setReviewers] = useState<string[]>(['ada', 'grace']);
  return (
    <DemoPage
      title="Autocomplete"
      kind="Component"
      purpose={<p>Autocomplete is a text field with suggestions: people type to narrow a long list, then pick. Use it when there are too many options to scan (people, countries, tags). For a handful of options, a Select or radio group is quicker.</p>}
      design={
        <>
          <p>Single selection fills the field. With <code>multiple</code>, picks become removable chips and the list stays open for the next one.</p>
          <div className="demo-page__showcase" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ width: 280 }}>
              <Autocomplete label="Country" options={COUNTRIES} value={country} onValueChange={setCountry} placeholder="Start typing…" description="Used for tax and invoices." />
            </div>
            <div style={{ width: 320 }}>
              <Autocomplete label="Reviewers" options={PEOPLE} multiple value={reviewers} onValueChange={setReviewers} placeholder="Add a reviewer" emptyMessage="No one by that name" />
            </div>
            <div style={{ width: 280 }}>
              <Autocomplete label="Owner" options={PEOPLE} required error="Choose who owns this project." placeholder="Search people" />
            </div>
          </div>
        </>
      }
      developer={
        <CodeSnippet
          code={`import { Autocomplete } from 'pada-ds';

<Autocomplete label="Country" options={countries} value={country} onValueChange={setCountry} />

<Autocomplete label="Reviewers" options={people} multiple value={ids} onValueChange={setIds} />

// Server-side search: turn off filtering and load options yourself
<Autocomplete
  label="Repository"
  options={results}
  filter={false}
  onInputValueChange={(text) => search(text)}
/>

// Behaviour only
import { Combobox } from 'pada-ds/headless';`}
          language="tsx"
          label="Autocomplete usage"
        />
      }
      accessibility={
        <ul style={list}>
          <li>Follows the WAI-ARIA combobox pattern with a listbox popup: the input keeps focus and <code>aria-activedescendant</code> points at the highlighted option.</li>
          <li>ArrowDown opens the list; arrows move, Enter picks, Escape closes the list, and a second Escape clears the text.</li>
          <li>In multiple mode, Backspace in the empty input removes the last chip, and each chip has its own labelled remove button.</li>
          <li>The label, description and error are linked to the input, and the error is announced when it appears.</li>
        </ul>
      }
    />
  );
}
