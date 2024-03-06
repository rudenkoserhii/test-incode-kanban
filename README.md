Project Name: Test Incode Kanban

Overview

This project is a GitHub Kanban Board, allowing users to view and manage issues from a GitHub repository in a Kanban-style board. Users can load issues by entering a GitHub repository URL, and the app organizes issues into three columns: ToDo, In Progress, and Done. The application supports drag-and-drop functionality for changing the order of issues within columns. The app also stores the current issue position between sessions and allows users to visit the profile of the repo owner and the repo itself.

Technologies Used:

- React 18 with Hooks
- TypeScript
- UI Library: Ant Design
- State Manager: Redux
- Testing Libraries: Cypress

Project Structure:

The project follows a modular structure to enhance readability and maintainability:

src/: Contains the source code of the React application.
cypress/: Includes Cypress integration tests.
redux/: Contains Redux store configuration and slices.

Scripts:
start: Runs the development server.
build: Builds the production-ready application.
eject: Ejects the project configuration from react-scripts.
lint: Lints the project files using ESLint.
lint:fix: Automatically fixes ESLint errors.
prettier: Formats the code using Prettier.
cypress:open: Opens the Cypress testing interface.

Development Setup:

- Clone the repository: git clone <repo-url>
- Install dependencies: npm install
- Start the development server: npm start

Testing:
Unit tests are written and Integration tests are performed using Cypress.

How to Use:

- Enter the GitHub repository URL in the input field.
- Press the "Load" button to fetch issues from the repository.
- View and manage issues in the Kanban-style board.
- Drag-n-drop issues between columns to change their order.
- Stored issue positions persist between sessions.
- Visit the profile of the repo owner and the repo itself through provided links.

Project Assessment:
The project will be assessed based on the following criteria:

Workability: How well the application functions.
Project Structure: Organization of files and directories.
Code Quality: Clean and readable code, adherence to ESLint and Prettier standards.
React Knowledge: Effective use of React and its ecosystem.
Testing: Implementation of unit and integration tests.

Repository Link
[Link to Repository](https://github.com/rudenkoserhii/test-incode-kanban)

Notes
