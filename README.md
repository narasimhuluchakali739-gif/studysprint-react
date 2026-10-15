# StudySprint — React Study Planner

StudySprint is a responsive student productivity dashboard built with React and Vite.

## Features
- Add, complete, filter, and delete study tasks
- Subject, estimated minutes, and priority for each task
- Task completion and planned-time statistics
- Priority-first daily plan generator (local rules, no AI API)
- 25-minute and 50-minute focus timer
- Saves tasks in browser LocalStorage
- Responsive layout for desktop, tablet, and mobile

## Run locally
1. Install Node.js (LTS) from https://nodejs.org/
2. Extract this ZIP and open the `studysprint-react` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal, usually `http://localhost:5173`.

## Build for deployment
```bash
npm run build
```
Vite creates a `dist` folder.

## Deploy on Render (Static Site)
1. Push this project to a GitHub repository.
2. In Render, create **New + → Static Site** and connect the repository.
3. If the project is in the repository root:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. If the project is inside a subfolder, set that subfolder as the Root Directory.
5. Deploy and test add/complete/delete tasks and the timer.

## Tech stack
React, Vite, JavaScript, CSS, Lucide React, LocalStorage.

## Important project note
The "Build my plan" feature sorts pending tasks by priority using local JavaScript rules. It is not connected to a generative AI model. Describe it accurately in a submission or demo.
