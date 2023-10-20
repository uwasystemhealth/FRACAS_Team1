# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm intall`
Install the required dependencies.

### `npm start`

Runs the app in the local development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
**Test instructions**: see `README(test).md` for more information.


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the README.md inside the [Deployment folder](https://github.com/uwasystemhealth/FRACAS_Team1/tree/main/Deployment) for more information about deployment on a live server.

## Important Files and Directories
- `public/`: stores the required public sources, including static images.
- `src/`: React app code files.
    - `src/components/`: components that can be used in multiple pages.
    - `src/pages/`: code files for different pages
    - `src/styles/`: SCSS files of related pages.
    - `src/test/`: local testing files.
    - `src/api.js`: integrated requests related to backend APIs. Needs to be modified when the backend is deployed at a different address.
    - `src/App.js`: the React app's entry point or the main component.
- `jest.config.js`: testing configurations.
- `package.json`: packages to be installed, will be automatically updated when deployed locally or on cloud.

