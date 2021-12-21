---
title: 'Redux의 combineReducer'
date: 2021-12-22 16:21:13
category: 'development'
draft: true
---

```js
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './rootReducer'

const store = createStore(rootReducer)
// 생략
return (
  <Provider store={store}>
    <App />
  </Provider>
)
```

store는 여러 reducer들이 합쳐진 상태인 rootReducer를 기반으로 만들어진다.

```js
import { combineReducer } from 'react-redux'

const rootReducer = combineReducer({
  folder: folderReducer,
  document: documentReducer,
})

export default rootReducer
```

reducer는 state와 action 을 parameter로 받는 함수이다. combineReducer는 key는 state의 이름, value는 reducer 함수로 이루어진 object를 인자로 받고 key들을 합쳐서 하나의 큰 state로 만든다.

```js
const combineReducers = reducers => {
  const reducerKeys = Object.keys(reducers) // [folder, document, project, ...]

  return function combination(state, action) {
    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i]
      const reducer = reducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)

      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    hasChanged = hasChanged || reducerKeys.length !== Object.keys(state).length
    return hasChanged ? nextState : state
  }
}
```
