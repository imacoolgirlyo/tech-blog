---
title: '[TypeScript] Generics'
date: 2021-11-10 09:16:13
category: 'TypeScript'
draft: false
---

```ts
function identity(arg: number): number {
  return arg
}

function identity(arg: any): any {
  return arg
}
```

identity 함수의 arg로는 어떤 타입의 인자든 올 수 있다. 만약 첫번째 처럼 number라고 타입을 지정해준다면 return 값도 number 타입이라는 걸 알 수 있겠지만 그 이외의 다른 타입들은 오지 못한다.
arg를 그럼 any로 바꾼다면? 어떤 타입이든 전달할 수 있겠지만 return 타입이 any라고만 유추할 수 밖에 없다.

반환되는 값이 어떤 타입인지 알기 위해서 우리는 arg(인수)의 타입을 알아낼 방법이 필요하다. 여기서는 값이 아니라 타입에 적용되는 타입 변수를 사용한다.

```ts
function identity<T>(arg: T): T {
  return arg
}
```

T라는 타입 변수를 추가했다. T는 arg의 타입을 캡쳐해서 이 정보를 나중에 사용할 수 있게 한다.

참고

- https://www.typescriptlang.org/ko/docs/handbook/2/generics.html
