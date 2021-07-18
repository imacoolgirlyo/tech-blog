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

현재까지, `postsSlice` state는 posts 값의 single array로 정의해서 사용해왔다. 이제느 posts array와, loading state field 까지 가지고 있는 object로 바꿔야한다.

`<PostsList>` 같은 UI 컴포넌트는 useSelector hooks을 사용해서 state.posts 값을 읽어오는데 그 값이 array일거라고 판단하고 사용한다. 우리는 새로운 데이터도 받아들일 수 있게끔 위치를 수정해야한다.

reducer에서 data format을 변경할 때마다 컴포넌트가 변경할 필요가 없으면 사실 가장 좋다. 이걸 방지하는 방법은 slice file에 재 사용 가능한 selector function을 정의하고 각 컴포넌트에서 반복적인 selector logic을 사용하지 않고 이 selector들을 사용해서 data를 가져오도록 하는 것이다. 이렇게 하면 state structure가 변경되면 slice file에 있는 code만 업데이트 시키면 된다.

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

하지만 다른 추상화들 처럼, 항상 모든 곳에서 적용시켜야 하는 건 아니다. selector를 만드는건 이해해야 하고 유지해야할 코드들이 많다는 뜻이다. 모든 single field state에 selector를 만들어 줄 필요는 없다. selector가 없는 상태에서 시작해서, 다른 application code에서도 같은 값을 사용해야 한다면 그 때 추가해보자.

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

### Fetching Data with `createAsyncThunk`

Redux Toolkit의 createAsyncThunk API는 자동으로 'start/succes/failure' action을 제공해준다.

posts 리스트를 가져오기 위해 AJAX call을 실행시키는 thunk를 추가해보자. `src/api` folder에서 client utility 를 import 하고 'fakeApi/posts' 요청을 만들어 보자.

```js
  import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
  import { client } from '../../api/client'

  const initialState - {
    posts: [],
    status: 'idle',
    error: null
  }

  export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts')
    return response.posts
  })
```

`createAsyncThunk` 는 두 argument를 가진다.

- 이후 생성될 action type의 prefix로 사용하게 될 string
- Promise를 리턴하게될 payload creator callback 함수, 이 Promise는 데이터를 포함하고 있던지 error를 가진 rejected Promise를 가지고 있다.

payload creator는 AJAX call을 만들고 Ajax call에서 바로 Promise를 리턴하던지 API response로 부터의 데이터를 반환한다. Promise를 반환하기 때문에 async/await syntax를 사용해서 이를 처리한다.

이 경우에 우리는 action type prefix로 'posts/fetchPosts' 를 전달한다. payload creation callback은 response를 return 하기 위해서 API call을 기다린다. 이 response 객체는 `{ posts: []}` 이고 이 array를 action으로 dispatch 하고 싶다. 그래서 response.posts를 가져와 callback에서 반환시킨다.

만약 `dispatch(fetchPosts())` 를 실행시키면, fetchPosts thunk는 action type `posts/fetchPosts/pending` 을 첫번째로 dispatch 한다.

reducer에서 확인해보면 status가 loading인 것을 확인할 수 있다.

Promise가 resolve되면, fetchPosts가 callback 함수가 반환한 response.posts를 가지고 `posts/fetchPosts/fulfilled` 를 dispatch 한다.

Dispatching Thunks from Components

`<PostsList>` fetch 한 데이터들로 컴포넌트를 업데이트 시켜보자. 컴포넌트에서 fetchPosts를 import 한다. 다른 action creators들 처럼 dispatch 해야 하기 때문에 useDispatch hook도 추가한다. `<PostsList>`가 mount되면 이 data를 가져오고 싶기 때문에 useEffect hook도 import 시킨다.

```js
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllPosts, fetPosts } from './postsSlice'

export const PostsList = () => {
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPosts)

  const postStatus = useSelector(state => state.posts.status)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postsStatus, dispatch])
}
```

