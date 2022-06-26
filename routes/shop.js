// [ Express 문법 ] Router 첨부와 사용
var router = require('express').Router();

router.get('/shirts', function(요청, 응답){
        // router.get('/shop/shirts', function(요청, 응답){
  응답.send('셔츠 파는 페이지입니다');
});

router.get('/pants', function(요청, 응답){
        // router.get('/shop/pants', function(요청, 응답){
  응답.send('바지 파는 페이지입니다');
});

// [ Javascript 문법(구버전) ] 다른 javascript 파일에서 코드를 사용할 수 있도록 module.exports = router; 로 코드를 내보내고, 다른 javascript 파일에서는 require('파일경로 또는 라이브러리명') 표기로 그 코드를 불러와 사용할 수 있음
// [ Express 문법 ] app.use() 는 전역 미들웨어(즉, 요청과 응답 사이에 실행되는 코드) 사용하려고 사용하는 문법
// [ Express 문법 ] app.use('/shop', require('./routes/shop.js')); 의 경우에는 사용자가 /shop 경로로 요청했을 때 미들웨어(본 실습에서는 shop.js 라우터) 를 적용해 주세요~    
// [ Express 문법 - 차이 확인요 A ] 특정 라우터에 미들웨어 적용하고 싶으면 app.get('/mypage', 로그인했는지검사하는미들웨어, function(요청, 응답){} 구조로 미들웨어 삽입요
// [ Express 문법 - 차이 확인요 B ] 특정 라우터에 미들웨어 적용하고 싶으면 라우팅 코드들(즉, app.use() 형태)보다 상단부 지점에 router.use('/어쩌구', 미들웨어함수명); 표기요 
// [ Express 문법 ] 모든 라우터에 미들웨어 적용하고 싶으면 라우팅 코드들(즉, app.use() 형태)보다 상단부 지점에 router.use(미들웨어함수명); 표기요 
module.exports = router;