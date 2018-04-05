# React-Domo App Starter Kit
This is repo created to give users an easy starting point when developing a custom app for Domo.

## Installation
1. Install Global Dependencies
   - Install these versions or greater of Nodejs and npm:  
     - Nodejs: 6.9.6
     - npm: 3.10.10
   - Domo cli 
   ```
   npm install -g ryuu
   ```

2. Install local dependencies
   cd into the react-base directory and install node modules.
   ```
   cd react-base
   npm install
   ```

3. Serve the application for development
   Inside the react-base directory run the following command to build the application. Change into the "build" diretory and serve the application using the Domo CLI.
   ```
   npm run build
   cd build
   domo dev
   ```
   **Note:** You will need to be logged in to run `domo dev`.  To login, run `domo login` and follow the prompts.

## Configure Domo Manifest
1. Change the name and size fields to meet your preferences
   - See below for examples: 
   ```json
    "name": "domo-base",
    "version": "1.0.0",
    "size": {
        "width": 2,
        "height": 2
    },
   ```
2. Add references to domo datasets you need
   - Open the manifest.json file in the public directory
   - Insert references to needed datasets in the below json format:
   ```json
    {
      "dataSetId": "61xxx02-4xx2-4xx8-axxd-cxxxxe",
      "alias": "epicDataSet",
      "fields": []
    }
   ```

   ### Getting initial domo app id
1. Publish your app
   - After you publish your app to domo via `domo publish` the manifest in the build directory will be updated with an id.
   - To keep it from getting overwritten and tons of apps from being populated in your domo account, copy the id from the manifest in the build directory to the manifest in the public directory (this file is included in the build).

## Deploy App
1. Deploy to Domo
   - Run `domo publish` in the build directory.
     - The app will show up in Domo under "custom apps" whenever you go to add a new card.

## Upcoming Updates

You can view the [Issues](https://github.com/aalderman19/react-domo-starter-kit/issues) section for details on upcoming updates and bug fixes.