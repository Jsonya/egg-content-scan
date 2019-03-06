# egg-content-scan

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
