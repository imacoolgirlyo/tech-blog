---
title: 'Async Logic and Data Fetching'
date: 2021-07-12 16:21:13
category: 'development'
draft: false
---

이 글은 [Redux Essentials, Part 5: Async Logic and Data Fetching
](https://redux.js.org/tutorials/essentials/part-5-async-logic) 을 번역한 글입니다.

### Thunk Functions

thunk middleware가 Redux store에 추가되면, store.dispatch 에 바로 thunk functions을 전달할 수 있게 된다. thunk functions은 항상 arguments로 (dispatch, getState)와 함께 호출되며 필요시에 thunk 내에서 이를 사용할 수 도 있다.

Thunks는 마찬가지로 action creator를 이용해서 plain actions을 dispatch 한다. 예) `dispatch(increment())`

```js
const store = configureStore({ reducer: counterReducer })

const exampleThunkFunction = (dispatch, getState) => {
  const stateBefore = getState()
  console.log(`Counter before: ${stateBefore.counter}`)
  dispatch(increament())
  const stateAfter = getState()
  console.log(`Counter after: ${stateAfter.counter}`)
}

store.dispatch(exampleThunkFunction)
```

일반 action objects를 dispatch 하는 것과 일관성을 위해 일반적으로 thunk function을 반환하는 thunk action creator를 생성한다. 이러한 action creator들은 thunk 내에서 사용할 수 있는 arguments 또한 사용할 수 있다.

```js
const logAndAdd = amount => {
  return (dispatch, getState) => {
    const stateBefore = getState()
    console.log(`Counter before: ${stateBefore.counter}`)
    dispatch(increamentByAmount(amount))
    const stateAfter = getState()
    console.log(`Counter after: ${stateAfter.counter}`)
  }
}

store.dispatch(logAndAdd(5))
```
