---
title: '현재 로그인 방식: Google OAuth와 Firebase Login'
date: 2021-07-12 16:21:13
category: 'development'
draft: true
---

Google Login은 OAuth 2.0 흐름과 토큰 수명 주기를 관리하여 Google API와의 통합을 단순화합니다.

OAuth를 사용하여 Google API에 엑세스하는 모든 어플리케이션은 구글 OAuth 2.0을 식별하는 Credential(인증 자격 증명)이 있어야 합니다.

- [Credential page](https://console.cloud.google.com/apis/credentials?project=typed-app&folder=&organizationId=) 의 OAuth 2.0 Client IDs 내에 현재 우리가 사용하거나, hosting 하고 있는 HTTPs origin 주소가 추가 되어 있다.
  - ex) http://localhost:5000 , https://typed-app.web.app
  - credential에 추가한다는 의미이 url은 인증되어 있으니 여기서 Google API access 할 수 있게 한다.
  - OAuth Client IDs에 등록된 Client ID는 해당 앱이 Google OAuth 를 사용할 수 있는 앱인지 아닌지 식별하기 위한 값이다.
