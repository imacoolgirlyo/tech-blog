---
title: 'Cloud Firestore'
date: 2019-1-3 16:21:13
category: 'firestore'
draft: true
---

## Firestore로 데이터 가져오기

### 데이터 변경 이벤트 리스너 설정

리스너를 설정하면 Cloud Firestore는 리스너에 데이터의 초기 snapshot을 전송한 뒤, 문서가 변경될 때마다 다른 snapshot을 전송한다.

중요: 첫 번째 쿼리 스냅샷은 쿼리와 일치하는 모든 기존 문서에 대한 added 이벤트를 포함합니다. 쿼리의 초기 상태를 기준으로 쿼리 스냅샷이 현재 상태로 된 변경사항 집합을 가져오기 때문입니다. 따라서 초기 상태를 처리하는 특수한 로직을 추가할 필요 없이 첫 번째 쿼리 스냅샷으로 수신된 변경사항에 따라 직접 UI에 데이터를 입력할 수 있습니다.

### 컬렉션에서 여러 문서 가져오기

```js
  db.collection('cities').where('capital' '==', true)
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data())
    })
  })
```

where() 문을 사용해서 collection 내의 특정 조건을 만족하는 모든 문서를 query 해옴
