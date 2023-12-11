# Awesome Project Build with Sequelize

Steps to run this project:

1. Run `npm run dev` command


# 필요 패키지 설치
    필요 모듈 설치 :npm install connect-flash method-override multer
    connect-flash : 플래시 메세지를 위한 미들웨어 모듈
    method-override : html form 태그에서 원래 post,get만 지원하지만 delete,put을 사용할 수 있게 해주는 모듈
    multer: 파일 업로드를 위한 모듈
   
# sns 서비스에 필요한 페이지 만들기
  ejs 로 화면 개발
  도메인 별로 폴더 구조 auth, comments, friends, partials, posts, profie
  routers들 먼저 생성
  각각 라우터를 server.js에 등록
  users, posts, comments 모델 js 생성

# 로그인, 회원가입 페이지 생성
  스타일링은 bootstrap으로 css 작성
  header, footer 생성 include

# 모델들 정의 하기
  User , Post , Comment 각각의 모델을 정의하고 생성한다

# Post UI 생성하기
  posts 접근시 mongodb에서 find().populate() 로 가져와서 posts.ejs 에서 넘겨주기 
  bootstrap modal ui 생성

# 이미지 업로드 및 포스트 생성하기
  위에서 설치한 multer 미들웨어 모듈 이용
  multer.diskStorage를 통해 업로드시 세부 옵션 설정
  Post db 저장
  에러처리기 미들웨어 생성

# 포스트 리스트 나열하기
  db에서 가져온 post 리스트 데이터를 ejs 템플릿 사용하여 화면에 표현
  Connect-Flash 사용해서 화면에 메세지 표현 , 정보 유지를 위해 세션 사용
  connect-flash 미들웨어 등록
  flash 메세지를 위한 send , receive 구현 : 페이지를 새로고침하면  세션에서 사라지기에 휘발성이다
  헤더부분에 flash 사용해보기
  res.locals 이용해서 공통 프로퍼티에 success랑 error랑 currentUser 등록하여 view 단에서 공통으로 사용하기 

# 포스트 수정하기
  수정하기 핸들러에 체크하는 미들웨어 추가 : 로그인됬는지 > 해당 포스트가 존재하는지 > 해당 포스트가 내 포스트가 맞는지
  수정화면 ejs 만들기
  수정하기 라우터 핸들러 작성

# 포스트 삭제하기
  delete용 라우터 핸들러 작성
  동일하게 권한 체크 미들웨어 추가

# 댓글 작성하기
  댓글 리스트 영역 ui 추가 : 내가 작성한 댓글시 삭제랑 수정 기능 노출
  라우터 생성시 mergeParams: true 사용 (상위 라우터의 req.params 값을 유지한다)

# 댓글 삭제하기
  삭제 라우터 핸들러 : 로그인했는지 > 해당 댓글이 존재하는지 > 해당 댓글이 내가 작성한게 맞는지

# 댓글 수정하기
  커멘트 정보 가져오와서 에디터 화면으로 가는 라우터 핸들러 작성
  에디트 화면 구성
  댓글 수정하기 라우터 핸들러 작성

# 게시글 좋아요 기능
  좋아요 ui 구성 : 이미 좋아요 눌렀는지 체크해서 ui 분기
  좋아요 기능 라우터 핸들러 생성 : 로그인됬는지 > 해당 포스트가 있는지 > 해당 포스트를 이미 내가 좋아요 했는지 안했는지

# 친구 페이지 생성
  친구 페이지 접근을 위한 라우터 핸들러 생성
  친구 메인 페이지 ui 개발
 

# 친구 페이지의 기능 개발 (요청,취소)
  친구 요청을 위한 라우터 핸들러
  친구 요청 취소를 위한 라우터 핸들러
  친구 요청 수락 기능을 위한 라우터 핸들러
  친구 삭제 핸들러 생성

# 헤더 UI 꾸미기

# 프로파일 화면 개발하기
  나의 포스트만 가져오기
  나의 기본 정보들 가져오기
  나의 기본 정보 수정하기