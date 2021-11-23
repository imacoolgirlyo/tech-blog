---
title: '[TypeScript 맛보기] Partial Type'
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
