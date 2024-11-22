# `Build scripts`

Avoid bundling and develop in a more old-school way.

Look at the scripts and scripts-tests folders.

The whole repository is meant to be cloned and start the development.

# Tasks

For the full list of tasks please check package.json.

## Development

It serves the files, watches them and hot-reloads the browser.

```
npm install
npm start
```

Browse to the app at [`localhost:8000/index.html`][local-app-url].



## Watching

On WINDOWS you need to start this task in a separate terminal when developing. <br/>
It prettifies the source and hot-reloads the browser on change.

```
npm run watch
```


## Testing

Runs all the tests.

```
npm test
```


## Linting

```
npm run lint
```


## Build

You may need to set the NODE_ENV variable. <br/>
Available variables: development, test, production.

```
NODE_ENV=production npm run build
```


## Build docker

Builds a docker container. Check scripts/docker-build.sh for details.

```
./scripts/docker-pre-build.sh production
./scripts/docker-build.sh production
```
