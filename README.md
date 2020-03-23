# <img src="./assets/logo/skylin.png" alt="Skylink logo" width="250" height="250"> <img src="./assets/sia/built-with-Sia-color.svg" alt="Built with sia" width="250" height="250">

# Skylin

Skylin is an open source Electron-base app for decentralized file uploading/downloading on the skynet/sia network.

![Skylin Screenshot](./assets/readme-bg.png)

It is written in Javascript and uses React.
Skylin allows you to upload files to skynet with symmetric/asymmetric (openPGP) encryption and more.
It's an independent project with its ongoing development.

## Notes
- Skylin is for the moment only compatible with macOS
- PGP private keys are totally secure since they are encrypted with a passphrase that only you have in mind.
- There will soon be a global optimization of the app architecture.

## Architecture
- Npm
- Node
- Electron
- React
- Webpack
- OpenPGP
- Ant-Design
- Jest

## Setting up the developer environment
```
npm install
```

Run the dev environment :

```
npm run postpackage
```

## Build instructions
```
npm install
```
```
npm run build
```
```
npm run postpackage
```

## Contributing
Please see the [contributing guidelines](./CONTRIBUTING.md)

## Community
Join the [sia discord](https://discord.gg/sia) if you'd like to get more involved with Skylin. 
You can ask for help, discuss features you'd like to see, and a lot more. 
We'd love to have your help so that we can continue improving Skylin.

Help us translate Skylin to your language by submitting translations at https://www.transifex.com/skylin/skylin/

Follow @skylin on Twitter for important news and announcements.