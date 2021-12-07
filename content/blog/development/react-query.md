---
title: '🔑 React Query에서의 Server State 그리고 핵심 개념'
date: 2021-11-05 16:21:13
category: 'React-Query'
draft: false
---

## State Management tool과 React Query

> Server state and client state are fundamentally different.

흔히, 서버로 request 한 후에 받은 response data를 화면에 그리기 위해서
redux store에 저장한다 . CRUD user interaction이 이루어지면 request 를 다시 날릴 뿐 아니라 새로운 state 값을 사용하도록 reducer에서 state를 조작해야한다.

**이 방법의 단점:**

- 적절한 시점에 store에 저장해두고 있는 state 들을 갱신시키지 않으면 fetch해온 데이터가 outdated된 데이터 일 가능성이 커진다.
- 또한 만약 store 구조가 update 시키기 어려운 구조라면 복잡한 reducer를 만들어야 할 수 도 있을 것이다.

React Query는 response data는 Server State로 보고 State Management tool에서 저장하지 않아야 하며 Redux store에는 UI State들인 Client State만 다뤄야한다고 본다.

여기서 말하는 Server State란 어떤 것일까?

**Server State:**

1. 컨트롤하지 못하는 먼 곳에서 값이 유지됨
2. 데이터를 가져오고 업데이트 하기 위해서 asynchronous APIs가 필요한 값
3. 공동으로 소유하고 있는 것을 의미하며 사용자 모르게 다른 사람이 변경할 수 있는 값
4. 결국에는 앱의 라이브 사이클 동안 outdated 상태가 되는 값

이제는 더 이상 이러한 서버 state들을 client state tool에 저장하지 말아야 한다.

## React Query

redux store를 사용한다면, useSelector로 state가 새로 업데이트 될 때마다 새로운 값을 가져올 수 있다. 또한 useSelector로 가져온 값은 다른 컴포넌트에서도 동일한 값을 가져올 수 있다.

React Query도 이와 비슷하게 같은 key 값을 사용하고 있는 Query가 있다면 그 Query를 사용하는 곳에서는 항상 같은 cache 데이터를 사용할 수 있도록 해준다. 사실상 useSelector로 값을 가져오는 것과 거의 동일하다. (개념상)

```js
const result = useQuery({
  queryKey, // Query에 사용되는 unique key, key가 변경될 때마다 새로 query함
  queryFn, // 실제로 data를 request 하는 요청
  enabled, // 이 Query를 실행할지 말지 나타내는 조건
})
```

### 헷갈리는 StaleTime 과 CacheTime

**StaleTime**

- data가 stale 상태로 넘어가기까지 걸리는 시간이며 기본 값은 0으로 설정되어 있다. 즉 Query로 받은 데이터는 fresh하지 않다고 판단한다.
- 거의 변경되는 값이 아니라면, Infinity로 두고 항상 최신 데이터로 볼 수 도 있다.

**CacheTime**

- inactive나 unused data가 메모리에 저장되서 유지되는 시간
  - ex) documents 목록을 useQuery를 이용하여 받아왔다. 기본 staleTime이 0이기 때문에 이 documents 데이터는 바로 stale data로 본다. 어쨌든 이 data는 cache에 저장되게 되는데 cacheTime을 3분으로 세팅해두었기 때문에 3분간 cache 에 이 값이 저장된다.

거의 staleTime을 변경시켜야 하고, cacheTime은 거의 건들 일이 없을 것이다.

<!-- - cache에서 inactive query들이 삭제될 때까지 걸리는 시간 (잠깐 저장해두는 시간)
  - 예를 들어) document 목록을 fetch 해옴. 이때 이 document 데이터들을 cache에 기본적으로 5분 저장해두고 있다. 유저가 그 이후에 30분 동안 계속 workspace에서 작업한다면 5분이 지난 지점에 document의 cache data는 삭제된다. 반면 5분 되기 전에 다시 App으로 넘어갔다면 cache data를 사용하게 된다.
