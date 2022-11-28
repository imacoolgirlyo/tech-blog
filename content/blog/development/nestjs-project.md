목표

- Controller, Service, Repository 의 역할을 이해하고 각 역할에 맞는 코드를 작성할 수 있다.
- NestJS의 Module, Provider 개념을 다시 이해
- Backend Project를 from scratch 로 build 후 배포까지 진행해본다.
- 11/30까지 Create, Read application 작성

## Learned

- `nest-cli`로 기본 project scaffold를 잡았다.
- `NestFactory`에 ApplicationModule을 전달하면, 해당 application module을 root Module로 보고 dependency graph를 읽고 Dependency Injection을 진행하면서 class들을 instance화 한다.
- `Module`은 NestJS에서 하나의 어플리케이션 블럭 구조를 만들 수 있는 단위. 이 모듈을 이루는 여러 dependency들을 적어두면 이 후 module들과 provider의 관계와 의존성을 파악하여 최종적으로 dependency graph가 만들어진다.
- Module을 만드는 기준은 도메인(Feature)을 중심이다. 예를 들어 `CatsController`, `CatsService`를 하나로 만들면 특정 feature를 중심으로 모듈을 만든 것이기 때문에 boundary를 좀 더 명확하게 설정할 수 있다는 장점이 있다.
  - domain 별로 모듈을 만들면 SOLID 원칙을 기반으로 확장시킬 수 있다는데 그 이유는 뭐지?
- Nest에서 모든 모듈들은 기본적으로 싱글톤임
- 다른 모듈에서 Module 내의 특정 Service인 CatsService를 사용하려면 Module에서 해당 service를 export 해야한다.
  - providers에 등록하지 않은 것도 export 가능한가?
- 가장 바깥쪽 개념: Module. 도메인 관련된 작업들을 하나로 묶어주는 역할을 함
  - 새로운 도메인이 추가되었을 때, 어떤 순서로 작업하는게 편할까? controller? test ? service? ...
- Nest에서 대부분의 class는 Providers라고 보면 된다. service 부터 repository, factory, helper 등등
- provider의 특징은 어디서나 주입될 수 있는 형태이기 때문에 '제공자' 라는 이름이 붙여졌다. provider 클래스에서 제공하는 기능들이 다른 클래스에서 필요한 경우 해당 기능들을 가져오기 위해서 필요한 클래스에 주입된다.
  - Controller는 HTTP request들을 다뤄야하고 나머지 복잡한 일들은 provider에게 맡김. 주로 service layer에게 해당 일들을 맡기고 이 service class는 module에서 providers 라는 property에 정의된다.
- CatsService라는 service에는 @Injectable()이라는 데코레이터가 붙는데 <- 얘는 metadata를 붙여준다. '나는 injectable 하며, provider의 역할을 한다'라는 내용을 추가해줌
