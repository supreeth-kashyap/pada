import { currentComponents, docs } from '../lib/docs';

export function StatsStrip() {
  const stats = [
    { value: String(currentComponents.length), label: 'components' },
    { value: '2', label: 'frameworks, one API' },
    { value: '7', label: 'theme attributes' },
    { value: '22', label: 'accent palettes' },
    { value: String(docs.categories.length - 1), label: 'categories' },
  ];
  return (
    <section className="stats-strip" aria-label="Pada in numbers">
      <div className="wrap">
        <ul>
          {stats.map((stat) => (
            <li key={stat.label} data-reveal>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
