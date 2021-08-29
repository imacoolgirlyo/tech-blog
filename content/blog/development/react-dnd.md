---
title: 'React DnD 사용해서 특정 카드의 순서 변경하기 '
date: 2021-08-27 16:21:13
category: 'development'
draft: true
---

### Card UI 순서 변경 하기

React DnD가 sortable한 리스트를 만들 수 있게 해준다. 드래그 할 아이템을 drag source이기도 하고 drop target 이기도 한 놈으로 만들고 hover handler에서 reorder를 해주면 된다.
(hover handler에서 reorder 처리를 해주지 않았는데, 결국 라이브러리를 쓰려면 공식 문서는 최대한 자세히 읽어야..;)

drag 도중에 어떻게 순서를 reorder 시키는지, sort는 어떻게 기준을 잡는지?

data의 sort 정렬 기준을 prev, next로 저장시키면 다른 데이터의 prev, next와 비교하지 못한다. 이는 linked list 에 연결된 모든 데이터를 알지 않는 이상 나의 위치를 알 수 없게된다.
순서 변경하는 로직을 제외하고도 추가, 삭제하는 경우에 항상 그 아이템과 관련된 prev, next 값을 변형시켜야하기 때문에 로직 내에서 error를 발생시킬 가능성이 너무 높다.

또한 아이템을 특정 위치에 drop 한 다음 해당 UI가 업데이트 되기까지 시간이 좀 걸릴 수 있는데 (이것도 문제) 이 시점에 store data가 업데이트 되기 전의 데이터를 사용한 카드가 또 dragging 되는 경우 linked list 데이터를 pollute 시킬 가능성이 너무 커진다.
