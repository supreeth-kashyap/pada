# myapp

This is a React design system built with Vite. It includes a set of reusable components and a demo application to showcase them.

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

To start the development server, run:

```bash
npm run dev
```

This will open the demo application in your browser.

## Components

This design system includes the following components:

*   **Button**: A customizable button component with different variants and sizes.
*   **Input**: A form input field with support for labels, descriptions, and error messages.
*   **Checkbox**: A checkbox component.
*   **RadioGroup**: A group of radio buttons.
*   **Switch**: A toggle switch component.
*   **Modal**: A modal dialog that can be opened and closed.
*   **Tabs**: A tabbed navigation component.
*   **Select**: A dropdown select component.
*   **Tooltip**: A tooltip that appears when hovering over an element.

### Examples

Here are some examples of how to use the components:

```jsx
import React from 'react';
import { Button } from './components/Button';
import { Input } from './components/Input';

const App = () => (
  <div>
    <Button>Click me</Button>
    <Input label="Name" placeholder="Enter your name" />
  </div>
);
```
