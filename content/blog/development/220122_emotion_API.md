---
title: 'Emotion API'
date: 2022-01-22 16:21:13
category: 'development'
draft: false
---

Emotion은 css styles를 JS로 쓸 수 있도록 만든 라이브러리

### @emotion/css

브라우저 환경에 따른 prefix를 자동으로 붙여주고 (Opera, Safari, Chrome에서는 `-webkit-`, FireFox에서는 `-moz-`)
nested selectors, media queries들을 제공해준다.

```js
import { css, cx } from '@emotion/css'

render(
  <div
    className={css`
        padding: 32px;
        color: red
        font-size: 24px
    `}
  ></div>
)
```

위 처럼 사용하면 style에 따른 className을 만들어낸다. `cx` API로 는 이런 className들 여러개 조합 할 수 도 있다.
