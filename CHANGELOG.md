# Pre-Release

## 0.2.0

Sorry for me being absent for this long this has been a really busy time for me, but the OSS community has my full dedication again.

### Features
- `patchValues` now allows unknown Fields to support id values
- We now support `schemaValidation`, this implies you can integrate joi etc and not only singleField valiation.
- Introduced field resetters.

### Trivial
- Upgrade `webpack` to `4.12`
- Added `.npmignore` to reduce bundleSize.
- Updated `.travis.yml` to nodejs 7
- Added `mobx` and `mobx-react` to `webpack externals` so we're sure the consumer' MobX instance gets called.

## 0.0.6

- Resetting fields & forms
- Validators will imply using validation off singleFields
- ValidationScheme will imply you will validate all at once and cross scheme

## 0.0.5

- Added properties passed to the form
- onSuccess will now be called with the result off onSubmit

## 0.0.4

- Currying support
- async onSubmit, onSuccess and onError
- validateField, validateForm and change are now injected into consumer
- Expanded tests
