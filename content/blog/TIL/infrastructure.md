---
title: '[js] Class와 상속(extends), super'
date: 2021-09-26 16:21:13
category: 'javascript'
draft: true
---

**Cloud Run ** 으로 현재 서비스 하고 있음
container 이미지를 cloud run에 배포

### Cloud Run

low traffic app에서는 App Engine 보다 Cloud Run이 더 저렴함
request가 있을때만 실행되고 그렇지 않으면 idle 상태임

### [App Engine](https://cloud.google.com/appengine/docs/standard/nodejs/quickstart)

AE는 전형적인 hosting platform이고 항상 켜져 있고 실행되고 있으며 request가 오면 이를 serve함 (확실히 response가 빠름)

https://dev.to/pcraig3/cloud-run-vs-app-engine-a-head-to-head-comparison-using-facts-and-science-1225

## hosting

https://firebase.google.com/docs/hosting/serverless-overview

- 동적 웹 호스팅
  param을 통해 특정 조건에 부합하는 데이터를 가져올 수 있음. Fir
