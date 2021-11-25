---
title: '[Jest Cheating Sheet] Jest Timer'
date: 2021-11-25 09:16:13
category: 'Test'
draft: true
---

### [Jest Run All Timers](https://jestjs.io/docs/timer-mocks#run-all-timers)

```js
test('calls the callback after 1 seconds', () => {
  const timerGame = require('../timerGame')
  const callback = jest.fn

  timerGame(callback)

  expect(callback).not.toBeCalled() // 아직 callback 이 실행되지 않음

  jest.runAllTimers() // timer 실행

  expect(callback).toBeCalled()
  expect(callback).toHaveBeenCalledTimes(1)
})
```

1초 뒤에 특정 callback을 실행시키는 timeout을 테스트하려할 때, 타이머가 실행되었다는 걸 보장시켜주기 위해서 `jest.runAllTimers()` 를 사용할 수 있음
