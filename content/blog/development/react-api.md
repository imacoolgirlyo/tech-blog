---
title: 'React API : useRef'
date: 2020-07-05 17:21:13
category: 'react'
draft: false
---

[useRef](https://reactjs.org/docs/hooks-reference.html#useref)는 mutable한 ref object를 return 합니다. 이 ref object의 .current property는 전달한 argument(initialValue)로 초기화되며 반환된 object는 컴포넌트의 모든 lifetime에서 값이 유지됩니다.

```js
const refContainer = useRef(initialValue)
```

예를 들어, ref가 컴포넌트의 props로 initialized 된 경우 props가 변경될 때마다 ref가 새로 값을 갱신한다고 생각할 수 있지만, useRef에 의해 반환된 object는 컴포넌트의 모든 lifetime에서 값이 유지되기 때문에 필요에 따라 이를 갱신해줘야 합니다.

refs는 DOM에 접근할 때도 사용할 수 있습니다. 만약 `<div ref={myRef} />`로 element에 ref object를 전달하면 React는 node가 변경될 때마다 그에 해당하는 DOM node를 .current property에 set합니다.

useRef()는 plain JS Object를 만듭니다. 임의로 `{ current : ...}` 를 만드는 것과 useRef() 가 반환하는 object와 가장 큰 차이는 **useRef()는 모든 render 마다 항상 동일한 ref object를 반환한다는 것입니다.**
