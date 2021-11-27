---
title: '[TS Cheating Sheet] Enum'
date: 2021-11-25 09:16:13
category: 'TypeScript'
draft: true
---

### Enum 의 특징

```ts
enum Event {
  Mount,
  WillUnmount,
}
```

는 아래와 같이 컴파일 된다.

```ts
var Event
;(function(Event) {
  Event[(Event['Mount'] = 0)] = 'Mount'
  Event[(Event['WillUnmount'] = 1)] = 'WillUnmount'
})(Event || (Event = {}))
```

결과적으로는 이런 key, value를 가진 객체가 만들어진다. Reverse Mapping

```ts

const Event = {
  0: "Mount"
  1: "WillUnmount"
  Mount: 0
  WillUnmount: 1
}
```

### Enum은 실제로 import 해서 사용하지 않더라도 bundle에 포함된다?

위와 같이 Enum은 컴파일시 즉시 실행 함수(IIFE)로 컴파일 되기 때문에 번들러는 변수가 항상 어딘가에서 사용된다고 판단해버린다. 따라서 실제로 Enum이 사용되지 않고 있음에도 불구하고 항상 번들 파일에 포함된다. 사용되지 않는 변수나 함수들은 번들시키지 않도록 Tree Shaking이 되지 않는 것이다.

```ts
const Event = {
  Mount: 'Mount',
  WillUnmount: 'WillUnmount',
} as const

type Event = typeof Event[keyof typeof Event] // 'Mount' 나 'WillUnmount'

const Event = {
  Mount: 'Mount',
  WillUnmount: 'WillUnmount',
}
```
