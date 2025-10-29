# Design System Blueprint

## Introduction

This document outlines the structure and purpose of our design system. The goal is to create a consistent, reusable, and maintainable set of components and styles for our applications.

## Token Pipeline

Our design system uses a token-based approach to manage styles. The pipeline consists of three layers:

1.  **Primitives**: These are the raw, non-contextual style values. They are defined in `src/styles/primitives.css` and are generated from the Tailwind CSS v3 theme.

2.  **Global Tokens**: These are semantic, contextual style values that are derived from the primitives. They are defined in `src/styles/global.css` and are used to style the application. This layer also includes light and dark theme definitions.

3.  **Components**: Components use the global tokens to style themselves. Components should never import or use primitives directly.

## Folder Structure

-   `src/styles`: Contains the CSS files for the design system.
    -   `primitives.css`: Raw style values (Tailwind v3 tokens).
    -   `global.css`: Semantic style values and theme definitions.
-   `src/docs`: Contains documentation for the design system.
    -   `blueprint.md`: This file.
    -   `tokens-map.json`: A map of semantic tokens to their primitive counterparts.
-   `src/demo`: Contains the demo application for showcasing the design system.
-   `scripts`: Contains scripts for automating design system tasks, such as generating tokens.

## Accessibility & Review Checklist

(Placeholder for accessibility guidelines and review checklists.)
