Error Boundaries 가 catch 하는 에러

child component tree에서 발생한 에러를 catch 하고 error를 log 시킨 후 fallback UI를 보여준다.
에러 바운더리에서는 lifecycle method 내에서의 렌더링시 발생하는 에러들을 catch 한다.

그래서 Event handler에서의 에러는 잡지 않는다.
