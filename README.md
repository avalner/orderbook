# Getting Started with Orderbook application

This project is organized as a monorepo with 3 packages: web, mobile and common. This architecture is chosen to allow easy sharing of common functionality (SocketMessageService, common constants, and shared theme) between web and mobile projects.

## Available Scripts

Run `yarn` in the monorepo root to install dependencies.

In the project directory, you can run:

### `yarn start:web`

Runs the web app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn start:electron`

Runs application in the electron window. Server should be running on [http://localhost:3000](http://localhost:3000) before this task is executed.

### `yarn start:electron-dev`

Runs the web app + electron window.

### `yarn start:andoid`

Runs React Native android version of the project

### `yarn test:<module name>`

Launches the test runner.

### `yarn build:<module name>`

Builds the module for production.
Common module doesn't require to be built.

### `yarn storybook`

Runs storybook for the web application.
