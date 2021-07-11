---
title: 'Integration test'
date: 2020-07-04 12:21:13
category: 'development'
draft: false
---

### 안정성 있는 integration test 란 뭘까?

현재 integration test가 부족한 부분은 어떤건지?

- 문서 생성 함수를 예로 들면, documentService.createDocument() 의 test 코드는 함수가 실행되면서 생성되어야 하는 함수들이 제대로 생성되는지 체크한다.
  문서는 생성될 때, document data, document resource와 default folder를 함께 생성시킨다. 현재 integration test는 이 데이터들이 firestore에 제대로 저장되었는지 확인한다.
