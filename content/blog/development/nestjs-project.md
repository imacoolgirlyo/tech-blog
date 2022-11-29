목표

- Controller, Service, Repository 의 역할을 이해하고 각 역할에 맞는 코드를 작성할 수 있다.
- NestJS의 Module, Provider 개념을 다시 이해 ✅
- Backend Project를 from scratch 로 build 후 배포까지 진행해본다.
- 11/30까지 Create, Read application 작성 ✅

## Learned

- `nest-cli`로 기본 project scaffold를 잡았다.
- `NestFactory`에 ApplicationModule을 전달하면, 해당 application module을 root Module로 보고 dependency graph를 읽고 Dependency Injection을 진행하면서 class들을 instance화 한다.
- `Module`은 NestJS에서 하나의 어플리케이션 블럭 구조를 만들 수 있는 단위. 이 모듈을 이루는 여러 dependency들을 적어두면 이 후 module들과 provider의 관계와 의존성을 파악하여 최종적으로 dependency graph가 만들어진다.
- Module을 만드는 기준은 도메인(Feature) 중심이다. 예를 들어 `CatsController`, `CatsService`를 하나로 만들면 특정 feature를 중심으로 모듈을 만든 것이기 때문에 boundary를 좀 더 명확하게 설정할 수 있다는 장점이 있다.
  - domain 별로 모듈을 만들면 SOLID 원칙을 기반으로 확장시킬 수 있다는데 그 이유는 뭐지?
  - 여기서 말하는 boundary가 어떤걸까?
- Nest에서 모든 모듈들은 기본적으로 싱글톤임
  - 왜 싱글톤으로 만들어야하나?
  - 다른 모듈에서도 동일한 인스턴스를 사용하기 위해서
  - 왜 동일한 인스턴스를 사용해야하나?
- 다른 모듈에서 Module 내의 특정 Service인 CatsService를 사용하려면 Module에서 해당 service를 export 해야한다.
  - providers에 등록하지 않은 것도 export 가능한가?
- 가장 바깥쪽 개념: Module. 도메인 관련된 작업들을 하나로 묶어주는 역할을 함
  - 새로운 도메인이 추가되었을 때, 어떤 순서로 작업하는게 편할까? controller? test ? service? ...
- Nest에서 대부분의 class는 Providers라고 보면 된다. service 부터 repository, factory, helper 등등
- provider의 특징은 어디서나 주입될 수 있는 형태이기 때문에 '제공자' 라는 이름이 붙여졌다. provider 클래스에서 제공하는 기능들이 다른 클래스에서 필요한 경우 해당 기능들을 가져오기 위해서 필요한 클래스에 주입된다.
  - Controller는 HTTP request들을 다뤄야하고 나머지 복잡한 일들은 provider에게 맡김. 주로 service layer에게 해당 일들을 맡기고 이 service class는 module에서 providers 라는 property에 정의된다.
- CatsService라는 service에는 @Injectable()이라는 데코레이터가 붙는데 <- 얘는 metadata를 붙여준다. '나는 injectable 하며, provider의 역할을 한다'라는 내용을 추가해줌

- `nest g modules boards` 라는 cli로 쉽게 모듈을 만들 수 있음
  - 알아서 boards module이 appModule에 imports 됨ㅎㅎ
- class constructor의 파라미터에 접근 제한자(private, protected, public)을 사용하면 알아서 접근 제한자가 사용된 파라미터는 클래스의 property로 선언이 됨
- NestJS에서는 request를 가져올 때 @Req 데코레이터를 사용함. 왜지?
- request.body로 http request 내의 body에 접근 가능
- 내 local에 postgresql을 설치하고 싶지 않아서 docker container로 app을 만들고, postgresql 까지 연동시켜서 사용해보려함

- dockerize 하는 법
- 검색: How to dockerize node app
  - https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
  - 먼저 Dockerfile을 만들어야한다.
    - application image를 어떻게 만들지 Dockerfile에 정의
  - `FROM node:16` NodeApp이니 제일 처음 base image를 node 16 버전으로 가져온다.
  - `WORKDIR /usr/src/app` 우리가 만든 어플리케이션 코드가 위치하게될 directory를 만든다. 우리가 만들려고 하는 image 내에 /usr/src/app 에 app code가 들어가게됨. working directory가 된다.
    - 추후에 image를 build 후 container를 실행시키면 container 내부로 들어갈 수 있는데 이때 정의해준 working directory path로 들어가게 된다. (docker-exec.png 참고)
  - node도 가져오고, npm도 설치 되었으니 app dependency들을 npm binary로 설치해야한다.
  - `RUN npm install`로 working directory에 dependency들을 설치한다.
    - 전체 app code를 다 가져오는게 아니라 package.json 만 가져오는데 이렇게 하면 Docker layer에서 cached 할 수 있다.
    - 어떻게 cached 되는지는 좋은 포스트가 있으나 일단 dockerize 먼저..
  - `COPY . .` docker image에서 app의 소스코드를 번들하기 위해서 COPY 사용
    - 이름이 COPY인데 왜 번들을 한다는 걸까? 음
  - `EXPOSE 3000` 3000 포트로 바인딩을 시켜야한다. EXPOSE를 사용하면 docker daemon이 알아서 docker container를 3000으로 바인딩 시킨다.
    - 이 개념이 맞나? 좀 헷갈리니까 다시 보기
  - `CMD ['npm', 'start']` 서버 시작
  - 이제 Time to build!
  - `docker build . -t imacoolgirlyo/nestjs-board`
  - 주의: docker daemon을 실행 시켜야함
    - docker daemon이 뭐임? : Docker architecture는 client <-> server 구조로 되어 있다. docker server 인 Docker Daemon은 client의 요청에 따라 도커 object들 (images, containers, volumes 등)을 관리하는 일을 한다. docker client는 `docker run`, `docker pull`, `docker build` 같은 Docker API를 사용해 docker daemon에게 request를 보낸다.
    - Docker client와 daemon은 같은 시스템 내에 있을 수 있고 리모트 Daemon을 사용할 수 도 있다. Docker desktop을 설치하면 Docker client와 daemon이 같이 제공된다.
    - https://docs.docker.com/get-started/overview/#docker-architecture
- .dockerignore에서 node_modules을 추가해놓으면 docker image에 의해서 copy 하지 않고, image내에 설치된 module들을 다시 overwriting 하지 않음

docker image 만들었음. 어떻게 Run 시키나?

- 일단 내가 만든 이미지를 볼려면 `docker images`로 모든 이미지 리스트 가져오기
