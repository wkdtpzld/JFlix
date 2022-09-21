# JFlix

NetFlix Clone Coding 

Go Page =>  https://wkdtpzld.github.io/JFlix/

-----
## 실제 구동 화면


### Home
[screen-recording.webm](https://user-images.githubusercontent.com/87063105/191476999-766c8c10-c186-4f4b-a150-04dba591dac8.webm)

### Tv Show

[screen-recording2.webm](https://user-images.githubusercontent.com/87063105/191477773-96dd3188-0767-4e86-9569-c10a6d942b0d.webm)

### Search

[screen-recording3.webm](https://user-images.githubusercontent.com/87063105/191478140-567a5d14-dd6b-4ca7-8a3a-46d5bd144e70.webm)


-----
## 사용 기술

  .
<img src="https://img.shields.io/badge/Typescript-192a56?style=flat-square&logo=typescript&logoColor=white"/> 
<img src="https://img.shields.io/badge/React-487eb0?style=flat-square&logo=react&logoColor=white"> 
<img src="https://img.shields.io/badge/styledComponents-DB7093?style=flat-square&logo=styledComponents&logoColor=white"> 
<img src="https://img.shields.io/badge/reactQuery-FF4154?style=flat-square&logo=reactquery&logoColor=white"> 
<img src="https://img.shields.io/badge/recoil-40AEF0?style=flat-square&logo=recoil&logoColor=white">
<img src="https://img.shields.io/badge/reactHookForm-EC5990?style=flat-square&logo=reactHookForm&logoColor=white"> 
<img src="https://img.shields.io/badge/reactPlayer-000000?style=flat-square&logo=reactPlayer&logoColor=white"> 
<img src="https://img.shields.io/badge/framerMotion-0055FF?style=flat-square&logo=framer&logoColor=white"> 

------

## 가장 중요하게 본 점

### Framer-motion

새롭게 배운 애니메이션 라이브러리입니다.

지금까지 사용해온 AOS 에 비해서 굉장히 다채롭고 세세한 컨트롤이 가능한 라이브러리였습니다.

해당 프로젝트에서 가장 재미있게 사용하였습니다.

![image](https://user-images.githubusercontent.com/87063105/191484306-eef512d0-50a5-4833-9a27-2e1192ecdbc3.png)

실제로 프로젝트에서 보여지는 애니메이션은 CSS, JS , Frame-motion을 통한 애니메이션입니다.

### React-query

프로젝트 내 데이터를 불러오는 작업에서 API를 불러오는 작업이 매우 많았습니다.

React-query를 사용하여 데이터를 중복으로 불러와 재사용시에 걸리는 시간을 줄여 최적화 시켰습니다.

### Design

모바일 환경에서도 불편함 없는 디자인을 만들기 위해 노력했습니다.

하지만 아직 결함이 있습니다. 추후 업데이트 예정입니다.

----

## 가장 어려웠던 점

Animation 작업이 가장 어려웠다고 생각됩니다.

특히 슬라이드 작업시 가장 문제였던 점은

PREV, NEXT 작동 시 멋대로 움직이는 상황이 자주 나왔고 해당 상황을 해결하기 위해서

VARIANTS를 밖에 두기 / SETSTATE(False) 형식이  아닌 setState(() => False) 식으로 즉발성으로 바꾸어 해결하였습니다.

애니메이션의 움직임에 불편한 움직임을 하나하나 세세하게 컨트롤 하는 점은 어려웠지만 framer-motion 라이브러리의 강력함도 알게되었습니다.
