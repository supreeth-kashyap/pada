import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from './Tabs';

export * from './Tabs';

/**
 * Headless tabs (WAI-ARIA APG Tabs): roving focus, arrow keys along the orientation, Home/End,
 * automatic or manual activation, and an optional indicator that tracks the selected tab.
 *
 * ```tsx
 * <Tabs.Root defaultValue="overview">
 *   <Tabs.List aria-label="Project">
 *     <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
 *     <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
 *     <Tabs.Indicator />
 *   </Tabs.List>
 *   <Tabs.Content value="overview">…</Tabs.Content>
 *   <Tabs.Content value="activity">…</Tabs.Content>
 * </Tabs.Root>
 * ```
 */
export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Indicator: TabsIndicator,
};
