---
title: 'React Testing Library 맛보기'
date: 2021-11-16 09:16:13
category: 'Test'
draft: true
---

### React Testing Library

RTL로 리액트 컴포넌트를 테스트할 수 있다. 렌더된 리액트 컴포넌트 인스턴스를 테스트하는게 아니라 실제 DOM 노드를 테스트한다. 유저가 보는 동일한 DOM을 쿼리해와서 테스트할 수 있다.
`data-testid` 로 테스트하고 싶은 엘리먼트를 노출 시킬 수 있다.

[Testing Library 사용시 피해야 할 것들](https://testing-library.com/docs/#what-you-should-avoid-with-testing-library)

- 컴포넌트의 [내부 구현 디테일(state, method)을 테스트 하지 말아야 한다](https://kentcdodds.com/blog/testing-implementation-details).
  - 앱 코드가 망가진게 아니라 테스트 코드가 망가진 상황이 발생되어서는 안된다. 구현 코드를 테스트할 경우 코드를 리팩토링 할 때 테스트 코드가 망가져버린다. 불필요하게 테스트 코드에 많은 시간을 쏟게됨
  - `setOpenIndex`가 호출되었을 때 정상적으로 index가 바뀌는지는 테스트 했는데 버튼에 setOpenIndex가 정상적으로 핸들러로 등록되었는지는 확인하지 않는다면 에러가 날 수 있다. 단순히 setState 함수로 state 변경했을때 앱이 정상적으로 동작하는 것만으로 앱이 정상적으로 동작한다고 보장할 수 없음. (false positive: 에러가 발생해야하는데 테스트는 통과함)
  - 자세한 구현사항들은 유저가 어짜피 모르거나 잘 쓰지 않는 것들이기 때문에 테스트 할 필요없다.
- 컴포넌트의 Lifecycle을 테스트 하지마세요.
- 컴포넌트의 자식 컴포넌트를 테스트 하지 마세요!

[위와 같은 내용들을 테스트 하지 않는다면 어떤 것들을 테스트해야할까?](https://kentcdodds.com/blog/testing-implementation-details#implementation-detail-freetesting)
유저에게 보여지는 내용과 유저 액션들을 테스트 해볼 수 있겠다.

예를 들어, 특정 Accodian 컴포넌트가 화면에 그려질 때, 초기 initial state 값에 따라 화면에는 어떤 내용들이 있어야 하고 이 내용은 있으면 안된다. 그리고 user가 특정 엘리먼트를 클릭했을 때는 어떻게 보여져야한다.