posts list를 한번만 fetch 하는게 중요하다. 뷰를 바꾸기 위해서 컴포넌트가 render 렌더 될 때마다 매번 실행시키면 posts를 여러번 실행시키게 된다. `posts.status`를 이용하면 실제로 언제 fetch 헤야하는지 알 수 있고 'idle' 상태일 때만 다시 fetch 하면 된다.

### Reducers and Loading Actions

다음은 이 reducer 들에서 이런 두 가지 action들을 다뤄야 한다. -> 어떤 action들이라는 거지?
우리가 사용하고 있는 `createSlice` API를 좀 더 깊게 살펴보자.

`createSlice`는 우리가 reducers field에 정의 했던 모든 reducer function의 action creator를 생성한다. 그리고 생성된 type들은 reducer의 이름을 포함하고 있다.

```js
console.log(
  postUpdated({ id: '123', title: 'First Post', content: 'Some text here' })
)
/*
{
  type: 'posts/postUpdated',
  payload: {
  id: '123',
  title: 'First Post',
  content: 'Some text here'
  }
}
*/
```

그러나, slice reducer가 slice의 reducer field에 정의되지 않은 다른 action에 반응해야 할 때가 여러번 있다. 우리는 이 경우에 slice의 `extraReducers` field를 사용할 수 있다.

`extraReducers` object들의 key들은 redux action type string이여야 한다. 직접 손으로 쓸 수 있지만 '/' 문자열을 포함하고 있을 수 때문에 번거롭다.

```js
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // slice-specific reducers here
  },
  extraReducers: {
    'counter/increament': (state, action) => {
      // posts slice를 업데이트 하기 위한 일반 reducer logic
    },
  },
})
```

하지만 Redux Toolkit으로 생성된 action creator들은 actionCreator.toSting() 호출한다면 자동으로 action type string을 반환한다. ES6 object literal computed properties를 사용해서 넣으면 action type들이 자동으로 object의 key가 된다.

```js
import { increment } from '../features/counter/counterSlice'

const object = {
  [increment]: () => {},
}

console.log(object) // { 'counter/increment' : Function }
```

extraReducers field에서도 가능하다.

```js
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // slice-specific reducers here
  },
  extraReducers: {
    [increment]: (state, action) => {
      // posts slice를 업데이트 하기 위한 일반 reducer logic
    },
  },
})
```

builder callback syntax를 이용해서 extra reducer를 추가할 수 있다. object 대신 extraReducers에 function을 전달하면 각각의 경우에 builder parameter를 사용할 수 있다. `builder.addCase()` 는 listen 할 action의 string 값을 받거나 Redux toolkit action creator도 받는다.

이 경우에는 fetchPosts로 dispatch된 'pending', 'fulfilled' action 도 듣고 있어야 한다. fetchPost function을 현재 action creator에 붙이고 그런 actions들을 실행시키기 위해 extraReducers들을 전달한다.

```js
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('fakeApi/posts')
  return response.posts
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchPosts.fulfiled]: (state, action) => {
      state.status = 'succeeded'
      state.posts = state.posts.concated(action.payload)
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
  },
})
```

우리는 이 세가지 action을 이용할 수 있다.

- request가 시작되면, status emum이 'loading'으로 바뀐다.
- request가 성공적으로 끝나면 'succeeded'로 바뀌고 state.posts가 업데이트 된다.
- request가 실패하면 status는 'failed'로 되고 display 할 수 있는 형태의 error message가 저장된다.

## [Displaying Loading State](https://redux.js.org/tutorials/essentials/part-5-async-logic#displaying-loading-state)

`<PostsList>` 컴포넌트는 Redux에 저장된 posts들의 모든 업데이트를 이미 확인했다. 그래서 만약 화면을 refresh 한다면 fake API 에 있는 random posts들이 보여야 한다.

