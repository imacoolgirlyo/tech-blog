---
title: '🔑 Data Fetching And React Query'
date: 2021-07-12 16:21:13
category: 'development'
draft: false
---

> Server state and client state are fundamentally different.

Server State:

1. 컨트롤하지 못하는 먼 곳에서 값이 유지됨
2. 데이터를 가져오고 업데이트 하기 위해서 asynchronous APIs가 필요함
3. 공동으로 소유하고 있는 것을 의미하며 사용자 모르게 다른 사람이 변경할 수 있음 (?)
4. 결국에는 앱의 라이브 사이클 동안 outdated 상태가 된다.

이제는 더 이상 이러한 서버 state들을 client state tool에 저장하지 말아야 한다.

- Caching
- 같은 데이터를 여러번 중복 request 요청하는 문제 제거 (중복 제거)
- background에서 오래된 데이터 업데이트 하기
- 데이터가 오래되었을 때 컨트롤함
- pagination이나 lazy loading 같은 최적화
- 서버 state에 대한 memory나 garbage collection 다룸

## React Query

### [알아서 잘하는 refetch]

- user가 다른 탭에 있다가 다시 돌아온 경우에 background refetch가 자동으로 호출되면서 data를 다시 받아온다. 다시 fetch 할 때, 별도의 loading indicator가 보여지지 않는데 만약 새로 받아온 데이터랑 cache된 데이터가 동일하다면 다시 render 하지 않는다.

=> 결국 여러번 fetch 하는 건 동일한 듯..?

### [StaleTime 과 CacheTime]

StaleTime

- Query가 fresh 에서 stale 될 때까지 시간
- Query가 fresh 하다면 네트워크 요청할 필요 없이 **항상** cache 데이터를 가져온다. (네트워크 요청을 할 필요가 없음) 만약에 Query가 fresh 하지 않더라도 cache 데이터를 사용하는데 특정 상황이라면 background refetch가 일어날 수 있다.
- Query 의 관점에서 생각하면 쉬울 듯. 이 Query가 최신 query인지 아닌지 판별하는 기준

궁금증 1

> Folder Query의 StaleTime을 0으로 둬서 한번 Query하고 난 다음에는 이전 데이터라고 인식한다면, 언제 다시 refetch 해올까?

CacheTime

- cache에서 inactive query들이 삭제될 때까지 걸리는 시간 (잠깐 저장해두는 시간)
  - 예를 들어) document 목록을 fetch 해옴. 이때 이 document 데이터들을 cache에 기본적으로 5분 저장해두고 있다. 유저가 그 이후에 30분 동안 계속 workspace에서 작업한다면 5분이 지난 지점에 document의 cache data는 삭제된다. 반면 5분 되기 전에 다시 App으로 넘어갔다면 cache data를 사용하게 된다.
- data 관점에서 이 data를 유효하다고 판단할 때 사용하는 기준

그래서 거의 staleTime을 조정하게 될거고 cache time은 건들 일이 거의 없을 것이다.

query의 key가 변할 때 마다 다시 refetch 하므로 query key를 useEffect의 dependency array 처럼 다루자.

**새로운 cache entry**
