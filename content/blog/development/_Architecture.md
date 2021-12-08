### Cloud Run

Cloud Run 으로 컨테이너 이미지들을 배포한다. 현재 배포하는 이미지는 api, front, puppeteer 이렇게 세 컨테이너를 배포한다.

master branch(스테이징 환경의 코드)에 새로운 코드가 merge가 되면 새로운 API, client 이미지를 빌드해야한다. Github Action을 통해 API 배포를 하고 있는데 cloudrun-api.yml에 배포 준비 과정(npm ci, GCP로 로그인 등), 배포 명령어 실행 등의 내용이 정의되어 있다.

api/Dockerfile 내용으로 docker image를 build 한 후에 Cloud Run에 이 이미지를 배포한다.

Cloud Run 에 필요한 설정들을 terraform으로 관리한다.
