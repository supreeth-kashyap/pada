---
name: BrandLogo
category: Display
summary: A third-party brand logo (Slack, GitHub, …) by name.
react: BrandLogo
angular: ds-brand-logo
reactDir: Logo
angularDir: brand-logo
related: Avatar, PadaLogo, Icon
---
## Overview

BrandLogo renders a logo from Pada's library of third-party brands by name: integrations,
connected accounts, sign-in providers. It has sizes, an optional background tile and a tooltip. In
Angular, serve the logo images from your app (or point `provideBrandLogoUrl` elsewhere).

## When to use

- In integration lists, connected accounts and import sources.

## When not to use

- For Pada's own logo: use **PadaLogo**.
- For people: use **Avatar**.

## Best practices

### Do

- Pair the logo with the brand's name in text.
- Use the background tile when logos sit on varied surfaces.

### Don't

- Don't recolour or distort brand logos.

## Accessibility

- Decorative when the name is next to it; otherwise give it a text alternative.

## Use with AI

```text
With Pada, list our integrations (Slack, GitHub, Jira) as rows with a BrandLogo (size lg, with
background), the name and a Switch to connect each.
```
