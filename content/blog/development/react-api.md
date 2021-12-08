---
title: 'React API : useRef, useEffect'
date: 2020-07-05 17:21:13
category: 'react'
draft: false
---

### useRef

[useRef](https://reactjs.org/docs/hooks-reference.html#useref)는 mutable한 ref object를 return 합니다. 이 ref object의 .current property는 전달한 argument(initialValue)로 초기화되며 반환된 object는 컴포넌트의 모든 lifetime에서 값이 유지됩니다.

```jsx
const refContainer = useRef(initialValue)
```

예를 들어, ref가 컴포넌트의 props로 initialized 된 경우 props가 변경될 때마다 ref가 새로 값을 갱신한다고 생각할 수 있지만, useRef에 의해 반환된 object는 컴포넌트의 모든 lifetime에서 값이 유지되기 때문에 필요에 따라 이를 갱신해줘야 합니다.

refs는 DOM에 접근할 때도 사용할 수 있습니다. 만약 `<div ref={myRef} />`로 element에 ref object를 전달하면 React는 node가 변경될 때마다 그에 해당하는 DOM node를 .current property에 set합니다.

useRef()는 plain JS Object를 만듭니다. 임의로 `{ current : ...}` 를 만드는 것과 useRef() 가 반환하는 object와 가장 큰 차이는 **useRef()는 모든 render 마다 항상 동일한 ref object를 반환한다는 것입니다.**

### useEffect

```jsx
useEffect(didUpdate)
```

useEffect 에 전달되는 함수는 render 결과물이 화면에 반영되고 나면(after the render is commited to the screen) 실행됩니다.

- [Render and Commit Phases](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/#render-and-commit-phases)
  - Render Phase는 이전 렌더링 결과와 새로 만든 React DOM의 결과를 비교해서 차이를 계산하는 단계
  - Commit Phase는 Render Phase에서 계산한 그 차이를 DOM에 반영하는 단계

기본적으로 effect는 모든 render 이후에 실행되지만, dependency array에 값을 추가하여 특정 값이 변경될 때만 render가 실행되도록 설정할 수 있습니다.

### [forwardRef](https://reactjs.org/docs/forwarding-refs.html)

- DOM element에 직접 접근해서 값을 변경해줘야 할 때가 있다. 이 DOM element의 값을 부모에서 컨트롤 해줘야할 때 (focus나 selection) 부모는 자식의 ref를 가지고 있어야 한다. ex. ref.current.focus()
- 부모 컴포넌트에서 ref를 정의 한 후에, ref를 단순히 props로 전달하고 그 Button이 ref를 dom에 attach하는 것만으로는 제대로 DOM을 가리키지 않는다.

forward function을 사용하면 React가 ref를 `(props, ref) => ...` 형식으로 두번째 인자 위치에 전달시킨다.

```js
const List = () => {
  const fancyButtonRef = useRef(null)
  return (
    <div>
      <FancyButton ref={ref}>
    </div>
  )
}
```

```js
const FancyButton = forwardRef((props, ref) => (
  <button ref={ref}>I'm a FancyButton yo.</button>
))
```
