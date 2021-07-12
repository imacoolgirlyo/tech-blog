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

Thunk는 주로 slice 파일들로 쓰여진다. `createSlice` 자체는 thunk를 정의하는데 별도 작업을 하지 않아도 되서 같은 slice file에 별도의 function으로 쓸 수 있다. 그래서 그 slice들은 다른 일반 plain action creators들에도 접근 가능하고 thunk가 있는 곳도 쉽게 찾을 수 있다.

## Writing Async Thunks

Thunks는 그 사이에 setTimeout이나 Promise, async/await 같은 async logic을 둘 수 있다. 그래서 Thunks에 AJAX 을 사용한 API call 을 실행시킬 수 있다.

Redux 를 사용한 Data fetching 로직은 아래와 같이 예측할 수 있다.

- request가 진행중이라는 걸 알리기 위한 'start' action이 request 전에 dispatch 된다. 이건 중복 request를 방지하기 위해 loading state를 트랙킹 하는 용도로 사용되거나 UI에 loading indicator를 보여주기 위해서 사용된다.
- 비동기 요청이 실행된다.
- request 결과에 따라 비동기 로직은 결과 데이터가 포함된 'success' action을 dispatch 하거나 error detail이 포함된 'failure' action을 dispatch 한다.
  - reducer 로직은 모든 경우에 loading state를 삭제하고 성공한 경우에 전달받은 결과 데이터를 조작하거나 실패한 경우에 에러를 출력하기 위해서 error value를 store에 저장한다.

위 단계들은 필수는 아니지만, 보통 많이 사용된다.

Redux Toolkit은 `createAsyncThunk` API를 제공해서 이러한 action들을 생성하거나 dispatch 할 수 있게 도와준다.

```js
const getRepoDetailsSuccess = repoDetails => ({
  type: 'repoDetails/fetchSucceeded',
  payload: repoDetails,
})

const fetchIssuesCount = (org, repo) => async dispatch => {
  dispatch(getRespoDetailsStarted())
  try {
    const repoDetails = await getRepoDetails(org, repo)
    dispatch(getRepoDetailsSuccess(repoDetails))
  } catch (err) {
    dispatch(getRepoDetailsFailed(err.toString()))
  }
}
```

그러나 이렇게 쓰는건 너무 길다. 각각 다른 타입의 request를 처리하기 위해 비슷한 구현 패턴이 반복된다.

- 3가지 다른 경우의 Unique action type이 존재해야 한다.
- 이러한 action type들은 동일한 action creator 함수가 존재해야한다.
- thunk는 정확한 시점에 정확한 action을 실행시켜야 한다.

`createAsyncThunk`는 action types과 action creator를 생성하고 이러한 actions 등을 자동으로 dispatch 하는 thunk를 생성함으로써 이 패턴을 추상화했다. async call을 담당하는 callback function을 제공하면 result와 Promise를 반환한다.

> Tip
> Redux Toolkit은 RTK Query data fetching API를 사용한다. RTK Query는 redux app을 위한 내장 data fetching과 caching solution을 제공한다. 그리고 data fetching을 다루는 thunk나 reducer들을 제거할 수 있다. 한번 시도해보고 앱에서 data fetching code가 간단해지는걸 확인해보길 바란다!

# Loading Posts

지금까지 `postsSlice`는 hard 코딩된 initial state를 이용했습니다. post의 array를 빈 배열 []로 시작하게끔 한다음, server에서 posts list를 가져온다.

그러기 위해서 우리는 `postSlice` 안의 state 구조를 변경해서 API request의 현재 state를 track 할 수 있어야 한다.

## Extracting Posts Selectors

현재까지, `postsSlice` state는 posts 값의 single array로 사용해왔다. 우리는 이걸 posts array를 가지고, loading state field 까지 가지고 있는 object로 바꿔야한다.

반면, `<PostsList>` 같은 UI 컴포넌트는 useSelector hooks을 사용해서 state.posts 로 부터 posts 를 가
