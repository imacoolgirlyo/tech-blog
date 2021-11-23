### TSDX

타입스크립트 패키지 만들 때 사용하는 cli이고 별도의 ts, react 세팅을 하지 않고도 패키지 개발 환경 구성을 만들어준다.
아래와 같은 폴더 구조를 만들어준다. 패키지에서 만든 api들을 사용해볼 수 있는 example 폴더도 만들어준다.

example 폴더는 parcel로 번들된다.

23일 오늘은 일단 프로젝트 세팅까지 완료했다. 내일은 테스트 코드 세팅을 할 예정

## 11/23

```ts
/**
 * @INTERNAL
 */
export interface NotValidatedToastProps extends Partial<ToastProps> {
  toastId: Id
}
```

- `@INTERNAL`는 내부에서만 사용된다는 뜻 같다.
- `extends Partial<ToastProps>` 를 사용함으로써 NotValidatedToastProps 타입은 toastId가 필수로 들어가나 몇몇개의 ToastProps 내의 타입들이 포함될 수 있다.

### Random string 만들기

```js
Math.random().toString(36)
Math.random()
  .toString(36)
  .substr(2, 9)
```

- 36 진수로 값을 만든다. '0.8d6pgj92byl'
- 제일 앞 두 글자를 제거하기 위해서 substr을 사용할 수 있음
