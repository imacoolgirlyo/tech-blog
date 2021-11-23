---
title: '[TS Cheating Sheet] Partial Type, Constant 값으로 이루어진 객체 만들기'
date: 2021-11-23 09:16:13
category: 'TypeScript'
draft: false
---

### Partial<T>

```ts
interface Todo {
  title: string
  description?: string
}

function updateTodo(todo: Todo, fieldToUpdate: Partial<Todo>) {
  return {
    ...todo,
    fieldToUpdate,
  }
}
```

특정 타입 T 안의 property들로 만들어진 부분집합(타입)을 나타낼 때 사용된다. 위 함수는 todo의 title만 업데이트 하거나 description만 업데이트, 둘다 업데이트 등으로 사용될 수 있는데 이때 `Partial<T>`타입을 사용하면 된다.

[참고](https://www.typescriptlang.org/ko/docs/handbook/utility-types.html#partialtype)

### 객체 내 값들이 constant 값들일 때

```ts
type KeyOfType = 'SUCCESS' | 'WARNING' | 'ERROR'
type TypeOptions = 'success' | 'warning' | 'error'

const TYPE: { [key in KeyOfType]: TypeOptions } = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
}
```

- key 값으로 올 수 있는 타입들 `type`으로 생성
- value도 마찬가지로 type으로 만든다.
- `[key in KeyOfType]` 으로 TYPE 객체 안의 key들은 KeyOfType 내의 값이여야 한다는 걸 명시해준다.
