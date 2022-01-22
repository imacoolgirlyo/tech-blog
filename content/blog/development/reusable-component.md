---
title: '재사용 가능한 Element 컴포넌트 만들기'
date: 2022-01-22 15:42:13
category: 'development'
draft: true
---

### 현재 구조에서 재사용 가능한 컴포넌트를 만들기 어려운 이유.

현재 만들어 놓은 FlatButton은 이미 기본 스타일이 있다. 새로운 버튼을 만들기 위해서 이 컴포넌트를 그대로 사용하려 했더니 가지고 있던 padding, font-size 등을 모두 바꿔야 했다. 디자인 스펙 자체가 고정되어 있지 않다보니까 재사용할 수 있는 엘리먼트 자체를 만드는게 무의미 했다.

```js
const FlatButtonContainer = styled.button`
  position: relative;
  border-radius: 5px;
  padding: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${colors.darker4()};
  }
`
```

### 그럼 만약 만든다면 재 사용할 수 있는 형태는 어때야 하는 건가?

버튼 마다 기본적으로 width랑 height, border-radius 값이 모두 다를 수 있다. 그럼에도 불구하고 아래와 같은 형태는 공통된 특징들을 가지고 있는데 모두 아이콘과 이름이 중앙 정렬 되어 있다는 점이다. 또한 버튼을 hover 했을 때, bgColor가 변한다거나 fontColor, iconColor가 변한 다는 점도 특징 중에 하나다.

재 사용 할 수 있는 컴포넌트를 만들어야 하는 또 하나의 이유는 동일한 디자인이라면, 중복 코드를 작성하지 않고 빠르게 컴포넌트를 만들 수 있기 때문이다.
그럼 매번 똑같은 코드를 작성하지 않으면서 새로운 버튼을 만들 때도 쉽게 가져다가 쓸 수 있는 형태라면 어때야 할까?

```js
return(){
    <TypedIconButton
        icon={<RocketIcon isActive={isActive} />}
        name='창업가'
    />
}
```

아이콘과 이름이 중앙 정렬 된 상태의 버튼이라면 이렇게 만드는게 이후에 가져다 쓰기 편할 것이다. 근데 아까 얘기했던 것 처럼 TypedIconButton에 width랑 height, padding 등의 값들이 다르다면 어떻게 해줘야 할까? 여러 방법들이 있을거 같은데 가장 쓰기 편한 형태를 찾아보자.

### | 조건

- width, height, color 등이 다 다르다.
- hover 상태 이외에 색이 바뀌어야 하는 상태들이 많다. isActive 됐을 떄나..

### props로 styles을 넘겨 주기

현재 프로젝트에서 emotion 을 사용하고 있기 때문에 css 와 cx 를 사용해서 스타일을 만들어줬다.

```js
return(){
    <>
}
```
