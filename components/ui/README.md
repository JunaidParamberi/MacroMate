# Fitness App UI Component Library

A comprehensive set of reusable UI components built on the Fitness App Design System. All components are fully typed with TypeScript and follow the design system specifications.

## Table of Contents

- [Installation](#installation)
- [Layout Components](#layout-components)
  - [SafeArea](#safearea)
  - [Screen](#screen)
- [Loading Components](#loading-components)
  - [Skeleton](#skeleton)
  - [Loader](#loader)
- [Core Components](#core-components)
  - [Button](#button)
  - [Typography](#typography)
  - [Card](#card)
  - [ListRow](#listrow)
  - [Icon](#icon)
- [Data Visualization](#data-visualization)
  - [AreaChart](#areachart)
  - [SegmentRing](#segmentring)
  - [ProgressBar](#progressbar)
- [Data Display](#data-display)
  - [DataToken](#datatoken)
  - [Stats](#stats)
  - [Label](#label)
  - [MetricCard](#metriccard)
- [Layout Utilities](#layout-utilities)
  - [Grid](#grid)
  - [Spacer](#spacer)
  - [Flex](#flex)
  - [Container](#container)

## Installation

```tsx
import { 
  // Layout
  SafeArea, Screen, ScreenHeader, ScreenContent, ScreenFooter,
  
  // Loading
  Skeleton, TextSkeleton, CardSkeleton, ListRowSkeleton,
  Spinner, Pulse, Dots, FullScreenLoader, InlineLoader,
  
  // Components
  Button, IconButton, IconOnlyButton, BackButton, CloseButton,
  Typography, Card, MasterCard, MetricCard, ListRow, Icon,
  
  // Charts
  AreaChart, SegmentRing, ProgressBar,
  
  // Data Display
  DataToken, Stats, Label, MetricCardComponent,
  
  // Layout
  Grid, GridItem, Spacer, Flex, Container
} from '@/components/ui';
```

## Layout Components

### SafeArea

A wrapper component that handles safe area insets for notches, status bars, and home indicators.

```tsx
<SafeArea edges={['top', 'bottom']} backgroundColor="#FFFFFF">
  <Typography variant="h2">Safe content</Typography>
</SafeArea>
```

**Props:**
- `children` (ReactNode): Content to render
- `edges` (string[]): Which edges to apply safe area padding
- `backgroundColor` (string): Background color
- `style` (ViewStyle): Additional styles

---

### Screen

Complete screen layout component with optional scrolling and consistent structure.

```tsx
<Screen scrollable={true}>
  <ScreenHeader title="Fitness App" />
  <ScreenContent padding="md">
    <Typography variant="h1">Welcome!</Typography>
  </ScreenContent>
</Screen>
```

**Props:**
- `children` (ReactNode): Screen content
- `scrollable` (boolean): Enable scrolling (default: true)
- `backgroundColor` (string): Background color
- `safeAreaEdges` (string[]): Safe area edges
- `showsVerticalScrollIndicator` (boolean): Scroll indicator visibility

**Screen Sub-Components:**
- `ScreenHeader`: Consistent header with left/center/right sections
- `ScreenContent`: Padded content area
- `ScreenFooter`: Fixed footer area

---

## Loading Components

### Skeleton

Skeleton loading components for various UI patterns with shimmer effects.

```tsx
// Basic Skeleton
<Skeleton width={100} height={20} />

// Text Skeleton
<TextSkeleton lines={3} width={['80%', '60%', '90%']} />

// Card Skeleton
<CardSkeleton showAvatar showTitle showSubtitle lines={2} />

// List Row Skeleton
<ListRowSkeleton showIcon showArrow />

// Stats Skeleton
<StatsSkeleton showIcon showChange />

// Chart Skeleton
<ChartSkeleton height={200} showGrid />

// Metric Card Skeleton
<MetricCardSkeleton />

// Complete Screen Skeleton
<ScreenSkeleton 
  showHeader 
  showCards={2} 
  showList={3} 
  showStats={2} 
/>
```

**Skeleton Variants:**
- `Skeleton`: Basic skeleton block
- `TextSkeleton`: Multi-line text placeholder
- `CardSkeleton`: Card with optional avatar and content
- `ListRowSkeleton`: List item with icon and arrow
- `ButtonSkeleton`: Button placeholder
- `StatsSkeleton`: Stats display with trend
- `ChartSkeleton`: Chart area with grid
- `MetricCardSkeleton`: Complete metric card
- `ScreenSkeleton`: Full screen layout skeleton

---

### Loader

Animated loading indicators with various styles.

```tsx
// Spinner Loader
<Spinner size={24} color="#13EC5B" strokeWidth={2} />

// Pulse Loader
<Pulse size={8} color="#13EC5B" count={3} />

// Dots Loader
<Dots size={8} color="#13EC5B" count={3} spacing={4} />

// Bar Loader
<Bar width={4} height={20} color="#13EC5B" count={5} />

// Circle Loader
<Circle size={40} color="#13EC5B" strokeWidth={3} />

// Full Screen Loader
<FullScreenLoader 
  visible={true}
  message="Loading your data..."
  loaderType="spinner"
/>

// Inline Loader
<InlineLoader 
  visible={true}
  size={16}
  type="dots"
/>
```

**Loader Types:**
- `Spinner`: Rotating circular loader
- `Pulse`: Pulsing dots animation
- `Dots`: Bouncing dots animation
- `Bar`: Equalizer-style bars
- `Circle`: Scaling circle animation
- `FullScreenLoader`: Overlay loader with message
- `InlineLoader`: Compact loader for inline use

---

## Core Components

### Button

Enhanced button component with loading states, icons, and multiple variants.

```tsx
// Basic Buttons
<Button title="Primary" onPress={() => {}} variant="primary" />
<Button title="Secondary" onPress={() => {}} variant="secondary" />

// Loading Button
<Button 
  title="Loading" 
  onPress={() => {}} 
  loading={true}
  loaderType="spinner"
/>

// Icon Buttons
<Button 
  title="With Icon"
  onPress={() => {}}
  icon={<Icon name="heart" library="ionicons" />}
  iconPosition="left"
/>

// Icon Only Button
<IconOnlyButton
  onPress={() => {}}
  icon={<Icon name="close" library="ionicons" />}
/>

// Pre-styled Icon Buttons
<BackButton onPress={() => navigation.goBack()} />
<CloseButton onPress={() => {}} />
<AddButton onPress={() => {}} />

// Button Sizes
<Button title="Small" size="small" onPress={() => {}} />
<Button title="Large" size="large" onPress={() => {}} />
```

**Props:**
- `title` (string): Button text (optional for icon-only)
- `onPress` (function): Press handler
- `variant` ('primary' | 'secondary' | 'icon' | 'iconOnly'): Button style
- `size` ('small' | 'medium' | 'large'): Button size
- `loading` (boolean): Show loading state
- `loaderType` ('spinner' | 'pulse' | 'dots'): Loader animation
- `loaderSize` (number): Loader size
- `icon` (ReactNode): Icon component
- `iconPosition` ('left' | 'right'): Icon placement
- `disabled` (boolean): Disable button
- `style` (ViewStyle): Additional styles

**Button Variants:**
- `Button`: Standard button with text and optional icon
- `IconButton`: Button with icon and text
- `IconOnlyButton`: Icon-only button
- `BackButton`: Pre-styled back button
- `CloseButton`: Pre-styled close button
- `AddButton`: Pre-styled add button

---

## Loading States Examples

### Complete Loading Screen

```tsx
export default function LoadingScreen() {
  return (
    <Screen>
      <ScreenContent padding="md">
        <ScreenSkeleton 
          showHeader
          showCards={2}
          showList={3}
          showStats={2}
        />
      </ScreenContent>
    </Screen>
  );
}
```

### Button with Loading State

```tsx
const [loading, setLoading] = React.useState(false);

const handleSave = async () => {
  setLoading(true);
  try {
    await saveData();
  } finally {
    setLoading(false);
  }
};

<Button 
  title="Save Workout"
  onPress={handleSave}
  loading={loading}
  loaderType="spinner"
  disabled={loading}
/>
```

### Card Loading State

```tsx
const [loading, setLoading] = React.useState(true);

return (
  <Card>
    {loading ? (
      <CardSkeleton showAvatar showTitle lines={2} />
    ) : (
      <>
        <Typography variant="h3">Workout Complete!</Typography>
        <Typography variant="bodyText">Great job today!</Typography>
      </>
    )}
  </Card>
);
```

---

This documentation provides comprehensive guidance for using all UI components in the Fitness App, including the new skeleton and loader components for better loading experiences. Each component is designed to be flexible, accessible, and consistent with the design system.
  ListRow,
  Icon,
  FitnessIcons,
  AreaChart,
  SegmentRing,
  ProgressBar,
  DataToken,
  Stats,
  Label,
  MetricCard as MetricCardComponent,
  Grid,
  GridItem,
  Spacer,
  Flex,
  Container
} from '@/components/ui';
```

## Core Components

### Button

A versatile button component with primary and secondary variants.

```tsx
// Primary Button
<Button 
  title="Start Workout" 
  onPress={() => console.log('Pressed')} 
  variant="primary"
/>

// Secondary Button
<Button 
  title="Cancel" 
  onPress={() => console.log('Pressed')} 
  variant="secondary"
/>

// Disabled Button
<Button 
  title="Disabled" 
  onPress={() => {}} 
  disabled
/>

// Loading Button
<Button 
  title="Loading..." 
  onPress={() => {}} 
  loading
/>
```

**Props:**
- `title` (string): Button text
- `onPress` (function): Press handler
- `variant` ('primary' | 'secondary'): Button style
- `disabled` (boolean): Disable button
- `loading` (boolean): Show loading state
- `style` (ViewStyle): Additional styles
- `textStyle` (TextStyle): Additional text styles

---

### Typography

Text component with predefined variants following the design system.

```tsx
// Headline Display
<Typography variant="headlineDisplay">Welcome to Fitness App</Typography>

// Body Text
<Typography variant="bodyText">Regular body text for descriptions</Typography>

// Meta Label
<Typography variant="metaLabel">Secondary information</Typography>

// Convenience Components
<HeadlineDisplay>Large Title</HeadlineDisplay>
<BodyText>Regular text</BodyText>
<MetaLabel>Meta info</MetaLabel>
<H1>Heading 1</H1>
<H2>Heading 2</H2>
<H3>Heading 3</H3>
<Caption>Caption text</Caption>
```

**Props:**
- `variant` (TypographyVariant): Text style variant
- `children` (ReactNode): Text content
- `color` (string): Custom text color
- `textAlign` ('auto' | 'left' | 'right' | 'center' | 'justify'): Text alignment
- `numberOfLines` (number): Maximum lines
- `style` (TextStyle): Additional styles

**Variants:**
- `headlineDisplay`: 32px, bold
- `bodyText`: 16px, normal
- `metaLabel`: 14px, muted
- `h1`: 28px, bold
- `h2`: 24px, bold
- `h3`: 20px, semibold
- `caption`: 12px, normal

---

### Card

Flexible card component with master and metric variants.

```tsx
// Basic Card
<Card>
  <Typography variant="bodyText">Card content</Typography>
</Card>

// Master Card
<MasterCard>
  <Typography variant="h3">Workout Session</Typography>
  <Typography variant="bodyText">Today's running routine</Typography>
</MasterCard>

// Metric Card
<MetricCard>
  <Typography variant="bodyText">Steps Today</Typography>
  <Typography variant="h2">8,432</Typography>
</MetricCard>

// Clickable Card
<Card onPress={() => console.log('Card pressed')}>
  <Typography variant="bodyText">Clickable card</Typography>
</Card>
```

**Props:**
- `variant` ('master' | 'metric'): Card style variant
- `children` (ReactNode): Card content
- `onPress` (function): Press handler (optional)
- `style` (ViewStyle): Additional styles

---

### ListRow

List item component with icon, text, and optional navigation.

```tsx
// Basic List Row
<ListRow 
  title="Profile Settings"
  subtitle="Manage your account"
  showArrow
  onPress={() => console.log('Pressed')}
/>

// List Row with Icon
<ListRow 
  title="Workout History"
  subtitle="View past activities"
  icon={<FitnessIcons.Running size={24} />}
  showArrow
  onPress={() => console.log('Pressed')}
/>

// List Row with Custom Right Component
<ListRow 
  title="Daily Steps"
  subtitle="Goal: 10,000"
  icon={<FitnessIcons.Trophy size={24} />}
  rightComponent={<Typography variant="caption">8,432</Typography>}
/>
```

**Props:**
- `title` (string): Main text
- `subtitle` (string): Secondary text (optional)
- `icon` (ReactNode): Left icon (optional)
- `showArrow` (boolean): Show right arrow
- `onPress` (function): Press handler (optional)
- `rightComponent` (ReactNode): Custom right component (optional)
- `style` (ViewStyle): Additional styles

---

### Icon

Comprehensive icon library with multiple icon sets and fitness-specific icons.

```tsx
// Basic Icon Usage
<Icon name="heart" library="ionicons" size={24} color="#13EC5B" />

// Fitness-Specific Icons
<FitnessIcons.Running size={24} color="#13EC5B" />
<FitnessIcons.Cycling size={24} color="#13EC5B" />
<FitnessIcons.Swimming size={24} color="#13EC5B" />
<FitnessIcons.Gym size={24} color="#13EC5B" />
<FitnessIcons.Yoga size={24} color="#13EC5B" />

// UI Icons
<FitnessIcons.Home size={24} />
<FitnessIcons.Profile size={24} />
<FitnessIcons.Settings size={24} />
<FitnessIcons.Chart size={24} />
<FitnessIcons.Trophy size={24} />
<FitnessIcons.Heart size={24} />
<FitnessIcons.Fire size={24} />
<FitnessIcons.Time size={24} />
<FitnessIcons.Calendar size={24} />
```

**Props:**
- `name` (string): Icon name
- `size` (number): Icon size (default: 24)
- `color` (string): Icon color
- `library` (IconLibrary): Icon library to use
- `style` (any): Additional styles

**Icon Libraries:**
- `ionicons`: Ionicons
- `material`: Material Icons
- `fontAwesome`: Font Awesome
- `fontAwesome5`: Font Awesome 5
- `antDesign`: Ant Design Icons
- `feather`: Feather Icons
- `simpleLine`: Simple Line Icons
- `entypo`: Entypo Icons

---

## Data Visualization

### AreaChart

Dynamic area chart component for showing trends over time.

```tsx
const workoutData = [
  { value: 30, label: 'Mon' },
  { value: 45, label: 'Tue' },
  { value: 35, label: 'Wed' },
  { value: 50, label: 'Thu' },
  { value: 40, label: 'Fri' },
];

<AreaChart 
  data={workoutData}
  height={200}
  color="#13EC5B"
  showGrid
  showLabels
/>
```

**Props:**
- `data` (ChartDataPoint[]): Chart data points
- `height` (number): Chart height (default: 200)
- `color` (string): Chart color
- `showGrid` (boolean): Show background grid
- `showLabels` (boolean): Show data labels
- `maxValue` (number): Maximum value for scaling
- `style` (any): Additional styles

---

### SegmentRing

Donut chart component for showing proportional data.

```tsx
const activityData = [
  { value: 45, label: 'Running', color: '#13EC5B' },
  { value: 30, label: 'Cycling', color: '#0D1B12' },
  { value: 25, label: 'Swimming', color: '#E6E7EB' },
];

<SegmentRing 
  data={activityData}
  size={200}
  strokeWidth={20}
  showLabels
  showPercentage
/>
```

**Props:**
- `data` (Array): Segment data with value, label, and color
- `size` (number): Ring diameter (default: 200)
- `strokeWidth` (number): Ring thickness (default: 20)
- `showLabels` (boolean): Show segment labels
- `showPercentage` (boolean): Show percentages
- `style` (any): Additional styles

---

### ProgressBar

Simple progress bar component.

```tsx
<ProgressBar 
  progress={0.75} // 75% progress
  height={8}
  color="#13EC5B"
  showPercentage
/>
```

**Props:**
- `progress` (number): Progress value (0-1)
- `height` (number): Bar height (default: 8)
- `color` (string): Progress bar color
- `backgroundColor` (string): Background color
- `showPercentage` (boolean): Show percentage text
- `style` (any): Additional styles

---

## Data Display

### DataToken

Small data display component with icon and value.

```tsx
<DataToken 
  value="8,432"
  label="Steps Today"
  icon={<FitnessIcons.Trophy size={20} />}
  color="#13EC5B"
  size="medium"
/>
```

**Props:**
- `value` (string | number): Data value
- `label` (string): Data label
- `icon` (ReactNode): Icon component (optional)
- `color` (string): Value color
- `size` ('small' | 'medium' | 'large'): Token size
- `style` (ViewStyle): Additional styles

---

### Stats

Large metric display component with trend indicators.

```tsx
<Stats 
  value="8,432"
  label="Daily Steps"
  change={12}
  changeLabel="vs yesterday"
  trend="up"
  icon={<FitnessIcons.Trophy size={24} />}
  color="#13EC5B"
/>
```

**Props:**
- `value` (string | number): Main metric value
- `label` (string): Metric label
- `change` (number): Percentage change
- `changeLabel` (string): Change description
- `trend` ('up' | 'down' | 'neutral'): Trend direction
- `icon` (ReactNode): Icon component (optional)
- `color` (string): Value color
- `style` (ViewStyle): Additional styles

---

### Label

Various label styles for categorization and tagging.

```tsx
// Badge Label
<Label 
  text="Active"
  variant="badge"
  color="#13EC5B"
  backgroundColor="#E8F5E8"
/>

// Pill Label
<Label 
  text="Premium"
  variant="pill"
  color="#FFFFFF"
  backgroundColor="#13EC5B"
/>

// Tag Label
<Label 
  text="New"
  variant="tag"
  color="#0D1B12"
  backgroundColor="#E6E7EB"
/>
```

**Props:**
- `text` (string): Label text
- `variant` ('default' | 'badge' | 'pill' | 'tag'): Label style
- `color` (string): Text color
- `backgroundColor` (string): Background color
- `size` ('small' | 'medium' | 'large'): Label size
- `style` (ViewStyle): Additional styles

---

### MetricCard

Complete metric card with progress and trends.

```tsx
<MetricCard 
  title="Daily Steps"
  value="8,432"
  subtitle="Goal: 10,000"
  icon={<FitnessIcons.Trophy size={24} />}
  progress={0.84}
  trend="up"
  change={12}
  color="#13EC5B"
/>
```

**Props:**
- `title` (string): Card title
- `value` (string | number): Main value
- `subtitle` (string): Subtitle (optional)
- `icon` (ReactNode): Icon component (optional)
- `progress` (number): Progress value (0-1)
- `trend` ('up' | 'down' | 'neutral'): Trend direction
- `change` (number): Percentage change
- `color` (string): Accent color
- `onPress` (function): Press handler (optional)
- `style` (ViewStyle): Additional styles

---

## Layout Components

### Grid

Responsive grid system based on the 4-column mobile layout.

```tsx
<Grid columns={4} gutter={16}>
  <GridItem span={2}>
    <Card>Wide item</Card>
  </GridItem>
  <GridItem span={1}>
    <Card>Narrow item</Card>
  </GridItem>
  <GridItem span={1}>
    <Card>Narrow item</Card>
  </GridItem>
</Grid>
```

**Grid Props:**
- `children` (ReactNode): Grid items
- `columns` (number): Number of columns (default: 4)
- `gutter` (number): Space between items (default: 16)
- `style` (ViewStyle): Additional styles

**GridItem Props:**
- `children` (ReactNode): Item content
- `span` (number): Column span (default: 1)
- `offset` (number): Column offset (default: 0)
- `columns` (number): Total columns (default: 4)
- `gutter` (number): Gutter size (default: 16)
- `style` (ViewStyle): Additional styles

---

### Spacer

Consistent spacing utility component.

```tsx
<Spacer size="md" />
<Spacer size={24} horizontal />
<Spacer size="lg" />
```

**Props:**
- `size` (number | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'): Spacing size
- `horizontal` (boolean): Horizontal spacing (default: false)

**Spacing Values:**
- `xs`: 8px
- `sm`: 12px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

---

### Flex

Flexbox layout helper component.

```tsx
<Flex 
  direction="row"
  justify="space-between"
  align="center"
  wrap="wrap"
>
  <Typography>Left content</Typography>
  <Typography>Right content</Typography>
</Flex>
```

**Props:**
- `children` (ReactNode): Flex content
- `direction` ('row' | 'column'): Flex direction
- `justify` ('flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'): Justify content
- `align` ('flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'): Align items
- `wrap` ('wrap' | 'nowrap' | 'wrap-reverse'): Flex wrap
- `style` (ViewStyle): Additional styles

---

### Container

Layout container with standard padding.

```tsx
<Container>
  <Typography variant="h2">Content with padding</Typography>
  <Typography variant="bodyText">Automatically padded content</Typography>
</Container>
```

**Props:**
- `children` (ReactNode): Container content
- `style` (ViewStyle): Additional styles

---

## Design System Integration

All components automatically use the design system tokens:

- **Colors**: `Colors.pureWhite`, `Colors.borderGray`, `Colors.charcoal`, `Colors.emeraldGreen`
- **Typography**: Predefined text styles from the design system
- **Spacing**: Consistent spacing using `Spacing` tokens
- **Border Radius**: Standardized border radius values
- **Shadows**: Consistent shadow system

## TypeScript Support

All components are fully typed with TypeScript. Import types for enhanced development experience:

```tsx
import type { 
  ButtonProps, 
  TypographyProps, 
  CardProps, 
  ListRowProps 
} from '@/components/ui';
```

## Best Practices

1. **Consistency**: Use design system colors and spacing
2. **Accessibility**: Provide proper labels and semantic structure
3. **Performance**: Use React.memo for frequently rendered components
4. **Responsive**: Design for mobile-first approach
5. **Testing**: Test components with different prop combinations

## Examples

### Complete Workout Card

```tsx
<Card onPress={() => navigation.navigate('workout-detail')}>
  <Flex direction="row" justify="space-between" align="center">
    <View>
      <Typography variant="h3">Morning Run</Typography>
      <Typography variant="metaLabel">5.2 km • 28 min</Typography>
    </View>
    <FitnessIcons.Running size={32} color="#13EC5B" />
  </Flex>
  <Spacer size="sm" />
  <ProgressBar progress={0.75} color="#13EC5B" />
</Card>
```

### Stats Dashboard

```tsx
<Grid columns={2} gutter={16}>
  <GridItem span={1}>
    <Stats 
      value="8,432"
      label="Steps Today"
      trend="up"
      change={12}
      icon={<FitnessIcons.Trophy size={24} />}
      color="#13EC5B"
    />
  </GridItem>
  <GridItem span={1}>
    <Stats 
      value="2,450"
      label="Calories"
      trend="down"
      change={-5}
      icon={<FitnessIcons.Fire size={24} />}
      color="#FF6B6B"
    />
  </GridItem>
</Grid>
```

### Activity Chart

```tsx
<Card>
  <Typography variant="h3">Weekly Activity</Typography>
  <Spacer size="md" />
  <AreaChart 
    data={weeklyData}
    height={180}
    color="#13EC5B"
    showGrid
    showLabels
  />
</Card>
```

---

This documentation provides comprehensive guidance for using all UI components in the Fitness App. Each component is designed to be flexible, accessible, and consistent with the design system.
