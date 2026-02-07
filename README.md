# MacroMate

A comprehensive fitness tracking app built with Expo and React Native to help you monitor your health, track activities, and achieve your fitness goals.

## Features

- **Activity Tracking** - Log and monitor your workouts, runs, cycling, and more
- **Calorie Counter** - Track daily calorie intake and expenditure with progress visualization
- **Water Intake Monitor** - Stay hydrated with water consumption tracking
- **Heart Rate Tracking** - Monitor your resting and active heart rate
- **Goals Management** - Set and track personalized fitness goals
- **AI-Powered Tips** - Get personalized recovery and fitness recommendations
- **Progress Dashboard** - Visualize your fitness journey with charts and statistics

## Tech Stack

- **Framework**: Expo with React Native
- **Language**: TypeScript
- **Routing**: Expo Router (file-based routing)
- **UI Components**: Custom component library with themed elements
- **Animations**: Spring-based animations for smooth interactions

## Project Structure

```
MacroMate/
├── app/                    # Main application code (Expo Router)
│   └── (tabs)/             # Tab-based navigation
│       ├── index.tsx       # Home/Dashboard screen
│       ├── activity.tsx    # Activity tracking screen
│       ├── log.tsx         # Workout logging screen
│       ├── goals.tsx       # Goals management screen
│       └── profile.tsx     # User profile screen
├── components/
│   ├── ui/                 # UI components (ActivityCard, Charts, etc.)
│   └── ...                 # Shared components
├── constants/              # App constants and configuration
├── hooks/                  # Custom React hooks
└── assets/                 # Images and fonts
```

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository and navigate to the project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npx expo start
   ```

4. Run the app on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Development

### Available Scripts

- `npx expo start` - Start the development server
- `npm run reset-project` - Reset to a fresh project state

### Custom UI Components

MacroMate includes a comprehensive UI component library:

- **ActivityCard** - Configurable cards for displaying fitness metrics
- **Charts** - Progress visualization components
- **Typography** - Consistent text styling
- **Screen/ScreenContent** - Layout containers
- **Button** - Interactive action buttons
- **Card** - Content containers with consistent styling

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)

## License

MIT License
