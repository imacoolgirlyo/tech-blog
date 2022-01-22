---
title: '재사용 가능한 Button Element 컴포넌트 만들기'
date: 2022-01-22 15:42:13
category: 'development'
draft: false
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

- 버튼 구성은 icon과 이름으로 이루어져있다.
- width, height, color 등이 다 다르다.
- hover 상태 이외에 버튼마다 색이 바뀌어야 하는 조건들이 있을 수 있다.

### props로 styles을 넘겨 주기

현재 프로젝트에서 emotion 을 사용하고 있기 때문에 css 와 cx 를 사용해서 스타일을 만들어줬다.

버튼에 공통적으로 필요하고, 변하지 않는 값은 직접 props로 전달 하고 변할 수 있는 스타일들 (hover, active 상태에 따른 스타일)은 각 버튼마다 다 다를 수 있으니 styles 객체를 넘겨주는게 좋을거 같다고 판단했다.

**변하지 않는 값(웬만하면)**

- 버튼의 width, height
- icon과 이름은 수직 정렬 되어 있다.

**변할 수 있는 값**

- hover 됐을 때, icon의 색
- 클릭 됐을 때, name의 색이 변경되는 경우
- 클릭 됐을 때, 배경 색이 변해야 하는 경우
  등등

```ts
// interface 는 생략
import React from 'react'
import styled from '@emotion/styled'
import { cx } from '@emotion/css'

const IconButton = ({
  width,
  height,
  icon,
  name,
  rootClassName = '',
  iconClassName = '',
  nameClassName = '',
  onClick,
}: IconButtonProps) => {
  return (
    <IconButtonRoot
      width={width}
      height={height}
      className={rootClassName}
      onClick={onClick}
    >
      <div className={cx('typed-icon', `${iconClassName}`)}>{icon}</div>
      <Name className={cx('button-name', `${nameClassName}`)}>{name}</Name>
    </IconButtonRoot>
  )
}

const IconButtonRoot = styled.div<IconButtonRootProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  cursor: pointer;
`

const Name = styled.div``
```

Element 컴포넌트는 위와 같이 만들고 이를 base로 사용하여 새로운 버튼을 만들었다.

### IconButton 확장판(1) : DocButton

```js
import { css } from '@emotion/css'

const DocButton = () => {
  return (
    <IconButton
      width={70}
      height={90}
      icon={<TypedIcon icon="docs_box" />}
      name="DOCS"
      rootClassName={rootClassName}
      iconClassName={iconClassName}
      nameClassName={nameClassName}
    />
  )
}

const rootClassName = css`
  background-color: white;
  border: 1px solid #e5e5e5;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 5px;

  &:hover {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.04)),
      #ffffff;
  }
`

const iconClassName = css`
  font-size: 35px;
`
const nameClassName = css`
  color: #555555;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
`

export default DocButton
```

DocButton은 IconButton이 가지고 있는 기본 구조는 가져가고

- 버튼에 맞는 스타일 (color, margin, box-shadow 등)
- hover 되었을 때의 배경색

스타일이 추가로 필요하기 때문에 rootClassName 이라는 class를 만들어줬다.

### IconButton의 확장판(2): NavButton

### 이 구조의 장점

만약 IconButton 이라는 base 컴포넌트가 없었더라면, Root, Icon, Name 엘리먼트를 모두 만들어줘야 했을 것이다.

```js
return (
  <Root>
    <TypedIcon iconName='어쩌고' color>
    <Name>{버튼 이름}</Name>
  </Root>
    <>
)
```

### 아쉬운 점

- 먼가.. 애매하다. BaseComponent인 IconButton이 실질적으로 해주는 건 매번 Root, TypedIcon, Name을 만들어주지 않아도 된다는 점과 자동 수직 정렬 밖에 없기 때문에 이게 과연 사용하기 편한 형태인지는 잘 모르겠다.
- `@emotion/css`을 사용하고 있지 않다면 설치 후 `css`, `cx` API를 사용해야 한다는 점
