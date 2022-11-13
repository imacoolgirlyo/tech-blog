---
title: `npm i module -g` 후 Command Not Found 에러를 마주했다면?
date: 2022-11-13 00:11:21
category: development
thumbnail: { thumbnailSrc }
draft: true
---

개요 >

- `npm install vercel -g` -> `vercel` 명령어가 없음
  `command not found:vercel` 에러가 뜬다. 방금 설치했는데 왜 command가 없다는 에러가 발생할까?

- 컴터에는 shell 명령어에는 vercel이 없음
  - shell은 무엇?
- vercel 파일이 저장된 곳을 shell이 알도록 PATH를 추가해줘야함
- 추가하는 방법: vercel이 저장된 곳의 PATH를 shell이 시작하는 .zshrc에 추가 -> source .zshrc로 shell 변경 사항 적용
- 확인하는 방법: echo \$PATH

번외.

- local에서 npm install시 node_module이 설치가 된다.
- 이때 script에 `dev: next dev` 명령어가 있을 경우 `npm run dev` 면 정상 동작하나, 직접 `next dev` 라는 명령어를 치면 왜 에러가 나는 걸까?
