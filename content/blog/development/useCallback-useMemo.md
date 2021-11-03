---
title: 'useCallback, useMemo로 컴포넌트 최적화 하기'
date: 2021-07-11 16:21:13
category: 'development'
draft: true
---

useCallback과 useMemo로 컴포넌트 최적화 한 썰 푼다

기존에 발생하던 문제

- 렌더링이 너무 오래 걸림
- re-render가 자주됨

한 방법
왜 리렌더가 자주 발생하는지 파악

- 부모가 리렌더 될 때 마다 자식들도 매번 리렌더됨
- 부모가 리렌더가 자주 발생함

props로 전달되는 함수의 경우 모두 useCallback으로 감싸주었다. 그리고 자식 컴포넌트의 경우 memo로 감싸서 prop이 변경될 때만 재렌더 되도록 만들어주었다.

이때 주의해야 할 점은 useCallback을 잘 써야 한다는 점이다. prop으로 전달되지 않는 함수는 굳이 useCallback으로 만들어 줄 필요가 없다.
모든 줄의 코드는 실행될 때 비용이 들기 마련이다. useCallback으로 함수를 감싸서 자식 컴포넌트가 불필요하게 재 렌더링되는 걸 막을 수 있다고 하더라도 useCallback으로 감싸기 전 보다 메모리를 더 쓸 수 도 있기 때문에 주의해야 한다.

useCallback이 왜 메모리를 더 쓰게 되는지 간략히 설명해보려 한다.
컴포넌트 내 정의되어 있는 함수는 메모리에 할당된다. 두번째 렌더링 시 이 함수는 garbage collected 되고 다시 새로운 함수가 만들어지게 된다. 만약 useCallback으로 함수를 감싼다면 그 함수는 garbage collected 되지 않고 새로운 함수가 만들어진다. 이는 메모리 측면에서는 비효율적이다.
