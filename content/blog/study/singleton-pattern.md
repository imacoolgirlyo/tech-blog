## Object Creational Pattern

### Singleton

### Factory

### Builder

어플리케이션이 시작될 때, 최초에 한번, 하나의 인스턴스를 생성하고 어플리케이션 내에서 이 인스턴스를 가져와서 쓰는 패턴

React DnD 사용시 드래그되는 객체, drop 되는 영역 등을 관리하는 manager 객체가 있어야 하는데 이 매니저가 singleton으로 최초에 한번만 생성된다.

```ts
const manager = createSingletonDndContext(
  props.backend,
  props.context,
  props.options,
  props.debugMode
)
```
