함수 내에서 사용할 수 있는 값은 전역 변수 값과 함수 lexical scope 안에 있는 변수들 그리고 parameter로 받는 값들이 있다.

hooks 내의 함수를 만들다보면 hook에도 args가 필요하고 함수도 args를 가지는데 함수 내에서 어떤 값을 hook에 args에 있는 값을 사용할건지 함수 args로 사용할 건지 기준을 생각하기 어렵다.
얼마전에 useAddNewResource hooks을 만드는데 props를 변경해야할지 addUrlResource args를 바꿔야할지 판단하기 어려웠다. 결국 이 훅을 사용하는 곳에서의 상태가 매우 중요했다.

### 함수의 인자 (클린 코드 50p)

함수 인자가 많을 때 보다 적을 때 함수를 더 이해하기 쉽다. 예를 들어 `getFolder(folderId)` 보다 `getFolder(folderId, panelType, result)`등으로 인자가 많아질 수록 함수 의도를 알기 어렵다.

만약 인스턴스를 만들 때 StringBuffer를 정의해주는 게 아니라, includeSetupPages가 `StringBuffer`를 인자로 받는 함수였다면 코드를 읽을 때 마다 StringBuffer의 의도를 해석해야 한다.

```java
public class SetupTeardownIncluder {
  private StringBuffer newPageContent;

  public void includeSetupPages throw() Exception {
    //
  }
}
```

함수를 읽을 때, 현 시점에서 중요하지 않은 함수의 세부사항을 알 필요 없게끔 하는 게 좋다.

물론 테스트 할 때도, 인자 하나를 받는 함수보다 여러 개 받는 함수를 테스트하는게 훨씬 복잡하다. 유효한 값으로 여러 조합을 만들어 내야하기 때문에 테스트 해야할 케이스가 많아진다.

✅ 인자 1개인 함수는 대부분 두 가지 타입으로 나뉜다.

- 인자를 질문 하는 형태
  예) fileExists(MyFile)
- input 을 특정 output으로 변환할 때
  예) transformFileToString(File)
