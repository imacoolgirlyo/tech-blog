---
title: '컴포넌트, 다시 생각하기 리뷰'
date: 2021-11-03 16:21:13
category: 'development'
draft: true
---

https://www.youtube.com/watch?v=HYgKBvLr49c
컴포넌트는 다른 것들에 의존성을 가진다.

- 스타일
- custom 로직
  - 컴포넌트 내에서 사용되는 핸들러(UI 조작)나 컴포넌트에 사이드 이펙트를 줄 떄 사용
  - 보통은 커스텀 훅 형태로 작성
- 전역 상태
  - 현재 UI를 표현하기 위해 유저의 액션을 통해 만들어진 상태
  - 로그인, 전체 메뉴 닫기 등
- Remote data schema
  - API 서버에서 내려보내주는 데이터 모양

이 중 데이터 스키마를 좀 더 중점적으로 본다.
