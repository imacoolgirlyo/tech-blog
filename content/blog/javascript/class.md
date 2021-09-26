---
title: '[js] Class와 상속(extends), super'
date: 2021-09-26 16:21:13
category: 'javascript'
draft: false
---

## Class의 상속

javascript에서는 `extends`를 이용하여 Class를 상속받을 수 있다. 부모 클래스에 있는 메소드를 그대로 사용할 수 도 있고, 이를 토대로 확장해서 쓸 수 도 있다.

```js
class Resource {
  constructor ({ name, description, createdAt }) {
    this.name = name
    this.description = description
    this.createdAt = createdAt
  }

  changeName (newName) {
    this.name = newName
  }

  renderCreatedAt () {
    console.log(this.createdAt)
  }
}

class UrlResource extends Resource {
  constructor (args) {
    super(args)
    this.url = args.url
  }

  changeUrlInfo (newUrl) {
    super.changeName(`edited-${newUrl}`)
    this.url = newUrl
  }
}
```

### js의 class는 prototype 기반으로 동작

클래스에 정의되지 않은 method나 값을 참고하려 했다면, prototype에 해당 메소드가 정의되어 있는지, `prototype[[Prototype]]` 에 정의되어 있는지 계속 chain을 확인하며 메소드를 찾는다.

```js
const naverUrl = new UrlResource({..., url: 'naver.com'})
naverUrl.renderCreatedAt() // 에러가 나지 않음
```

UrlResource에는 `renderCreatedAt` 이라는 함수가 정의되지 않았는데도 에러가 나지 않는데, 이는 상속받은 Resource class에 함수가 정의되어 있기 때문이다.
naverUrl 객체와 prototype에 해당 메소드가 정의되지 않았기 때문에 `UrlResource.prototype[[Prototype]]` 인 Resource.prototype를 살펴볼 것이다. renderCreatedAt이 Resource에 정의되어 있으므로 이를 사용할 수 있다.

## Overriding

### Method Overriding

`class UrlResource`는 `class Resource`에 있는 메소드를 그대로 상속받는다. UrlResource에서 `renderCreatedAt` 함수를 별로도 정의한다면 상속받은 메서드가 아니라 자체 메서드를 사용하게 된다.

만약 상속메서드를 토대로 자체 메서드를 만들고 싶다면 `super`를 이용할 수 있다.

```js
// Class UrlResource 내
changeUrlInfo (newUrl) {
  super.changeName(`edited-${newUrl}`)
  this.url = newUrl
}
```

super를 사용해서 부모 클래스에서 정의된 `changeName`을 사용할 수 있다.

### 생성자 Overriding

super(...)는 부모 Constructor를 호출하는데, 이는 자식 Constructor 내부에서만 사용 할 수 있다.

자식 클래스의 생성자에서는 항상 `this.`를 쓰기 전에 super를 호출해야 한다. 일반 객체의 경우 `new`로 인스턴스화 할 때 새로운 객체가 만들어지고 this로 정의한 값들이 바로 추가 되지만, 상속 클래스(자식 클래스)로 만들어진 객체는 부모 클래스의 constructor가 새로운 object를 만들어서 this 값을 할당해주길 기대한다.

그래서 super(...args) 부모 생성자를 호출하지 않는다면 새로운 객체가 만들어지지 않게 되기 때문에 반드시 this로 접근하기 전에 super()를 호출해야한다.

```js
class UrlResource extends Resource {
  constructor (args) {
    super(args) // Resource의 constructor가 새로운 객체 {} 를 만들고 여기에 this.name, this.description 등을 추가해줌
    this.url = args.url
  }
}
```

만약 자식 클래스에 별도의 constructor를 정의하지 않는다면 내부에서 자동으로 만들어지고, super를 호출한다.

```js
class UrlResource extends Resource {
  // constructor(args){
  //   super(...args) <- 자동으로 만들어짐!
  // }
}
```