- data 관점에서 이 data를 유효하다고 판단할 때 사용하는 기준

그래서 거의 staleTime을 조정하게 될거고 cache time은 건들 일이 거의 없을 것이다.

query의 key가 변할 때 마다 다시 refetch 하므로 query key를 useEffect의 dependency array 처럼 다루자.

**새로운 cache entry** -->

## 핵심 개념

### 1. useQuery의 Query instances들에서 cache data는 기본적으로 stale data로 본다.

이러한 stale data는 아래 상황에서 다시 refetch 된다.

- 새로운 query의 instance가 mount 되었을 때 (예를 들어 query key가 변경되었을 때)
- window가 refocused 되었을 때
  - background refetch가 일어나므로, isFetching 상태를 사용하여 loader를 보여줄 수 도 있다.
- network가 다시 연결되었을 때
- query에 refetch interval이 따로 설정된 경우

### 2. 더 이상 active 하지 않은 useQuery의 Query는 'inactive' 상태로 변경되어 cache data에 남아있고 기본 세팅 5분이 지나면 cache에서 삭제된다.

### 3. Query가 실패하면 UI에 error를 보여주기 전에 약간의 딜레이 간격을 두고 조용히 3번 재시도한다.

### 4. Query 결과는 구조적으로 공유되어서 실제로 값이 변경되었는지 아닌지 감지 할 수 있다. 만약에 변경되지 않은 경우는 reference값이 변경되지 않고 유지 되기 때문에 useCallback 이나 useMemo 도 적극 활용해보면 좋다.

## useMutation

Read 는 useQuery, Create, Update, Delete 는 useMutation을 사용한다.

보통 어떤 리스트에 item을 추가할 때, 서버에 POST 요청하고 response를 받는데 까지 시간이 걸리기 때문에 loader를 붙이는게 자연스럽다.
useMutation를 이용하여 추가시 loader 추가나 리스트에 지연 없이 바로 아이템이 추가된 것 처럼 보여지게 할 수 도 있다.

useMutation은 [호출할 함수, mutation 요청에 대한 정보]을 return 한다.

```js
const [createPost, createPostInfo] = useMutation((values) => axios.post('/api/posts', values, {
  onSuccess: () => { // Mutation이 성공했을 때 다시 posts를 가져오도록 함 실행되는 callback
     queryCache.invalidateQueries('posts')
  },
  onError: (error) => {
    window.alert(error.response.data.messsage)
  },
  onSettled: () => { // onSuccess나 onError와 비슷함.
  // 위의 onSuccess를 정의하지 않고 onSettled에서 호출하도록 하면 에러 발생시에도 다시 query를 해온다.
   queryCache.invalidateQueries('posts')
  }
}))

return (
  <form
    onSubmit={createPost}
    buttonText={
      createPostInfo.isLoading
      ? 'Saving...'
      : createPostInfo.isSuccess
      ? :'Saved'
      : 'Create New Post'}
    />
)
```

```js
const [savePost, savePostInfo] = useMutation(
  values =>
    axios.patch(`/api/posts/${values.id}`, values).then(res => res.data),
  {
    onSuccess: (data, values) => {
      queryCache.setQueryData(['posts', String(values.id)], data) // 변경하고자 하는 값 바로 UI에 만영
      queryCache.invalidateQueries(['post', String(values.id)]) // Data Accuracy를 위해서 다시 refetch
    },
  }
)
```

### setQueryData의 updater function 에서 oldData가 undefined 일 경우

[typeDefinition of updater function in setQueryData
](https://github.com/tannerlinsley/react-query/issues/506)

```ts
queryCache.setQueryData('key', oldData => ({
  ...oldData,
  lastName: 'Smith',
}))
```

oldData가 undefined 일 수 있다는 런타임 에러가 뜬다.
