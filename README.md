# egg-content-scan

![npm](https://img.shields.io/npm/dt/egg-content-scan.svg)
![npm](https://img.shields.io/npm/v/egg-content-scan.svg)

egg plugin for alicloud content scan

## Install

```bash
$ npm i egg-content-scan --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.contentScan = {
  enable: true,
  package: 'egg-content-scan',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.contentScan = {
  accessKeyId: '',
  accessKeySecret: '',
  debug: false,
  timeout: 10000,
};
```

## License

[MIT](LICENSE)
