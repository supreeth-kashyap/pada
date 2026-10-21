import { Link as RouterLink } from 'react-router-dom';
import { EmptyState } from 'pada-ds';
import { ROUTES } from '../lib/paths';

export function NotFoundPage() {
  return (
    <main id="main" className="page not-found">
      <div className="wrap">
        <h1 className="visually-hidden">Page not found</h1>
        <EmptyState
          media="find_more"
          title="This page took a wrong step"
          description="The page you're looking for doesn't exist or has moved."
          headingLevel={2}
          actions={
            <>
              <RouterLink className="cta" to="/">Go home</RouterLink>
              <RouterLink className="cta" data-variant="ghost" to={ROUTES.components}>Browse components</RouterLink>
            </>
          }
        />
      </div>
    </main>
  );
}
