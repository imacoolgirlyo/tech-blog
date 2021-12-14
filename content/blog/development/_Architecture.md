### Cloud Run

Google Cloud Platform 중 Cloud Run 서비스로 api, front, puppeteer들을 배포하고 있다. (컨테이너 이미지를 빌드해서 배포)

master branch(스테이징 환경의 코드)에 새로운 코드가 merge가 되면 새로운 API, client 이미지를 빌드해야한다. Github Action을 통해 API 배포를 하고 있는데 cloudrun-api.yml에 배포 준비 과정(npm ci, GCP로 로그인 등), 배포 명령어 실행 등의 내용이 정의되어 있다.

api/Dockerfile 내용으로 docker image를 build 한 후에 Cloud Run에 이 이미지를 배포한다.

Cloud Run 에 필요한 설정들을 terraform으로 관리한다.

### 개발 환경 (Local)

로컬에서는 `docker compose up` 으로 컨테이너를 실행시킨다. 이때 api, proxy, puppeteer, redis, db 이미지가 빌드 된다.
기본적으로 client는 7000번 포트로 실행되나 server port와 동일한 포트를 사용하기 위해서 proxy를 사용한다. (만약 다른 포트라면 개발 시에도 CORS 에러가 남)

localhost:5000으로 요청하면 proxy 서버는 docker host의 8080 포트로 연결을 시킨다.

```
  proxy:
    image: nginx:alpine
    platform: 'linux/amd64'
    volumes:
      - ./nginx_dev.conf:/etc/nginx/conf.d/default.conf
      - ./viewer/:/app/viewer
    expose:
      - '8080'
    environment:
      PORT: 8080
    ports:
      - '5000:8080'
    command: [nginx, '-g', 'daemon off;']
    depends_on:
      - app
```

Nginx는 웹 어플리케이션 서버가 아니라 웹 서버임. 둘의 차이는?
