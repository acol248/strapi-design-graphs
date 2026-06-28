import { createContext, useContext, useId, forwardRef } from 'react';
import { Box } from '@strapi/design-system';
import { ResponsiveContainer } from 'recharts';

// Types
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type GraphConfig = Record<string, { label: ReactNode; color?: string }>;

interface GraphContextProps {
  config: GraphConfig;
}

const GraphContext = createContext<GraphContextProps | undefined>(undefined);

export const useGraph = (): GraphContextProps => {
  const context = useContext(GraphContext);

  if (!context) throw new Error('useGraph must be used within a GraphContainer');

  return context;
};

export interface GraphContainerProps extends Omit<ComponentPropsWithoutRef<typeof Box>, 'children' | 'style'> {
  config: GraphConfig;
  children: React.ReactNode;
  aspectRatio?: number;
  style?: React.CSSProperties;
}

export const GraphContainer: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<GraphContainerProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, GraphContainerProps>(({ config, children, aspectRatio = 16 / 9, ...props }, ref) => {
  const uniqueId = useId();

  const styleVariables = Object.entries(config).reduce<React.CSSProperties>((acc, [key, value]: [string, any]) => {
    if (value.color) acc[`--color-${key}` as keyof React.CSSProperties] = value.color;

    return acc;
  }, {});

  return (
    <GraphContext.Provider value={{ config }}>
      <Box ref={ref} id={uniqueId} style={{ ...styleVariables, ...props.style }} width="100%" {...props}>
        <ResponsiveContainer width="100%" aspect={aspectRatio}>
          {children}
        </ResponsiveContainer>
      </Box>
    </GraphContext.Provider>
  );
});

GraphContainer.displayName = 'GraphContainer';
