import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Box, Typography, Flex } from '@strapi/design-system';

import { useGraph } from './GraphContainer';

export interface ChartTooltipContentProps extends TooltipProps<ValueType, NameType> {
  hideLabel?: boolean;
  label: string | number;
  payload: Array<{
    name: string;
    value: ValueType;
    dataKey: string | number;
    color?: string;
  }>;
}

export const ChartTooltipContent = ({ active, payload, label, hideLabel = false }: ChartTooltipContentProps) => {
  const { config } = useGraph();

  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <Box background="neutral0" padding={3} hasRadius shadow="filterShadow" borderColor="neutral150">
      {!hideLabel && (
        <Box paddingBottom={2}>
          <Typography variant="pi" fontWeight="bold" textColor="neutral800">
            {label}
          </Typography>
        </Box>
      )}
      <Flex direction="column" alignItems="start" gap={1}>
        {payload.map((item) => {
          const key = item.dataKey as string;
          const configItem = config[key];
          const indicatorColor = item.color || (configItem?.color ? `var(--color-${key})` : 'currentColor');

          return (
            <Flex key={key} gap={2} alignItems="center">
              <Box width="8px" height="8px" hasRadius style={{ backgroundColor: indicatorColor }} />
              <Typography variant="omega" textColor="neutral600">
                {configItem?.label || item.name}:
              </Typography>
              <Typography variant="omega" fontWeight="bold" textColor="neutral900">
                {item.value}
              </Typography>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};

ChartTooltipContent.displayName = 'ChartTooltipContent';
