import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from './Accordion';

export * from './Accordion';

/**
 * Headless accordion: one or many collapsible sections, arrow keys between headers.
 *
 * ```tsx
 * <Accordion.Root type="single" collapsible defaultValue="install">
 *   <Accordion.Item value="install">
 *     <Accordion.Header>
 *       <Accordion.Trigger>How do I install it?</Accordion.Trigger>
 *     </Accordion.Header>
 *     <Accordion.Content>npm install pada-ds</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion.Root>
 * ```
 */
export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
