- repository에는 db에 data를 저장하거나 변경하는 로직
- 그 이외의 비즈니스로직은 service layer에서 정의
- 예를 들어서 하이라이트를 저장하려고 하는데, 하이라이트가 존재하는지 존재하지 않는지 확인하는 로직이 필요하다. 이 로직은 repository 로직 내에서 정의하는 게 아니라 하이라이트를 할 수 있는 유저는 그 리소스를 가지고 있는 유저 라고 우리가 정의한 것이기 때문에 이는 비즈니스 로직이라고 보고 service layer에서 정의해야 한다.

https://github.com/business-canvas/typed-app/pull/1184/files#r704515036
