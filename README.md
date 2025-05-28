# ABRoad-demo-webapp

Important: Make sure you are using Node v18.16.0 or higher, and you have yarn installed.

## ABRoad-kg-store (demo)

* Make sure the you have downloaded the demo data and mounted the triple-store according to [abroad-kg-store](https://github.com/idiap/abroad-kg-store).

* Make sure that the `const engineUrl` in the file `src/api/api.ts` (by default set to `'http://localhost:8890/sparql/'`) actually correctly point to the SPARQL endpoint of the Virtuoso triple-store to ensure the connection between the UI and and KG.


## Development mode 👨‍💻
First, install all dependencies:
```yarn```

Then, start the development server:
```yarn start```

## Build 🛠
Install all dependencies:
```yarn```

Build the application:
```yarn build```

## Deployment with serve 🚀
Install serve:

```
npm install -g serve
serve -s build
```

Run the server:
```
serve -s build -l 4000
```
