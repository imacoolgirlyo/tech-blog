---
title: '[TS Cheating Sheet] React API 사용시'
date: 2021-11-25 09:16:13
category: 'TypeScript'
draft: false
---

[참고: React with TypeScript Cheatsheet](https://blog.bitsrc.io/react-with-typescript-cheatsheet-9dd891dc5bfe)

### inline styles 을 props로 전달시

```ts
interface ContainerProps {
  ...,
  style: React.CSSProperties
}
```

### 함수형 컴포넌트 표기 `React.FC`

```ts
const ToastContainer: React.FC<ToastContainerProps> = props => {}
```

React.FC를 사용할 때는 props의 타입을 Generics로 넣어서 사용한다. `React.FC`를 사용하면 props에 기본적으로 `children`이 들어가 있다.
또 컴포넌트의 defaultProps, propTypes, contextTypes를 설정할 때 자동 완성이 된다.

하지만 `defaultProps`와 함께 사용할 때 제대로 동작하지 않는 단점이 있음. [참고](https://stackoverflow.com/a/61547010)
