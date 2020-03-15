![Skylin Screenshot](/readme-bg.png)


# skylin

Skylin is an Electron application that provides a user interface for uploading and downloading on the skynet/sia network. It allows you to encrypt your files with PGP(openPGP) symmetric and asymmetric encryption, you can also save your favorites skylink in favorites. A history is also available. 

## Notes
- Skylin is for the moment only compatible with macos
- PGP private keys are totally secure since they are encrypted with a passphrase that only you have in mind.
- Keep in mind that this is a version that was developed quickly for the skynet/SIA hackathon. So there may be bugs.
- For reasons of speed, I have neither commented the code nor added the unit tests.
- There will soon be a global optimization of the app architecture.

## Architecture
- Node
- Npm
- Electron
- React
- OpenPGP
- Ant-Design

## Setting up the developer environment
To get started, clone the repo into your environment.

```
git clone https://github.com/unbilth/skylin.git
```

Once the repo is cloned, we need to install all of the external packages. To do this, `cd` into your project directory and run
```
npm install
```

Now you can run the dev environment : 

```
npm start
```

If you want to build :

```
npm run build
```
```
npm run postpackage
```

