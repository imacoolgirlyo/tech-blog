---
title: 'UI 와 Response data'
date: 2021-07-11 16:21:13
category: 'development'
draft: true
---

### 고민

- 현재 firestore에 저장된 data, Typed client 내에서 사용하는 data (redux store) 의 구조
- 이 구조의 문제 및 한계점
  - service 함수 실행해서 db data는 업데이트 시켜줬지만, UI에는 반영되지 않았기 때문에 UI를 업데이트 시키는 로직을 실행시킨다. redux의 action을 dispatch하여 store 데이터를 변경시키거나 업데이트 한 데이터를 다시 query 하여 해당 데이터를 store에 반영 시킨다.
  - 이 구조를 따른 이유는 db 업데이트한 결과를 그대로 가져오기 위해서 였고, 이 구조의 문제점은 firebase 내에서 처리가 늦어지는 경우 그 만큼 UI가 업데이트 되는데 느리게 느껴졌다. 사용자에게 '느리다' 라는 느낌을 주기 충분한 딜레이 속도였다.
  - 따라서 다시 query 해서 해당 데이터를 받아오지 않고 dispatch 하여 UI를 업데이트 하고, service 로직을 실행시켰다.

### 더 좋은 방법은 없을까?

- 다른 서비스 혹은 코드에서는 이러한 문제를 어떻게 해결하고 있는지 알아보자. 최소 10가지 패턴 정도는 알아보자!

## React-query 사용

- [Common data fetching patterns for real apps with react-query](https://medium.com/nerd-for-tech/common-data-fetching-patterns-for-real-apps-with-react-query-4b83188a95c1)
  - 이 글은 데이터를 조작, query 해서 컴포넌트 업데이트 하는 것까진 다루지 않고 단순히 react-query 사용법만 다룸

## Redux : [Async Logic and Data Fetching](https://redux.js.org/tutorials/essentials/part-5-async-logic)
