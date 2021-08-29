---
title: 'createEntityAdapter로 normalized data 만들고 사용하기'
date: 2021-08-29 00:00:00
category: 'Redux'
draft: false
---

> 🔗 참고 자료

- [참고 : Managing Normalized Data](https://redux-toolkit.js.org/usage/usage-guide#managing-normalized-data)
- [참고: createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter)

### Normalized Data 란?

[참고: Normalizing State Shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)

Reducer를 간단하게 만들거나, store 상에 중복된 데이터를 만들지 않기 위해서 데이터를 Normalizing 하는게 매우 중요하다.

아래와 같이 id들의 배열, key를 id, value는 data로 저장한다면 Normalized Data 라고 볼 수 있다. 조금 더 살펴보자.

```js
{
  ids: ['project1', 'project2'], // 각 데이터(Record)들의 id 들의 배열
  entities: {
    project1: { name: '첫 프로젝트'},
    project2: { name : '두번째 프로젝트'}
  } // key는 id, value는 data로 한 entities
}
```

**특징**

- 각 type의 data는 state 내에서 자신만의 `table` 이 있어야 한다.
- 이 table에 데이터를 저장할 때는 항상 key가 `id`이고 value는 `data`인 형태로 저장한다.
- 각 item의 reference는 항상 id여야 한다.
- id들의 array는 정렬 순서를 나타내야 한다.

💡 **한 Entity의 data가 여러 곳에서 사용되는 경우 Normalized Data 형태로 저장하는 게 이후에 중복된 데이터를 만들지 않을 수 있다.**

배열 형태로 저장된 데이터의 경우 특정 item을 찾기 위해서는 매번 array의 loop을 돌아서 찾아야한다. 이는 수백, 수천개의 데이터가 있지 않는 이상 성능에 크게 영향을 주진 않지만 특정 item을 찾는 작업은 매우 빈번하게 일어나기 때문에 이를 쉽게 하는 건 매우 중요하다!

Normalized Data의 경우, 각 item들의 reference가 id이니 id를 안다면 item을 쉽게 찾을 수 있다.

## Redux의 createEntityAdapter

createEntityAdapter 를 사용하면 data를 Normalized 한 형태로 저장할 수 있다.
이 Adapter는 고맙게도 기본 [CRUD reducer](https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions)와 [selector](https://redux-toolkit.js.org/api/createEntityAdapter#selector-functions)를 제공해주는데 이를 이용한다면 데이터를 mutate 하는 경우에도 쉽게 Normalized 형태를 유지할 수 있다.

## Initial Data 설정

### initialState에 mock data 추가하기

```js
const mockData = [
  {
    projectId: 'projectId1',
    name: 'First Project',
    numDocuments: 3,
  },
  {
    projectId: 'projectId1',
    name: 'First Project',
    numDocuments: 4,
  },
]

const emptyInitialState = projectAdapter.getInitialState()
const filledState = projectAdapter.upsertMany(emptyInitialState, mockData)

const projectSlice = createSlice({
  name: 'projects',
  initialState: filledState,
  reducers: {},
})
```

### add, remove 후에도 정렬된 상태 유지하려면?

#### sortComparer 사용하기

```js
const booksAdapter = createEntityAdapter({
  // allIDs array가 항상 title을 기준으로 정렬되도록 한다.
  sortComparer: (a, b) => a.title.localeCompare(b.title),
})
```

두 Entity를 받아서 Array.sort 사용시 기준 값이 되는 -1, 0, 1 을 리턴한다.

- 만약 이 함수가 주어진다면 entity objects 값을 항상 이 기준대로 정렬해서 state.ids 배열을 정렬 상태로 유지한다.
- sortComparer를 설정해놓지 않으면 state.ids는 정렬 상태를 유지 하지 않는다.

<!-- > 항상 state.ids를 정렬상태로 유지하고 싶어서 sortComparer를 사용하려 했으나, 순서를 linkedList를 사용하는 바람에 이 함수를 사용하지 못했다.
> (각 item에 prev, next 값이 있다하더라도, 두 Entity의 prev, next만 비교한다고 item이 한 Entity보다 앞일지 뒤일지 알지 못한다. 전체 items들이 있어야 비로소 순서를 알게됨) -->

### [여러 데이터 추가하기](https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions)

createEntityAdapter를 사용하여 하나의 Entity를 `{ ids: [], entities: {}}` 형태로 store에 저장하는 경우, createEntityAdapter가 제공하는 CRUD function으로 쉽게 이 상태를 유지해서
데이터를 추가, 삭제, 업데이트 할 수 있다.

```js
// entities 에 저장되는 데이터 형태
const record = Record<EntityId, T> {
  id,
  name,
  numDocuments
  // 등
}
```

- setAll 는 entity content 안에 있는 모든 데이터들을 없애고 payload로 들어온 데이터로 replace 시킨다.

  ```js
    projectsReceived(state, action){
      projectAdapter.setAll(state, action.payload)
    }

    // 컴포넌트에서는

    const getProjects = (projects) => {
      const allProjects = await service.getProjects() // 위의 mockData 형태와 동일
      dispatch(projectsReceived(allProjects))
    }
  ```
