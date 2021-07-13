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

Thunks는 내부에 setTimeout이나 Promise, async/await 같은 async logic을 둘 수 있다. 그래서 Thunks에 AJAX 을 사용한 API call 을 실행시킬 수 있다.

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

그러나 이렇게 쓰는건 너무 길다. 각각 다른 타입의 request를 처리하기 위해 비슷한 구현 패턴을 따라야한다.

- 3가지 다른 경우의 Unique action type이 존재해야 한다.
- 이러한 action type들은 동일한 action creator 함수가 존재해야한다.
- thunk에서는 정확한 시점에 정확한 action을 실행시켜야 한다.

`createAsyncThunk`는 action types과 action creator를 생성하고 이러한 actions 등을 자동으로 dispatch 하는 thunk를 생성함으로써 이 패턴을 추상화했다. async call을 담당하는 callback function을 제공하면 result와 Promise를 반환한다.

> Tip
> Redux Toolkit은 RTK Query data fetching API를 사용한다. RTK Query는 redux app을 위한 내장 data fetching과 caching solution을 제공한다. 그리고 data fetching을 다루는 thunk나 reducer들을 제거할 수 있다. 한번 시도해보고 앱에서 data fetching code가 간단해지는걸 확인해보길 바란다!

# Loading Posts

지금까지 `postsSlice`는 하드 코딩된 initial state를 이용했다. post의 array를 빈 배열 []로 시작하게끔 한다음, server에서 posts list를 가져오도록 바꿔보자.
그러기 위해서 우리는 `postSlice` 안의 state 구조를 변경해서 API request의 현재 state를 track 할 수 있어야 한다.

## Extracting Posts Selectors

현재까지, `postsSlice` state는 posts 값의 single array로 정의해서 사용해왔다. 우리는 posts array와, loading state field 까지 가지고 있는 object로 바꿔야한다.

`<PostsList>` 같은 UI 컴포넌트는 useSelector hooks을 사용해서 state.posts 값을 읽어오는데 그 값이 array일거라고 판단하고 사용한다. 우리는 새로운 데이터도 받아들일 수 있게끔 위치를 수정해야한다.

reducer에서 data format을 변경할 때마다 컴포넌트가 변경할 필요가 없으면 가장 좋을 것이다. 이걸 방지하는 방법은 slice file에 재 사용 가능한 selector function을 정의하고 각 컴포넌트에서 반복적인 selector logic을 사용하지 않고 이 selector들을 사용해서 data를 가져오도록 하는 것이다. 이렇게 하면 state structure가 변경되면 slice file에 있는 code만 업데이트 시키면 된다.

`<PostsList>` 컴포넌트는 모든 posts들을 보여줄 수 있어야 하고, `<SinglePostPage>` 와 `<EditPostForm>` 컴포넌트는 각각의 id에 따라 단일 post만 가져오면 된다. 작은 selector 함수 두 개를 `postsSlice.js` 에 만들어보자.

```js
const postsSlice = createSlice('//')
export const { postAdded, postUpdated, reactionAdded } = postsSlice.action
export default postsSlice.reducer

export const selectAllPosts = state => state.posts
export const selectPostById = (state, postId) =>
  state.posts.find(post => post.id === postId)
```

useSelector 내에서 inline selector를 사용할 때 첫번째 파라미터로 root state가 제공되는 것 처럼 selector function을 사용할 때의 `state` parameter는 root Redux state라는걸 기억하자!

우리는 이걸 컴포넌트 내에서 이렇게 사용할 수 있다.

```js
import { selectAllPosts } from './postsSlice'

export const PostsList = () => {
  const posts = useSelector(selectAllPosts)
}
```

```js
import { selectPostById } from './postsSlice'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params
  const post = useSelector(state => selectPostById(state, postId))
}
```

재사용 가능한 selector를 만들어서 data를 확인하기 위한 방법을 캡슐화시키는 건 좋은 생각이다. 다음 튜토리얼에서 다루겠지만, `memoized` selector를 사용해서 성능 향상도 할 수 있다.

하지만 다른 추상화들 처럼, 항상 모든 곳에서 적용시켜야 하는 건 아니다. selector를 만드는건 이해해야 하고 유지해야할 코드들이 많다는 뜻이다. 모든 single field state에 selector를 만들어 줄 필요는 없다. selector가 없는 상태에서 시작해서 다른 application code에서도 같은 값을 사용해야 한다면 그 때 추가해보자.

## Loading State for Requests

API 를 호출할 때, 작은 state machine 처럼 네 가지 가능한 상태를 확인할 수 있다.

- 요청을 시작하기 전
- 요청이 시작되고, 진행 중일 때
- 요청이 성공적으로 마무리 되고 우리가 필요한 data를 얻었을 떄
- 요청이 실패해서 error message가 있는 경우

`isLoading: true` 처럼 booleans 값으로 track 할 수 있지만 single enum value를 사용하는게 더 좋다. 아래는 좋은 예제이다.

```js
{
  state: 'idle' | 'loading' | 'succeded' | 'failed',
  error: string | null
}
```

이 field들은 실제 data가 저장된 곳 어디든 위치 할 수 있다. 어떤 특정 string 값을 사용해야 하는 건 아니다. loading 대신 pending 이나 'succeded' 대신 'complete'를 사용해도 된다.

우리는 이러한 정보들을 request 진행상황에 대한 UI를 보여주기 위해 사용할 수 있다. 그리고 loading data가 두번 출력되는 걸 방지하는 로직도 reducer에 추가할 수 있다.

'fetch posts' 요청에 loading state track 할 수 있도록 postsSlice를 업데이트 해보자. posts array 만 있던 state를 `{posts, status, error}` 로 변경시킬 거다. 또한 초기값으로 사용했던 post 값을 삭제할거다. 이렇게 변경하면서 state.posts에 접근해서 array를 가져오던 방식을 한 단계 더 아래로 내려가 array를 반환하는 방식으로 변경해야 한다.

```js
import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer (state, action) {
        state.posts.push(action.payload)
      },
      prepare (title, content, userId) {
        // omit
      },
    },
    reactionAdded (state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated (state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find(post => post.id === id)
      if (exisitingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.action
export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts
export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => pots.id === postId)
```

앞에서 얘기했던게 좀 반복적이고 이상해보일 수 있는 `state.posts.posts` 같은 nested object 였다. `items`이나 `data`로 nested array를 변경할 수 있고 그걸 원하지 않는다면 지금처럼 놔둬도 좋다.
