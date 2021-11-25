---
title: '[RTL] 시작'
date: 2021-11-16 09:16:13
category: 'Test'
draft: true
---

### [afterEach(cleanup)](https://jestjs.io/docs/tutorial-react#react-testing-library)

```ts
import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';

afterEach(cleanup);

it('CheckboxWithLabel changes the text after click', () => {
  ...테스트
});
```

cleanup afterEach는 testing 라이브러리가 자동으로 실행시켜준다. 테스트가 끝난다음에는 컴포넌트를 Unmount 시키고 DOM을 정리함
