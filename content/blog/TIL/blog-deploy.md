## DRAFT Gatsby에 대해서 알아보자. 내 블로그 설정 값 바꿔보기!

이 블로그는 Netflify 를 사용해서 배포하고 있다. 별도의 설정 없이 글만 작성해서 push 하면 알아서 배포된다.

### Jamstack 과 Gatsby

Gatsby 에 의해서 만들어졌다. Gatsby는 Static site generator로 컨텐츠 데이터들을 array로 가져올 수 있는 GraphQL API를 사용한다.
JS 번들 사이즈도 최적화 시켜주고 preloading 이나 브라우저 최적화를 시켜준다는 장점도 있다. 이는 Jamstack의 장점이기도 하다.

[여기서 잠깐. Jamstack이라는 건 뭘까?](https://www.learnwithjason.dev/blog/wtf-is-jamstack/)
web 아키텍쳐 중에 하나인데 이는 여러 static assets들을 빌드타임에 캐시 해놓고 이 것들을 CDN에 배포해놓는다. 그리고 data를 받아오기 위해서 클라이언트 JS 코드로 서드파티 툴들 호출한다.
아키텍쳐가 미리 구성되어 있으니까 빠르게 확장시키기거나 보안성을 높일 수 있다는 장점이 있다. 우리가 알고 있는 MERN stack 같은 그런 스택은 아니고 JavaScript, APIs, Markup의 약자이다.
어떻게 web을 만들어야 하는지를 알려주는 아키텍쳐라고 생각하면 될거 같다.

큰 틀이라고 생각할 수 있는 아키텍쳐 룰은 다음과 같다.

- assets들은 request time이 아니라 build 타임에 전달된다. 이미 유저에게 전달되는 시점에 필요한 assets들이 전달되니 기다릴 필요가 없다.
- app은 server가 아니라 CDN(Content Delivery Network)에 배포가 된다. CDN을 통하는게 비싼 서버를 사용하는 것보다 합리적이다 (와이)
- Deployments ship atomic, static assets instead of dynamic, derived assets.
  유저에게 전달되는건 하나의 온전한 static 앱이다. 빌드된 후에는 다시 수정될 일이 없는 데이터들이다. 이 말은 이전 버전으로의 롤백이 쉽다는 의미이기도 하다.
- monolithic한 서버 대신에 APIs나 serverless functions들로 인터렉션이 이루어진다.

Gatsby

Gatsby는 위의 잼스택의 특징들 + GraphQL로 어떤 data든지 가져올 수 있다는 특징이 있다. 여기서 말하는 소스 데이터란 file 시스템 내의 data일 수 있고 DB의 데이터 일 수 있다.

내 GraphQL layer에 어떤 데이터들이 있는지 확인하려면

```
gatsby develop
```

후 `http://localhost:8000/___graphql` 에서 확인할 수 있다.

근데 안보이네..보고싶다..

[What is Gatsby?](https://www.netlify.com/blog/2020/06/25/gatsby-101-features-benefits-and-trade-offs/?_ga=2.35328801.1053342431.1637071923-237983580.1612282587)
