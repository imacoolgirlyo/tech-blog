---
title: 'Async Logic and Data Fetching'
date: 2021-07-12 16:21:13
category: 'development'
draft: true
---

### docker

docker를 써서, 우리의 application code 를 infrastructure와 분리시킬 수 있다. Docker를 사용하면 항상 같은 환경에서 software를 제공할 수 있음

Image의 running Instance가 container임

- Image가 container의 파일 시스템을 포함하고 있기 떄문에, application을 실행시키기 위해서 필요한 모든 것들을 포함하고 있다. (모든 dependencies, configuration, scripts, binaries)

Dockerfile : 우리가 세팅하고 싶은 환경을 dockerfile에 정의해둔다. 이 환경으로 docker Image를 build한다.

docker-compose : - volumes: container의 usr/src/app과 현재 src를 연결 - environment: container에서의 환경 변수 세팅 - ports: 현재 api 9090 포트와 docker 8080 연결

### flags

```
docker run -d -p 80:80 docker/getting-started
```

- `-d` : detached mode(background)에서 container를 실행시킨다.
- `-p 80:80` : host의 80 포트와 container의 80 포트를 mapping 시킨다.
- `docker/getting-started`: 사용할 이미지

docker dashboard에는 현재 machine에서 돌아가고 있는 container들이 보여진다. container 안의 logs들은 container 내부 shell에 접근하여 얻을 수 있다.
