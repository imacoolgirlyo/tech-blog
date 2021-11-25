## [Resolve](https://webpack.js.org/configuration/resolve/)

모듈을 다루는 방법을 바꿀 수 있는 옵션이다. 설정을 통해서 특정 모듈을 가져오는 방법을 바꿀 수 있다.

### resolve.alias

이걸 찾게된 이유: https://github.com/firebase/firebase-js-sdk/issues/1797
하지만 결국 alias를 추가해도 되진 않았음..

가져오고 싶은 모듈의 이름을 정해서 가져올 수 있다.

```js
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
}
```
