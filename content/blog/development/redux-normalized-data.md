---
title: 'Redux store에 normalized data 형태로 데이터 저장하기'
date: 2021-10-11 00:00:00
category: 'Redux'
draft: false
---

Typed의 client에서는 redux store에 data를 저장하여 관리하고 있습니다. Typed에서는 여러 도메인 data 간의 관계성이 크기 때문에 store에 데이터를 어떻게 저장할지가 매우 중요한데요. 처음 store 구조 설계시 이 점이 고려되지 못한 채로 설계되어 UI를 업데이트 하기 위한 로직을 만들 때마다 복잡한 reducer를 만들어야했습니다. 또한 같은 데이터 인데도 불구하고 여러 data 속에 분산 되어 저장되었기 때문에 모든 값에 변경 사항이 적용되지 않는 문제도 있었습니다.

Redux toolkit 이 제공해주는 createEntityAdapter를 활용하여 데이터를 Normalized State 형태로 저장하여 문제를 해결해봤습니다.

### **Normalized Data란?**

Normalization은 관계형 Database 설계시 사용되는 개념입니다. (참고 : [Database normalization](https://en.wikipedia.org/wiki/Database_normalization)) Store 에 데이터를 저장할 때도 이를 적용시킬 수 있는데요. data를 Normalizing 한다는 건 아래 사항들을 고려해 디자인하는 걸 의미합니다.

- 모든 타입의 데이터는 자신만의 table을 갖는다.
- data table에는 개별 item들이 한 object 안에 저장되는데 item의 `id`가 key로 value가 `item data` 인 형태로 저장되어야한다.

  ```js
  entities: {
   1: {
  		id: 1,
  		title: ‘Normalizing Data’,
  		author: ‘Diana’
  	},
   2: {
  		id: 2,
  		title: 'webpack 설정',
  		author: ‘Darren’
  	}
  }
  ```

- 각 item들은 반드시 item들의 unique한 id로 참조할 수 있어야 한다.
- id들의 array는 반드시 item들의 순서를 나타내야 한다.
  ```js
  ids: [1, 2]
  ```

## 예시

projects 데이터를 예제로 Normalized Data와 그렇지 않은 데이터 구조를 비교해보겠습니다.

```js
// Normalized 되지 않은 data
;[
  {
    projectId: project1,
    name: 'Blog 글',
    documents: [
      {
        id: 1,
        title: 'Normalizing Data',
        author: 'Diana',
      },
      {
        id: 2,
        title: 'Webpack 설정',
        author: 'Darren',
      },
    ],
  },
  {
    projectId: project2,
    name: 'Study',
    documents: [
      {
        id: 3,
        title: 'ES6 Features',
        author: 'Diana',
      },
      {
        id: 4,
        title: 'Git Resources',
        author: 'Diana',
      },
    ],
  },
]
```

위와 같이 projects 내에 documents 데이터가 nested 된 형태로 store에 저장된다고 가정해봅시다.

데이터가 nested 되었다는 건 이를 변경하는 reducer도 복잡해진다는 걸 의미합니다. 특정 document 의 `title`을 변경하려면 document가 포함된 프로젝트의 `projectId`도 알아야하며 그 project 내의 documents array를 모두 돌아 변경하고자 하는 데이터를 찾아내 변경해야합니다. Spread Operator를 사용해 상위 데이터 값을 복사하며 새로운 state를 만드는 것도 번거롭겠죠.

물론 array 내에 특정 data를 찾는 건 item이 수백, 수천 개 있지 않는 이상 성능 이슈가 발생하진 않지만 데이터를 읽고 변경하는 일은 빈번하게 일어나기 때문에 이를 쉽게 만드는 건 매우 중요합니다.

아래의 데이터는 Nested 데이터를 Normalizing 한 형태입니다.

```js
projects : {
  ids: [project1, project2],
  entities: {
    project1: {
      projectId: project1,
      name: 'Blog 글',
      documents: [1, 2],
    },
    project2: {
      projectId: project2,
      name: 'Study',
      documents: [3, 4],
    },
  },
}


documents:  {
  ids: [1, 2, 3, 4],
  entities: {
    1: {
      id: 1,
      title: 'Normalizing Data',
      author: 'Diana',
    },
  },
  ...
}
```

먼저 projects와 documents는 다른 domain data이기 때문에 다른 table로 분리해서 저장합니다.

데이터의 id만 있다면 array의 loop를 돌지 않고도, O(1)로 데이터를 찾을 수 있습니다. 데이터를 쉽게 찾을 수 있다는 건 이를 변경하는 reducer 로직도 간단해지는 걸 의미합니다.

## createEntityAdapter로 Normalized data 쉽게 만들기

redux-toolkit의 createEntityAdapter를 사용하면 Normalized 형태를 쉽게 만들 수 있으며 데이터 추가 및 변경 시 Normalized 형태를 유지하기 쉽습니다.

createEntityAdapter는 initial State를 ids와 entities 형태로 만들어줄 뿐만 아니라, 기본적인 CRUD reducer와 selector 또한 제공해줍니다.

### `projectAdpater.getInitialState()`로 Initial State 생성

```js
// projects.slice.js
import { createEntityAdpater } from '@reduxjs/toolkit'

const projectsAdapter = createEntityAdapter()
const projectsSlice = createSlice({
  name: 'projects',
  initialState: projectsAdapter.getInitialState(),
})

// initial State
{
  ids: [],
  entities: {}
}
```

### Reducer로 사용할 수 있는 기본적인 CRUD Function 제공

```js
const projectsSlice = createSlice({
  // ...생략,
  reducers: {
    projectsReceived (state, action) {
      const { projects } = action.payload
      projectsAdapter.setAll(state, projects)
    },
    projectsRemoveOne: projectsAdapter.removeOne,
  },
})

// action dispatch 시
dispatch(
  projectsReceived([
    {
      projectId: 'project1',
      title: 'Normalized Data',
      documents: [1, 2],
      author: 'Diana',
    },
    {
      projectId: 'project2',
      title: 'Webpack 설정',
      documents: [3, 4],
      author: 'Darren',
    },
  ])
)

dispatch(projectsRemoveOne('project1')) // ids와 entities 모두에서 삭제
```

`projectsAdapter.setAll` 외에도 entities에 값이 없을 때만 추가해주는 `addOne`, `updateOne`, 여러 개의 entities 값을 한번에 변경하는 `updateMany` 등의 다양한 function을 제공해줍니다.

### Selector Functions

projects의 모든 data 가져오기 selectorAll
id로 특정 data만 가져오는 selectorById 등을 제공해줍니다.

```js
// projects.slice
export const projectSelectors = projectAdapter.getSelectors(
  state => state.projects
)

// selector 호출시
const projects = useSelector(projectSelectors.selectAll)
const project1 = useSelector(projectSelectors.selectById('project1'))
```

`createEntityAdapter`에서 제공해주는 여러 function들을 통해 Normalized State 형태를 유지하

### 참고

- [createEntitiyAdapter | Redux
  ](https://redux-toolkit.js.org/api/createEntityAdapter)
- [Normalizing State Shape | Redux](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)
- [Normalizing Redux state to ensure good performance in React apps](https://blog.saeloun.com/2021/09/23/normalize-redux-state.html)