우리가 사용하는 fake API는 data를 즉시 반환한다. 하지만 실제 API call은 response를 반환하기 까지 시간이 걸린다. 그래서 이 떄 loading..이라는 indicator를 보여주고 user에게 현재 data를 기다리고 있다고 알려주는게 좋다.

state.posts.status emum에 맞게 다른 UI를 보여주자.

```js
export const PostsList = () => {
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPosts)

  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])
}

let content

if (postStatus === 'loading') {
  content = <div>Loading...</div>
} else if (postStatus === 'succeeded') {
  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date(localCompare(a.date)))

  content = orderedPosts.map(post => <PostExcerpt key={post.id} post={post} />)
} else if (postStatus === 'failed') {
  content = <div>{error}</div>
}

return (
  <section>
    <h2>Posts</h2>
    {content}
  </section>
)
```

fake API는 즉시 data를 반환하기 때문에 로딩 스피너를 거의 보지 못할 것이다. API 요청이 좀 더 오래 걸리는 것을 표현하기 위해서 api/server.js를 열어서 아래를 uncomment 해보자.

```js
// this.timing = 2000
```

이 라인을 uncomment 하면 fake API가 response 전에 2초를 강제로 기다릴 것이다. UI가 어떻게 spinner를 보여줄지 보고 싶다면 이 라인을 변경시켜보면 되겠다.

## Loading Users

이때까지 post를 fetching하고 display 하는 방법을 알아보았다. 근데 posts를 보면 author가 Unknown author 라고 되어있다.

이건 post entries가 fake API server로 무작위로 만들어지기 때문이다. fake API server는 또한 우리가 page를 reload할 때마다 무작위로 fake user를 만든다. application이 시작할 때 그런 user들을 fetch 하기 위해서 users slice를 만들어야 한다.

저번에 만들었던 것 처럼, API로 user들을 가져오고 그 값을 반환하기 위해서 async thunk를 만들어보자. 그리고 extraReducers slice field에 `fulfiled` action을 만들어주자. 지금부터 loading state에 대한 걱정은 잠시 넣어두려한다.

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initalState = []

export const fetchUsers = createAsyncThunk(
  ('users/fetchUsers',
  async () => {
    const response = await client.get('/fakeApi/users')
    return response.users
  })
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extreaReducers: {
    [fetchUsers.fuilfiled]: (state, action) => {
      return action.payload
    },
  },
})

export default usersSlice.reducer
```

application이 시작될 때 한번만 user list를 fetch 하려 한다. `index.js` file 안에 바로 `fetchUsers` thunk를 dispatch 할 것이다.

```js
import { fetchUsers } from './features/users/usersSlice'

store.dispatch(fetchUsers())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StricgtMode>,
  document.getElementById('root')
)
```

이제 각각의 posts에 username이 다시 보이기 시작할 거다. 그리고 `<AppPostForm>` 에 'Author' dropdown에 동일한 users 리스트를 보여줘야 한다.

# [Adding New Posts](https://redux.js.org/tutorials/essentials/part-5-async-logic#adding-new-posts)

이 section에 마지막 단계이다. `<AppPostForm>` 을 이용해 새로운 post를 추가할 때, post는 app 안의 Redux store에만 저장된다. 사실 우리는 실제로 그 데이터를 '저장'하기 위해서 API call을 통해서 새로운 post를 만들어야 한다. 이게 물론 fake API이긴 하지만 새로운 post는 우리가 reload 하면 유지되지 않을 것이다. 만약 우리가 실제 백엔드 서버를 가지고 있다면 다음번에 reload 할 때 그 값을 가져올 수 있다.

## Sending Data with Thunks

data를 featching 하는 작업 말고 data를 보내는 작업을 돕기 위해 `createAsyncThunk` 을 사용해왔다. `<AddPostForm>` 에서 전달하는 값을 argument로 받는 thunk를 만들고 data를 저장하기 위해서 fake API로 HTTP POST 요청을 할 것이다.
