Objective
Create a horizontal list that can be navigated with left/right keyboards keys similar to Kodi or Netflix UI.

Requirements
- Focused item always has to be in the first position. ( left-most position, but items also overflow to both sides since they go until the screen edges)
- Use Zustand for state management. Even though this application is quite basic, avoid using only the context API.
- Changing focus from one item to another should have a smooth transition. For this we'll use scrollTo with smooth behavior.
- Use images.artwork_portrait as an item cover image, based on this api endpoint https://eu.acc01.titanos.tv/v1/genres/1/contents?market=es&device=tv&locale=es&page=1&per_page=50&type=movie 
- Do not use any libraries for list navigation.

Implement the tests that you deem necessary as described in the testing approach section.

## Tech Stack
- bun for package manager, build, test, and dev server
- React with Typescript
- Zustand for state management using component specific stores that are colocated with the component code.
- for styling use CSS Modules files, that are colocated with the component code ( implement basic reset and utility classes, using atomic design principles and design tokens with css variables, structure css classes with BEM methodology)
- storybook for component library and interaction testing, visual regression testing and e2e test, since the main output is a component then we'll avoid unit test for the most part and rather focus on the interactions logic being correct.
- prefer composable components and patterns, and avoid prop drilling.
- prefer simpler markup, avoiding redundant divs and unnecessary classes, always using semantic html elements when possible.

Overall lets keep the stack simple with few deps 

## Testing approach
1. Interaction Testing with play functions
The standard way to test components is by writing a play function directly in your story. This function uses a Storybook-instrumented version of Testing Library to simulate user interactions like clicks and typing. 

Execution: These tests run automatically in the browser whenever you view a story.
Playwright's Role: While the play function runs in the browser, the Storybook Test Runner uses Playwright under the hood to visit each story and verify that it renders and that the play function passes without errors. 

2. use Portable Stories (Playwright Component Testing)
You can now import your Storybook stories directly into Playwright Component Tests (CT). This allows you to use Playwright’s native features—like Network Interception and Auto-waiting—while reusing the states you've already defined in Storybook. 

Method: Use the composeStories utility to convert stories into renderable elements for Playwright.

3. Automated Visual Regression Testing 
Playwright is frequently used to automate Visual Regression Testing by taking screenshots of stories and comparing them to "baseline" images. 
Setup: You can configure a custom Playwright script to crawl your local Storybook instance and capture screenshots across different viewports and browsers.
Alternative: For a managed experience, Storybook's Visual Tests addon (powered by Chromatic) automates this process in the cloud. 

4. e2e testing with playwright:
https://storybook.js.org/docs/writing-tests/integrations/stories-in-end-to-end-tests#with-playwright

## Workflow

1 - trigger parallel research subagents for each facet of the project to gather current best practices and patterns for the tech stack, testing approach, and other relevant information.
2 - based on the research, create a detailed plan for the project in phases, with a list of tasks planned in a way that parallelism is required , each task should have a clear outcome and pseudo-code examples of implementation ( super concise enough for another agent to fill in the blanks). there's a .plan/ folder and each .md file inside is considered a task, once an agent verifies a task as complete it should rename the task file to add "X-" to the start of the filename to indicate it's complete. in the root also create a PLAN.md which contains a super concise overview of the project, the phases, and the tasks, and most importantly contain mermaid graphs at the top, of the component breakdown, logic and interactions flows.
3 - plan review: use parallel subagents to review the separate branches of tasks dependency tree, so each subagents reviews all related tasks to make sure dependencies are correctly identified and tasks are independent.
4 - start the project by executing the tasks in parallel, using the parallel subagents to execute the tasks, one phase at a time, using available tookls to test it's own outcome and check against the task description.