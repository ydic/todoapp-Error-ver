// --- 코딩애플_Google Cloud로 5분만에 내 사이트 배포하자 ($300 무료 크레딧)

// [ dotenv 라이브러리 문법 ] .env 파일을 package.json과 동일 폴더 계층에 두어야 함
// [ dotenv 라이브러리 문법 ] 전체 코드의 최우선 순위로 dotenv 라이브러리를 인식시켜야 .env 파일에 별도 저장한 기밀 값들을 process.env.키값 문법을 통해 각 코드 파일들에서 불러와 각종 기능을 원활히 작동시킬 수 있음
// [ dotenv 라이브러리 문법 ] npm install dotenv 명령어로 라이브러리 설치 및 등록 코드  후 대외비 환경변수 값을 .env 로 이전요
require('dotenv').config()

// 코드 실행 명령어: node server.js ---> nodemon server.js

// 한 줄씩 적어가면서 해석하는게 남의 코드 해석하는 가장 좋은 방법

// 'use strict';

// express 라이브러리 첨부와 사용
const express = require('express');
    // import express from 'express';
const app = express();

// morgan 라이브러리 첨부와 사용
    // import morgan from 'morgan';
const morgan = require('morgan');
const logger = morgan('dev');
app.use(logger);

// HTML form 태그 method 요청 속성에 PUT, DELETE 직접 지정 불가 (즉, GET, POST로만 직접 지정 가능) 
// HTML form 태그 PUT, DELETE 요청 지정하기 위해 method-override 라이브러리 설치 후 server.js에서 라이브러리 호출 및 사용함 (즉, npm i method-override) 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// static 파일(예- detail.ejs에서 /public/main.css를 첨부해서 사용함)을 보관하기 위해 public 폴더를 사용할 거예요
app.use('/public', express.static('public'));

// express 내장 body-parser 라이브러리 인코딩 활성화
// form input에 적은 정보는 요청 파라미터에 들어있음(express라이브러리에 body-parser 라이브러리도 내장됨)
// express 미포함 시절에는 (1) npm install body-parser (2) const bodyParse = require('body-Parser'); app.use(express.urlencoded({extended: true}));
// body-Parser 라이브러리(input 태그에 적은 내용 해석 도와줌) 실행 app.use(express.urlencoded({extended: true}));
// POST 요청으로 서버에 데이터 전송하려면 (1) body-Parser(input 태그에 적은 내용 해석 도와줌) 코드실행 app.use(express.urlencoded({extended: true})); (2) form데이터 input태그들에 name 쓰기 (3) 요청.body (ex: 요청.body.인풋 태그 name 속성의 값)라고 하면 form에서 보낸 자료 수신가능
app.use(express.urlencoded({extended: true})) 

// ejs 템플릿 엔진을 통해 html에 MongoDB 데이터를 넣을 수 있음
// npm i ejs (강좌 영상에서는 3.0.1 / 실제 설치 3.1.6)
// ejs 버전: https://www.npmjs.com/package/ejs?activeTab=versions
app.set('view engine', 'ejs')

// package.json 파일이 있는 폴더 위치가 pug, ejs 템플릿 동작시 인식하는 cwd 기준점
// Error: Failed to lookup view 
// nomad 클론코딩 Pug 버전 예: app.set('views', process.cwd() + '/src/views');
app.set('views', './views')

// npm i mongodb@3.6.6 설치(2018년도) 후 mongodb 라이브러리 첨부
// (2018년도) https://docs.mongodb.com/manual/release-notes/3.6/

// [ dotenv 라이브러리 문법 ] npm install dotenv 명령어로 라이브러리 설치 후 대외비 환경변수 값을 .env 로 이전요
       // const PORT = 8080;
       // const MYDBURL = 'mongodb+srv://admin:qwer1234@cluster0.k01og.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const MongoClient = require('mongodb').MongoClient;
      // import { default as mongodb } from 'mongodb';
      // let MongoClient = mongodb.MongoClient;

// mongoDB database 변수 선언
let db;

// [ mongoDB Connection Guide ] https://docs.mongodb.com/drivers/node/current/fundamentals/connection/
// mongoDB connect 파라미터 값으로 {useUnifiedTopology:true} 추가함
// 이유(노드서버 실행시 경고문구 나옴): To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
// [ dotenv 라이브러리 문법 ] .env 파일에 환경변수 정보 별도 저장 관리함 process.env.MYDBURL / process.env.PORT
MongoClient.connect(process.env.MYDBURL, {useUnifiedTopology:true}, function(에러, client){

  // mongoDB connect 콜백함수 error 파라미터 이용해서 connection 에러 발생시 에러 내용 콘솔출력
  if(에러) return console.log(에러);

  // 데이터베이스 특정하기
  db = client.db('todoapp');

  // (테스트용) 데이터베이스 내 컬렉션에 인서트
  /*
  db.collection('postCol').insertOne({_id: 101, 이름: 'Test' , 나이: 35}, function(에러, 결과){
    console.log('test 인서트 저장완료');
  })
  */

  // MongoDB 연결 성공하면 이어서 Server를 연결해주세요
  // listen(서버 띄울 포트번호, 띄운 후 실행할 코드)
  app.listen(process.env.PORT, function(){
  console.log(`listening on ${process.env.PORT}`)
})
})

// Node.js 특성상 코드를 연달아서 2개 적는다고 그 코드가 순차적으로 실행된다는 보장이 없기 때문에 (이전강의 참고)
// 뭔가 순차적으로 실행할 때 '함수안에 함수를 집어넣는 콜백함수'를 꼭 사용합니다.  

// 누군가가 /pet으로 방문하면, pet 관련된 안내문을 띄워주자
// ES6 문법 ( ) => {} 그냥 function이라고 쓰는 것과 차이점은 함수 내부에서 this라는 키워드의 값이 바뀐다.

/*
// 수업 내용 초반부 연습용 코드 (지워도 됨)
app.get('/pet', function(요청, 응답){
응답.send("펫용품 쇼핑 페이지입니다.")
})

app.get('/beauty', function(요청, 응답){
  응답.send('뷰티용품 쇼핑 페이지입니다');
})
*/

// 껐다 켜기 귀찮으니 ★★★ npm install -g nodemon 
// 'nodemon' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다.
// 이 시스템에서 스크립트를 실행할 수 없으므로 C:\Users\SAMSUNG\AppData\Roaming\npm\nodemon.ps1 파일을 로드할 수 없습니다.
// ★★★ 관리자 권한으로 windows powershell 실행 -> get-ExecutionPolicy 명령어 실행결과가 Restricted 인지 확인 -> Set-ExecutionPolicy RemoteSigned 명령어로 권한 상태 변경 -> nodemon 실행 명령어 재실행

/*
// 루트경로 GET요청시 구 index.html 응답 코드 --> 현 views/index.ejs 파일 응답 코드 
// Get요청 업그레이드 : 접속시 HTML 파일 보내주기 
// __dirname은 현재 파일의 경로를 뜻합니다

app.get('/', function(요청, 응답){
  응답.sendFile(__dirname + '/index.html')
})
*/

// [ Javascript 문법(구버전) ] 다른 javascript 파일에서 코드를 사용할 수 있도록 module.exports = router; 로 코드를 내보내고, 다른 javascript 파일에서는 require('파일경로 또는 라이브러리명') 표기로 그 코드를 불러와 사용할 수 있음
// [ Express 문법 ] app.use() 는 전역 미들웨어(즉, 요청과 응답 사이에 실행되는 코드) 사용하려고 사용하는 문법
// [ Express 문법 ] app.use('/shop', require('./routes/shop.js')); 의 경우에는 사용자가 /shop 경로로 요청했을 때 미들웨어(본 실습에서는 shop.js 라우터) 를 적용해 주세요~    
// [ Express 문법 - 차이 확인요 A ] 특정 라우터에 미들웨어 적용하고 싶으면 app.get('/mypage', 로그인했는지검사하는미들웨어, function(요청, 응답){} 구조로 미들웨어 삽입요
// [ Express 문법 - 차이 확인요 B ] 특정 라우터에 미들웨어 적용하고 싶으면 라우팅 코드들(즉, app.use() 형태)보다 상단부 지점에 router.use('/어쩌구', 미들웨어함수명); 표기요 
// [ Express 문법 ] 모든 라우터에 미들웨어 적용하고 싶으면 라우팅 코드들(즉, app.use() 형태)보다 상단부 지점에 router.use(미들웨어함수명); 표기요 
app.use('/shop', require('./routes/shop.js'));
    // [ Express 문법 ] app.use('/', require('./routes/shop.js')); 의 경우에는 사용자가 / 경로로 요청했을 때 미들웨어(본 실습에서는 shop.js 라우터) 를 적용해 주세요~
    // app.use('/', require('./routes/shop.js'));

app.get('/', function(요청, 응답){
    // 주의: ejs 엔진이 views 폴더 찾아갈 수 있도록 app.set('views', './views') 코드 작성했으므로 index.ejs 파일에 대한 경로를 views/index.ejs라고 적는 것은 views/views/index.ejs를 찾으라는 말이 되므로 주의
      응답.render('index.ejs');
  });

// [ Express 문법 ] ★★★ GET 요청 처리용 라우터(즉, app.get() 형태)가 전역 라우터인 app.use() 형태로 잘못 지정되어 있어 파일 업로드 기능이 동작하지 않고 upload.ejs 페이지만 보여줬음
app.get('/upload', function(요청, 응답){
  응답.render('upload.ejs')
});

// 사용자의 업로드 파일은 작업폴더(본 실습에서는 /public/image 폴더)나 일반하드(클라우드 서비스)에 저장함(즉, DB 에 저장하지 않음)
// [ Multer 문법 ] npm i multer 명령어로 설치 / upload.ejs 의 enctype="multipart/form-data" 속성 데이터 전송과 처리를 도와주는 라이브러리
// [ Multer 문법 ] Multer 설치 및 사용
let multer = require('multer');

// [ Node js 문법 ] path라는 변수는 nodejs 기본 내장 라이브러리 path 라는걸 활용해 var path = require('path'); 형태로 표기하여 사용하며 파일의 경로, 이름, 확장자 등을 알아낼 때 사용합니다. 
// [ Node js 문법 & Multer 문법 ] nodejs 기본 내장 라이브러리에 기반한 path 라는 변수는 특정 확장자 파일만 업로드 허용하기 위한 코드 multer({ fileFilter: function (req, file, callback) { var ext = path.extname(file.originalname); } }) 에서 활용됨
var path = require('path');

const multerStorageSetting = multer.diskStorage({
  // [ Multer 문법 ] Multer 라이브러리 통한 저장매체를 diskStroge 속성으로 지정하고 저장경로는 작업폴더(본 실습에서는 /public/image 폴더)로 설정
  destination: function(req, file, cb){
    // [ Github 문법 ] .gitignore 파일에 /public/image 명시하여 github 로 push 되는 것 방지
    cb(null, './public/image')
  },
  // [ Multer 문법 ] 업로드한 파일을 랜덤파일명이 아니라 원본파일명으로 저장하도록 설정
  // [ Multer 문법 ] 파일명과 확장자 동일한 파일 어떻게 구별? 
  // [ Multer 문법 ] Wetube 에서는 파일명 속성 별도 지정 안했더니 랜덤파일명 부여 방식으로 Multer 구동되었음
  filename: function(req, file, cb){
    // [ Multer 문법 - 해결법 확인요 ] ★★★ 한글은 완전히 깨져서 저장됨
    cb(null, file.originalname)
    
    // [ Multer 문법 - 올바른 기법 재확인요 ] ★★★ Error: ENOENT: no such file or directory, open 'D:\200 IT 트레이닝\220609 nomadcoder\all_that_javascript\yd_code_js\todoapp\public\image\pexels-yuri-manei-3131819.jpg날짜Mon Jun 27 2022 01:35:45 GMT+0900 (대한민국 표준시)'
    // cb(null, file.originalname + '날짜' + new Date())
  },
});

// var multerUpload = multer({ storage: multerStorageSetting });
var multerUpload = multer({ 
  // [ Multer 문법 ] 저장매체를 multer.diskStorage({ }) 지정하고 그 내부에 저장경로와 파일명 작명 방식을 지정한 내용을 storage 라는 키값에 설정함
  storage: multerStorageSetting,
  
  // [ Node js 문법 & Multer 문법 ] 특정 확장자 파일만 업로드 허용
  fileFilter: function (req, file, callback) {
    // [ Node js 문법 ] path라는 변수는 nodejs 기본 내장 라이브러리 path 라는걸 활용해 var path = require('path'); 형태로 표기하여 사용하며 파일의 경로, 이름, 확장자 등을 알아낼 때 사용합니다. 
    // [ Node js 문법 & Multer 문법 ] nodejs 기본 내장 라이브러리에 기반한 path 라는 변수는 특정 확장자 파일만 업로드 허용하기 위한 코드 multer({ fileFilter: function (req, file, callback) { var ext = path.extname(file.originalname); } }) 에서 활용됨
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return callback(new Error('PNG, JPG만 업로드하세요'))
    }
    callback(null, true)
  },

  // [ Multer 문법 ] limits는 파일의 사이즈 제한을 걸고 싶을 때 씁니다. 
  limits:{
    // [ Multer 문법 ] MulterError: File too large
    // [ Multer 문법 ] 1024 * 1024는 pixel 이 아니라 용량
    // [ Multer 문법 ] 1024 * 1024는 1MB 해당함 (즉, 1 Byte 단위로 표기되므로 1 Byte * 1024 = 1 KBytes 이고, 1 KBytes * 1024 = 1 MBytes 임)    
    fileSize: 1024 * 1024 * 3
  }
});

// [ Multer 문법 ★★★ ] multerUpload.single('multerInput') 코드는 upload.ejs 의 <form method="POST" action="/upload" enctype="multipart/form-data"> 입력폼 내의 multerInput 이라는 이름의 <input type="file"> 값에 단일 파일(즉, single)을 담아 /public/image 폴더 이하에 업로드하고 req.file 을 추가함
// app.post('/upload', multerUpload.single('multerInput'), function(요청, 응답){

// [ Multer 문법 ★★★ ] upload.ejs 의 input 태그에 multiple 속성을 표기하여 <input type="file" name='multerInput' multiple> 형태로 설정하면, server.js 의 multerUpload.array('multerInput', 한꺼번에업로드허용할파일갯수) 코드를 통해 지정한 갯수만큼 파일을 한꺼번에 업로드 가능함 / 업로드 갯수 초과시 MulterError: Unexpected field 에러 발생함
app.post('/upload', multerUpload.array('multerInput', 2), function(요청, 응답){
  응답.send('업로드완료');
})

// [ Node js 문법 & Multer 문법 ] 업로드한 이미지 보여주기
// [ Node js 문법 ] 본 코드가 적혀있는 sever.js 의 현재경로는 __dirname 형태로 표기 가능
// [ Express 문법 ] :parameter 문법 사용시 한글 작명은 오류 발생하므로 영문으로 작명요
// [ Express 문법 ] 실제로는 이미지 파일들이 ./public/image/ 경로에 저장돼 있는데, 라우팅 기법 상으로는 ./image/ 경로에서 이미지 호출하도록 라우팅 지정함
app.get('/image/:imageName', function(요청, 응답){

  // [ 경로 표기 주의 ] /public/image/ 라고 표기해야 하는데 슬래시가 마지막에 누락돼 /public/image 라고 표기해 image 폴더명과 imageName 파일명 사이에 경로 구분이 제대로 되지 않아 이미지 보여주기 오류 발생함
  // ejs 파일에서 <img src="/image/저장된파일명.확장자"> 형태로 이미지 보여줄 수 있음
  
  응답.sendFile( __dirname + '/public/image/' + 요청.params.imageName);
})


// cRud 기능: /list 경로로 GET 요청하면 응답.render 코드에 담긴 ejs 파일을 렌더링하여 MongoDB 데이터들로 꾸며진 html을 보여줌
app.get('/list', function(요청, 응답){

  // db에 저장된 postCol 컬렉션 안의 모든 데이터를 찾아주세요
  db.collection('postCol').find().toArray(function(에러, 결과){
    // console.log(결과);

    // 찾은 데이터 결과를 ejs 파일에 넣어주세요
    // 결과 파라미터를 사용하기 위해서 본 중괄호 속에 응답.render 코드 위치해야 함
    응답.render('list.ejs', { postResult : 결과 });
  });   

  // 주의: 현위치의 중괄호 속에는 응답 파라미터는 있어도 결과 파라미터는 없음. 
})

app.get('/search', (요청, 응답) => {
  // 사용자 입력값을 받아오는 방법에는 요청.body 이외에도 Query String 이 Object 자료형으로 담겨있는 요청.query 도 있음
  console.log(요청.query.valueKeyword);

// [ nmd 정규표현식 문법 MongoDB ] $regex는 MongoDB가 제공하는 여러 operator 중에 한 가지임 / 예- { <field> : { $regex: 정규표현 관련 설정(문서 재참고요) } }
// [ nmd 정규표현식 문법 Javascript ] new RegExp(PATTERN, FLAGS) 예- $regex: new RegExp(keyword,'i')
// [ nmd 정규표현식 문법 Javascript ] i는 ignore case이며 영문 대소문자 구분하지 않는 속성임

// [ 검색기법 01 하 ] 요청.query.valueKeyword 코드의 기능상 단점은 검색어와 정확히 일치하는 것만 찾아줌(즉, 모든 항목을 찾아보는 full scan 방식으로 동작)
// [ 검색기법 01 하 ] 즉, DB 에 고기요리, 튀김요리가 있을 때 '요리' 또는 '고기' 라고 검색시 검색결과 없음 / '고기요리'라고 검색해야 검색됨
// [ 검색기법 02 중 ] 문자 검사하는 정규식(즉, /검색어/ )으로 요청.query.valueKeyword 코드의 단점 해결 가능하지만 find() 로 다 찾는 데 오랜 시간 소요됨
// [ 검색기법 03 상 ] indexing 으로 고속 검색 가능함(전제조건: binary search 적용하려면 DB 데이터가 미리 정렬(텍스트/오름차순/내림차순) 되어 있어야 함)
// [ 검색기법 03 상 ] index 는 binary search 를 위해 기존 collection 을 정렬(텍스트/오름차순/내림차순) 해놓은 사본
// [ 검색기법 03 상 ] index 만드는 방법: Mongo DB -> collections -> Indexs -> create Index -> { "제목" : "text" }
// [ 검색기법 03 상 ★★★ ] Mongo DB 문자자료는 index 만들 때 한꺼번에 기재요(즉, 제목 따로 날짜 따로 index 만들지 않는다)
// [ 검색기법 03 상 ★★★ ] Mongo DB 같은 웹서비스 없는 서버실(IDC) 환경에서는 DB 조작은 원래 터미널 상의 명령어로 진행함
// [ Mongo DB 문법 ] Mongo DB 는 기본적으로 _id 순으로 DB 데이터 정렬되어 있어서 _id 기준으로 검색시 binary search 해줌

// [ JQuery 기반 Query String ] 프론트엔드에서 Query string을 쉽게 만들려면 jQuery 문법 중에 param, serialize 를 쓰면 됩니다. 
// [ JQuery 기반 Query String 방법A ] const 자료 = { 이름: '값', 이름2: '값2'} 코드 기반으로 $.param(자료) 하면 이름1=값1&이름2=값2 이거가 남음
// [ JQuery 기반 Query String 방법B ] <input>에 name 속성을 설정한뒤 $(폼태그를찾고).serialize()

// [ Mongo DB 문법 ] https://www.mongodb.com/docs/manual/reference/operator/query/text/#std-label-text-query-operator-behavior
// [ Mongo DB 문법 ] In the $search field, specify a string of words that the $text operator parses and uses to query the text index.
// [ Mongo DB 문법 ] Mongo DB 가 지원하는 operator 인 $text 와 $search 를 활용해 검색 쿼리인 find() 에서 index 에 기반해 indexing 방식으로 검색함
// [ Mongo DB 문법 ] { $text: { $search: 요청.query.valueKeyword }} 기법으로 빠른 검색 / OR 검색 가능 / - 제외 가능
// [ Mongo DB 문법 ] 이닦기 글쓰기 라고 검색하면 이닦기 or 글쓰기가 포함된 모든 문서를 찾아줌
// [ Mongo DB 문법 ] 이닦기 -글쓰기 라고 검색하면 이닦기인데 글쓰기라는 단어 제외 검색
// [ Mongo DB 문법 ] "이닦기 글쓰기" 라고 검색하면 정확히 이닦기 글쓰기라는 phrase가 포함된 문서 검색
// [ Mongo DB 문법 { $text: { $search: }} 기법 단점 ] ★★★ 글쓰기 라고 검색하더라도 글쓰기입니다~ 이런 문장은 못찾아줍니다. (띄어쓰기 기준으로 단어를 저장하는 방식이기 때문)
// [ Mongo DB 문법 { $text: { $search: }} 기법 단점 ] 영어는 상관없는데 영어가 아닌 언어들(조사많은 한국어 / 띄어쓰기안하는 일본어중국어)은 그래서 text search 기능을 쓸 수가 없습니다.
// [ Mongo DB 문법 { $text: { $search: }} 기법 단점 ] 그래서 그냥 영어서비스 개발할거면 쓰시고 아니라면 지웁시다. 

// 해결책3 serach index 방식을 적용하여 띄어쓰기 기준으로만 제한적으로 검색해주는 { $text: { $search: 요청.query.valueKeyword }} 기법의 단점을 보완
// [ 검색기법 03 상 search index ] index 삭제하는 방법: Mongo DB -> Atlas -> Browse Collections  -> Indexs -> 휴지통 아이콘 -> Type the index name 제목_text to drop (즉, { $text: { $search: 요청.query.valueKeyword }} 기법 테스트차 만들었던 { "제목" : "text" } 삭제)
// [ 검색기법 03 상 serach index ] search index 만드는 방법: Mongo DB -> clusters -> search -> create Search Index -> visual editor 선택 -> titleSearch 라고 인덱스명 작명 -> 대상 Collection 으로 postCol 지정 -> refine your index 버튼 눌러 Index Analyzer 항목을 lucene.korean(한국어 형태소 분석기 / 일명, 조사걸러내는필터) 으로 지정 -> Add Field 버튼을 눌러서 제목 필드는 lucene.korean 사용한다고 특정 -> save change 버튼 클릭 -> create Search Index 버튼 클릭 (indexing 하면 MongoDB 용량 차지하므로 필요한 항목만 선별해 indexing 적용요)
// [ 검색기법 03 상 serach index ] 글쓰기입니다~ 검색되도록 하려면 aggregate() 함수와 Search index를 조합해 사용합니다.
// [ 검색기법 03 상 serach index ] 예- var 검색조건 = [ {발행날짜가 1~10일까지이고}, {글쓰기 라는 단어를 포함하고}, {정렬된 형태로}]
// [ 검색기법 03 상 serach index ] 예- db.collection('postCol').aggregate(검색조건).toArray((에러, 결과)=>{}
var 검색조건 = [
  {
    $search: {
      // Mongo DB -> Atlas -> Browse Collections -> search -> create Search Index -> visual editor 선택 -> titleSearch 라고 인덱스명 작명 -> 이후 내용은 원본주석(search index 만드는 방법) 검색하여 참조요
      index: 'titleSearch',
      text: {
        query: 요청.query.valueKeyword,
        path: '제목'  // 제목 날짜 둘다 찾고 싶으면 ['제목', '날짜']
      }
    }
  },
  { $project: { 제목: 1, _id: 0, score: { $meta: 'searchScore' }}}
        /*
        // 코드풀이 및 실행결과 { $project: { 제목: 1, _id: 0, score: { $meta: 'searchScore' }}}
        // 1 은 보여줌 / 0 은 안보여줌 / searchScore 매겨서 보여줌
        글쓰기
        [
          { '제목': '글쓰기', score: 1.5145258903503418 },
          { '제목': '글쓰기지만 글쓰기처럼 글쓰기', score: 1.4235844612121582 },
          { '제목': '매우 많이 글쓰기', score: 1.1969165802001953 },
          { '제목': '이닦기하면서 글쓰기', score: 0.9105052947998047 },
          { '제목': '이닦기 띄어쓰기 책읽기', score: 0.4211652874946594 }
        ]
        */
]

// [ Mongo DB 문법 aggregate() 의문점 ★★★ ] https://www.mongodb.com/docs/manual/reference/method/db.collection.aggregate/#db.collection.aggregate--
// [ Mongo DB 문법 aggregate() 의문점 ★★★ ] 글쓰기입니다~ 검색되는데 딱 한 글자로만 검색하는 것은 불가한 것 같음 (예- 글)
db.collection('postCol').aggregate(검색조건).toArray((에러, 결과)=>{
        // db.collection('postCol').find({ $text: { $search: 요청.query.valueKeyword }}).toArray((에러, 결과)=>{
        // db.collection('postCol').find({ 제목: 요청.query.valueKeyword}).toArray((에러, 결과)=>{

  /*
  [ Mongo DB 문법 ] 그럼 100만개에서 '글쓰기'라는 단어가 포함된 문서를 검색해야하면 어떻게 하죠 ㄷㄷ
  해결책 1. 검색할 문서의 양을 제한을 둡니다.
  DB에다가 검색요청을 날릴 때 특정 날짜(예- JS 함수인 new Date() 기반으로 최근 일주일 이내 등록된 게시물)에서만 검색하라고 요구할 수도 있고
  skip(), limit() 이런 함수를 이용하시면 pagination 기능을 개발할 수 있습니다.
  그니까 맨 처음 검색할 땐 맨앞에 20개만 찾아줘~ 그 다음엔 다음 20개를 찾아줘~ 
  이렇게 요구할 수 있다는 겁니다. 대부분의 게시판들은 이런 방법을 이용합니다.

  해결책 2. text search 기능을 굳이 쓰고 싶으면 MongoDB를 님들이 직접 설치(즉, 웹서비스 형태가 아니라)하셔야합니다. 
  그리고 indexing할 때 띄어쓰기 단위로 글자들을 indexing하지말고 다른 알고리즘을 써라~ 라고 셋팅할 수 있습니다. 
  nGram(예- 글자 두개 단위로 indexing 해봐라 / 단, 두글자 이상 입력해야 검색유효한 단점) 이런 알고리즘을 쓰면 된다고 하는데 이걸 언제하고 있습니까 패스합시다 

  해결책 3. 글쓰기입니다~ 검색되도록 하려면 aggregate() 함수와 Search index를 조합해 사용합니다.
  Q. Atlas만 되는건가요? / A. 다른 DB호스팅 서비스들도 이런 유사한 기능이 있을겁니다. 
  MongoDB Atlas에서만 제공하는 기능인데 클러스터 들어가보시면 아마 Search 어쩌구라는 메뉴가 있을겁니다. 그거 누르시면 됩니다. 
  그러면 Search index라는걸 만들 수 있습니다. 전에 만든 text index랑 비슷한 기능을 제공하는데 아무튼 이름 잘 지어서 만들어주십시오
  index 이름은 자유 작명이고 어떤 collection에 있는 항목을 indexing 할건지 선택하면 됩니다. . 
  그리고 Analyzer를 설정하는 부분이 있습니다.
  이걸 lucene.korean으로 바꿔주시면 똑똑하게 한국어에 딱 맞게 인덱싱을 해줍니다. 
  lucene이 뭐냐면 그 형태소분석기 이런건데 한국어는 쓸데없는 조사 이런게 붙지 않습니까
  글쓰기를 / 글쓰기입니다 / 글쓰기지만 / 글쓰기라도
  이런 식으로 단어 뒤에 쓸데없는 조사가 붙는데 이걸 다 제거하고 필요한 단어만 남긴다고 보시면 됩니다. 
  아무튼 이렇게 하시면 Search index를 만들 수 있습니다.
  
  aggregate() 함수를 쓰는데 이건 검색조건 여러개를 붙이고 싶을 때 유용한 함수입니다. 
  aggregate() 안에 [ {검색조건1}, {검색조건2} ... ] 이렇게 조건을 여러개 집어넣을 수 있습니다. 
  -예: [ {발행날짜가 1~10일까지이고}, {글쓰기 라는 단어를 포함하고}, {정렬된 형태로}]
  지금은 하나만 집어넣어봄 
  그리고 연산자인 $search를 넣으면 search index에서 검색이 된다고 하는군요. 
  뭔가 길어보이지만 search index쓰는 방법을 그대로 카피해서 썼을 뿐입니다. 이것도 원리이해보다는 복붙의 영역임 
  ★★★ 아무튼 저렇게 쓰시면 '글쓰기' 라고 검색했을 때 '글쓰기입니다~' 이런 문장들도 잘 검색해줍니다. 끝 

          var 검색조건 = [
            {
              $search: {
                index: '님이만든인덱스명',
                text: {
                  query: 요청.query.value, // 내 경우에는 query: 요청.query.valueKeyword,
                  path: '제목'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
                }
              }
            },
          { $sort : { _id : 1 } },
          { $limit : 10 },
          { $project : { 제목 : 1, _id : 0 } }
          ]

  aggregate() 안에 [ {검색조건1}, {검색조건2} ... ] 이렇게 여러개 넣을 수 있댔는데
  그래서 여러개 저렇게 넣으시면 됩니다. 

  검색조건 중에는 searchScore 라는 것도 있는데 검색키워드가 자주 포함된 데이터일수록 searchScore 수치가 높으며, 이 수치가 높은 순서대로 검색 결과를 보여줌

  $sort를 쓰면 결과를 정렬해서 가져옵니다. _id를 오름차순으로 정렬해주세요~ 라고 썼습니다.
  $limit을 쓰면 결과를 제한해줍니다. 맨위의 10개만 가져오라고 시켰습니다. 
  $project를 쓰면 찾아온 결과 중에 원하는 항목만 보여줍니다. 0은 안보여주고 1은 보여주라는 뜻입니다. 위의 코드는 _id는 빼고 제목만 가져오겠군요. 
  이 외에도 백만개의 $연산자가 있다고 합니다.
  이걸 다 어떻게 외움 필요할 때 찾아서 씁니다. 
  */
  console.log(결과);
  응답.render('searchresult.ejs', { searchResult: 결과 });
  })
})

// 없는 게시물 에러처리 코딩요: /detail/어쩌구의 어쩌구 자리에 DB에 들어있지 않은 _id값을 요청하여 db.collection(' ').fineOne( ) 하라고 한다면 에러 결과를 사용자 브라우저단 화면에 어떻게 알려줄 것인지 코딩요

// cRud 기능: /detail/어쩌구 경로로(URL의 파라미터로) GET 요청하면 DB에서 { _id: 어쩌구 }인 게시물을 찾은 결과 데이터를 detail.ejs로 보냄
app.get('/detail/:id', function(요청, 응답){

  // 요청.params.id 뜻은 URL의 파라미터(요청.params) 중에 _id가 id인 파라미터에 해당하는 값

  // Object 자료 다루기 스킬 설명: 서버 데이터 통신 과정에서 { _id: 요청.params.id }의 value값 자료형이 string(즉, 문자형 숫자)이므로 JavaScript 문법 parseInt를 통해 숫자형으로 자료형 변환해야 함
  요청.params.id = parseInt(요청.params.id)

  db.collection('postCol').findOne( { _id: 요청.params.id}, function(에러, 결과){
    console.log('디테일 페이지',결과)
  
    // 혼자 해볼 것들 [완료]: 없는 게시물은 어떻게 처리할까
    if(결과 === null) {
      return 응답.status(404).render('404.ejs', { errorMessage: '페이지를 찾을 수 없습니다'})
    } else {
      // [ express 문법 ] 응답.render(' EJS 파일명.ejs ', object{ EJS 파일로 보낼 데이터 (즉, key: vlaue)})
      return 응답.render('detail.ejs', { detailResult: 결과}); 
    }

  })  
})

app.get('/edit/:id', function(요청, 응답){
    요청.params.id = parseInt(요청.params.id);
    
    db.collection('postCol').findOne( { _id: 요청.params.id }, function(에러, 결과){
    
    // 혼자 해볼 것들 [완료]: 없는 게시물은 어떻게 처리할까
    if(결과 === null) {
      return 응답.status(404).render('404.ejs', { errorMessage: '페이지를 찾을 수 없습니다'})
    } else {
      console.log('edit get요청시', 결과)
      // [ express 문법 ] 응답.render(' EJS 파일명.ejs ', object{ EJS 파일로 보낼 데이터 (즉, key: vlaue)})
      return 응답.render('edit.ejs', { editResult: 결과});    
    }      
  })
})

// HTML form 태그 PUT, DELETE 요청 지정하기 위해 method-override 라이브러리 설치 후 server.js에서 라이브러리 호출 및 사용함 (즉, npm i method-override)
app.put('/edit', function(요청, 응답){
      // app.put('/edit/:id', function(요청, 응답){
  
  // form에서 전송한 제목, 날짜 데이터를 가지고 db.collection('postCol')에서 게시물 찾아서 update함
  // edit.ejs form 태그의 action 및 method 속성 설정(즉, PUT 또는 DELETE 요청 위해서)과 라이브러리(method-override) 설치 및 사용 확인요
  // .updateOne({어떤 게시물 수정할 건지}, {수정값}, 콜백함수)
  // [ mongodb 문법 ] $set은 업데이트 또는 새로 추가(즉, 없으면 추가)하는 기능을 해줌. 여러가지 operator 중에($inc 등) 한 가지임. 사용 형식은 { $set : { KEY : VALUE } }
  // 요청.body에는 edit.ejs input 태그에 직접 작명한 name 속성명들이 보유한 value 값이 담겨있음
  let editputdbid = parseInt(요청.body.editputdbid);
  console.log('parseInt 적용한 editputdbid는', editputdbid);

  let edittitle = 요청.body.title;
  let editdate = 요청.body.date;

  db.collection('postCol').updateOne({_id: editputdbid},{ $set: {제목: edittitle, 날짜: editdate}}, function(에러, 결과){
    console.log('edit PUT 수정완료', editputdbid, edittitle, editdate);
    응답.redirect('/list');
  })
})

// HTML form 태그 PUT, DELETE 요청 지정하기 위해 method-override 라이브러리 설치 후 server.js에서 라이브러리 호출 및 사용함 (즉, npm i method-override)
app.put('/mypage', function(요청, 응답){
  // app.put('/mypage/:id', function(요청, 응답){

// form에서 전송한 db아이디(숨겨진 input), 사용자 아이디, 변경할 비밀번호 가지고 db.collection('postCol')에서 게시물 찾아서 update함
// edit.ejs form 태그의 action 및 method 속성 설정(즉, PUT 또는 DELETE 요청 위해서)과 라이브러리(method-override) 설치 및 사용 확인요
// .updateOne({어떤 게시물 수정할 건지}, {수정값}, 콜백함수)
// [ mongodb 문법 ] $set은 업데이트 또는 새로 추가(즉, 없으면 추가)하는 기능을 해줌. 여러가지 operator 중에($inc 등) 한 가지임. 사용 형식은 { $set : { KEY : VALUE } }
// 요청.body에는 mypage.ejs input 태그에 직접 작명한 name 속성명들이 보유한 value 값이 담겨있음

    let mypageputdbid= 요청.body.mypageputdbid;
let uniqueid = 요청.body.uniqueid;
let newpw = 요청.body.newpw;

console.log('mypage PUT 요청에 들어온 dbid와 newpw 값은', 요청.body);

// 혼자 해볼 것들: ?? 질문?? {어떤 게시물 수정할 건지} 오브젝트를 db 고유 아이디인 { _id : mypageputdbid } 로 지정하면 정상동작하지 않는 이유? 사용자 아이디인 { id: uniqueid }로는 됨. 어디에 오타? 어디에 논리오류?
db.collection('loginCol').updateOne({id: uniqueid},{ $set: {pw: newpw} }, function(에러, 결과){
console.log('loginCol의 updateOne 파라미터 _id, id, pw는', mypageputdbid, uniqueid, newpw);
응답.redirect('/list');
})
})

// Session 방식으로 회원인증 로그인 기능 구현하기 위한 라이브러리 설치 및 사용 (즉, npm i passport passport-local express-session)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// https://www.npmjs.com/package/passport
// [Express 문법] app.use(미들웨어)는 server는 요청, 응답해 주는 역할을 하는데 그 중간에서 뭔가 뭔가 실행되는 코드임
app.use(session({ secret: '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// 기능 구현순서 발상요령 팁 ★★★ : 역순으로 개발 (로그인 기능 구현 위해 회원가입 기능부터 만들기보다는 DB에 직접 ID/PW 한 쌍을 임의로 만들어 기능 구현하기)
// 혼자 해볼 것들 ★★★ : 회원가입 제작하기 (즉, 회원가입 form을 전송하면 db에 저장되도록 제작요 / ID, email, 전화번호 등 db에 저장되기 전에 맞춤형 미들웨어와 정규표현식으로 중복검사와 유효성 검사요)
app.get('/login', function(요청, 응답){
  // 주의: 코드 리팩토링 방법 터득요. login.ejs와 loginrequired.ejs는 errorMessage 오브젝트 전달 유무와 form action 경로 차이. 동일 코드를 2개의 페이지로 중복운영.
  응답.render('login.ejs');
})

app.get('/fail', function(요청, 응답){
  응답.render('fail.ejs', { errorMessage: 'ID 또는 PW가 유효하지 않습니다.'})
})

// [ 인증 STEP 03 - Express, Passport 문법 ] 로그인 성공하여 Session 보유한 사용자만이 /mypage GET요청시 페이지 접근 허용되도록 맞춤형 미들웨어 제작해 라우팅과 결합
// 주의: hash 함수 적용해서 변경한 비밀번호도 hash 코드로 db에 update 저장되도록 코드 수정요
// [ Express 문법 ] 특정 라우터에 미들웨어 적용하고 싶으면 app.get('/mypage', 로그인했는지검사하는미들웨어, function(요청, 응답){} 구조로 미들웨어 삽입요
app.get('/mypage', 로그인했는지검사하는미들웨어, function(요청, 응답){
  
  // deserializeUser() 내장함수 속 결과 파라미터에 담긴 사용자의 각종 부가적 개인정보가 본 코드의 요청.user로 넘어옴
  console.log('deserializeUser()의 결과 파리미터로부터 넘어온 요청.user에 담긴 값은', 요청.user);

  응답.render('mypage.ejs', { loginedUserInfo: 요청.user });
})

// [ 인증 STEP 03 - Express, Passport 문법 ] 로그인 성공하여 Session 보유한 사용자만이 /mypage GET요청시 페이지 접근 허용되도록 맞춤형 미들웨어 제작해 라우팅과 결합
function 로그인했는지검사하는미들웨어(요청, 응답, next){
  
  console.log('로그인했는지검사하는미들웨어 요청.user는', 요청.user);
  
  // 로그인 후 session 있으면 요청.user가 항상 있으므로 사용자를 next() (즉, 통과)시키고 요청.user가 없다면 로그인 요청하는 메시지 보여줌
  if(요청.user){
    next()
  } else {
    // 주의: 코드 리팩토링 방법 터득요. login.ejs와 loginrequired.ejs는 errorMessage 오브젝트 전달 유무와 form action 경로 차이. 동일 코드를 2개의 페이지로 중복운영.
    응답.render('loginrequired.ejs', { errorMessage: '해당 페이지는 로그인이 필요합니다'})
  }
}

// https://www.npmjs.com/package/passport
// [ 로그인 세션 인증 passport 주요 절차 약식 골격 A ] passport.authenticate() 미들웨어가 포함된 app.post('/login', function(요청, 응답){}) 
// [ 로그인 세션 인증 passport 주요 절차 약식 골격 B ] passport.use(new LocalStrategy({}) 
// [ 로그인 세션 인증 passport 주요 절차 약식 골격 C ] passport.serializeUser(function(user, done){}
// [ 로그인 세션 인증 passport 주요 절차 약식 골격 D ] passport.deserializeUser(function(아이디, done){}

// 서버 재시작(껐다 켜기) 하면 session 정보 휘발됨
// [ 인증 STEP 01 - Passport 문법 ] .authenticate() 내장함수를 통해 login.ejs에서 form 태그를 POST 요청으로 submit시 ID, PW 검사함 (주의: 인증 방식은 라이브러리(passport, passport-local, express-session) 연동한 별도의 세부코드를 작성해야 함)
app.post('/login', passport.authenticate('local', { failureRedirect: '/fail'}), function(요청, 응답){
  
  // login.ejs에서 submit하여 POST 요청하면 요청.body에 담기는 데이터는 { id: 'test', pw: 'test' } 형태임
  console.log('인증 STEP 01 코드 내부에서', 요청.body);
  
  응답.redirect('/');
})

// 서버 재시작(껐다 켜기) 하면 session 정보 휘발됨
// [ 인증 STEP 02 - Passport, Passport-local의 Strategy 클래스, Express-session 문법 ] 주의: 인증 방식은 라이브러리(passport, passport-local, express-session) 연동한 별도의 세부코드를 작성해야 함
//  주의! - passport.authenticate('local', { failureRedirect: '/fail'}) 부분 코드 때문에 로그인 할 때만 passport.use(new LocalStrategy({}, function{}) 부문 코드가 동작함
passport.use(new LocalStrategy({
  // 사용자가 login.ejs 페이지에서 입력한 input 태그의 name 속성명
  usernameField: 'id',
  passwordField: 'pw',

  // 로그인 후 session을 저장함 (즉, true)
  session: true,
  
            // ID, PW 이외에 다른 정보도 검증하려면 true 설정 후 바로 뒤이은 callback 함수 코드에 파라미터(예- req)를 추가해 값을 받아와(예- req.body) 처리하면 됨
            // passReqToCallback: true,
            // }, function(req, 입력한아이디, 입력한비번, done){
  
  passReqToCallback: false,
  }, function(입력한아이디, 입력한비번, done){
    console.log('인증 STEP 02 코드 내부에서', 입력한아이디, 입력한비번)

    /*
    1. DB에서 {id : 입력한아이디} 인 문서를 찾은 다음에
    2. 그게 있으면 그 문서에 있는 pw 값과 입력한 비번을 비교하면 되지 않을까요?
    3. 성공하면 찾은 유저를 출력해주든가 그러시면 되겠군요. 
    */

    db.collection('loginCol').findOne( { id: 입력한아이디 }, function(에러, 결과){
      
      // [ 문법 (?어디 소속?) ] done(서버 에러, 성공시 사용자 DB데이터, 에러메시지)
      /*
      done이 인자를 세 개나 받아 헷갈릴 수도 있는데 다음과 같습니다. 
      첫 번째 인자는 DB조회 같은 때 발생하는 서버 에러를 넣는 곳입니다. 무조건 실패하는 경우에만 사용합니다. 
      두 번째 인자는 성공했을 때 return할 값을 넣는 곳이고요. 성공했으면 당연히 첫 번째 인자는 null이어야겠죠? 에러가 있으면 안 되니까요. 
      세 번째 인자는 언제 사용하나면, 사용자가 임의로 실패를 만들고 싶을 때 사용합니다. 
      
      첫 번째 인자를 사용하는 경우는 서버에서 에러가 났을 때 무조건 실패하는 경우라고 했죠. 
      세 번째 인자는 위에서 비밀번호가 틀렸다는 에러를 표현하고 싶을 때 사용하면 됩니다. 
      이것은 서버 에러도 아니고, 사용자가 임의로 만드는 에러이기 때문에, 직접 에러 메시지도 써주는 겁니다.
      */
      if(에러) return done(에러)
      
      // ?? 코애 질문:  message 오브젝트는 어디에서 넘겨받으라고? fail.ejs?
      if(!결과) return done(null, flase, { message: '존재하지 않는 ID 입니다'})

      // 주의: 보안에 취약한 코드 구조(pw가 암호화되지 않음 - 예: hash함수 적용된 암호끼리 일치여부 대조요)라는 문제점
      // [ Javascript 문법 ] == 등호와 === 등호
      if(입력한비번 == 결과.pw){
        // ID, PW 모두 일치하여 로그인 성공했다면 session을 만들어서 사용자가 로그인 했다는 정보를 저장해 놓고 마이페이지 방문시 session 검사해야 함
        return done(null, 결과)
          /*         
          지금 if ( 입력한비번 == 결과.pw ) 라는 부분에서 사용자가 입력한 비밀번호와 DB의 pw 항목을 같은지 비교하고 있는데

            - 애초에 DB에 pw를 저장할 때 암호화해서 저장하는 것이 좋으며
            - 사용자가 입력한 비번을 암호화해준 뒤에 이게 결과.pw와 같은지 비교하는게 조금 더 보안에 신경쓴 방법입니다. 

          하지만 보안보안 암호화암호화 거리면 강의가 너무나 복잡해져서 이해도가 떨어질 수 있기 때문에
          나중에 구글에 좋은 비번저장 예제를 찾아서 한번 그대로 적용해보시길 바랍니다. 
          */
      } else {
        // ?? 코애 질문:  message 오브젝트는 어디에서 넘겨받으라고? fail.ejs?
        return done(null, false, { message: '틀린 PW 입니다'})
      }
    })
  })
)
// 서버 재시작(껐다 켜기) 하면 session 정보 휘발됨
// [ 인증 STEP 03 - Express, Passport 문법 ] 로그인 성공한 사용자의 Session을 저장함 (즉, STEP 01 로그인 성공 -> STEP 02 세션 + 쿠키 만듦 -> STEP 03 마이페이지 방문시 세션검사)
// [ 인증 STEP 03 - Express, Passport 문법 ] .serializeUser() 내장함수 기반으로 id를 이용해서 session을 저장시킴 (로그인 성공시 발동)
// [ 인증 STEP 03 - Express, Passport 문법 ] ★★★ 인증 STEP 02 코드에서 ID,PW 검증 성공시 return done(null, 결과)의 결과 속에 담긴 내용이 .serializeUser() 내장함수의 callback 함수의 user 파라미터 속으로 들어오게 됨
passport.serializeUser(function(user, done){ // ★★★★★★★★
  // session 데이터를 만들고 session의 id 정보를 cookie로 보냄 (르그인 성공 후 크롬 개발자 도구 > application > storage > cookies 에서 생성된 session 확인 가능함)
  console.log('인증 STEP 03 serializeUser 코드 내부에서 user 파라미터 속 내용은', user);
  done(null, user.id);
});

// 서버 재시작(껐다 켜기) 하면 session 정보 휘발됨
// [ 인증 STEP 03 - Express, Passport 문법 ] .deserializeUser() 내장함수 기반으로 session 있는 사용자만 이용 가능한 마이페이지 접속시 발동. (즉, 로그인한 사용자의 SESSION ID를 바탕으로 개인정보(그 외 이름, 성별, 나이 등)를 DB에서 찾아서 마이페이지에서 출력하도록 돕는 역할)
// [ 인증 STEP 03 - Express, Passport 문법 ] db에서 deserializeUser() 함수를 통해 db에서 아이디 라는 파라미터(즉, user.id) 로 사용자를 찾은 후 사용자 정보를 .deserializeUser() 내장함수의 done 함수의 결과 라는 파라미터로 넣음
// serializeUser 내부 done 콜백함수의 user.id 값이 deserializeuser 내부 콜백함수의 아이디 파라미터로 넘어옴
passport.deserializeUser(function(아이디, done){
  console.log('인증 STEP 03 deserializeUser 코드 내부에서 <아이디>라는 파라미터는 ', 아이디);

  // 마이페이지 접속시 db에서 { id: 어쩌구 } 인걸 찾아서 그 결과를 보내줌
  db.collection('loginCol').findOne({ id: 아이디}, function(에러, 결과){
    console.log('인증 STEP 03 deserializeUser 코드 내부에서 결과 파라미터에 담긴 값은', 결과);
    done(null, 결과);
  })
});

// passport 셋팅 기반으로 회원가입 기능 코드를 개발하기 때문에 passport 코드가 선위치 해야 함
app.post('/register', function(요청, 응답){
  // [ Mongo DB 문법 ] 코드 보완요 ★★★ 회원가입은 무조건 선 ID 중복검사 / 후 db.collection('loginCol').insertOne() 쿼리 진행요
  // [ Javascript & 정규식 ] 코드 보완요 ★★★ 유효성 검사 예- ID 에 알파벳/숫자만 기입했나 / PW 저장 전에 암호화 했나
  
  // [ Mongo DB 문법 ] 정수형 _id 값을 설정한 postCol 스키마와는 다르게 loginCol 스키마에서는 애초에 정수로 _id 값 지정할 이유 없으므로 Mongo DB 가 기본적으로 부여하는 Object 형태의 _id 값을 그대로 이용함
  console.log('요청.body ------', 요청.body)
  var resultRegiter = db.collection('loginCol').insertOne({ id: 요청.body.regid, pw: 요청.body.regpw})
  
  console.log('resultRegister---------', resultRegiter);
  응답.redirect('/')
})

app.get('/write', function(요청, 응답){
  응답.render('write.ejs');
})

// /write 경로로 POST 요청하면 ~를 해주세요
// form 태그 action="/write" method="POST"
// form input에 적은 정보는 요청 파라미터에 들어있음(express라이브러리에 body-parser 라이브러리도 내장됨)
// express 미포함 시절에는 (1) npm install body-parser (2) const bodyParse = require('body-Parser'); app.use(express.urlencoded({extended: true}));
// body-Parser 라이브러리(input 태그에 적은 내용 해석 도와줌) 실행 app.use(express.urlencoded({extended: true}));
// POST 요청으로 서버에 데이터 전송하려면 (1) body-Parser(input 태그에 적은 내용 해석 도와줌) 코드실행 app.use(express.urlencoded({extended: true})); (2) form데이터 input태그들에 name 쓰기 (3) 요청.body (ex: 요청.body.인풋 태그 name 속성의 값)라고 하면 form에서 보낸 자료 수신가능
// 게시물 업로더 당사자에게만 게시물 삭제 권한 부여하기 위해 게시물 등록될 때 { 작성자: 요청.user._id } 값을 활용해 게시물 소유자 기록요
// [ express-session & passport & passport-local ] ★★★★★ 코드 배치 순서가 실행을 좌우한다 app.get('/write', function(요청, 응답){}) 내부의 { 작성자: 요청.user._id } 코드에 대해 TypeError: Cannot read property '_id' of undefined
// [ express-session & passport & passport-local ] ★★★★★ 코드 배치 순서가 실행을 좌우한다 app.get('/write', function(요청, 응답){}) 코드는 app.post('/login', function(요청, 응답){}) 코드와 더불어 이와 연계된 passport 세션 인증 코드가 끝나는 지점 이후에 위치해야 세션 인증 이후에 생성되는 요청.user._id 를 활용할 수 있음
app.post('/write', function(요청, 응답){
    
  // console.log(요청.body.title)
  // console.log(요청.body.date)
  console.log('write POST 게시물 등록시 요청.user --------- ', 요청.user);

  // Crud 기능: /write 페이지에서 form submit하여 /add로 POST 요청하면 todoapp 데이터베이스의 postCol 컬렉션에 해당 값 인서트
  // 올바른 게시물 DB 넘버링 원칙 (마치 영구결번처럼): 삭제된 게시물일지라도 그 게시물의 넘버링 값은 유니크하게 유지되어야 함

  db.collection('counterCol').findOne({name: '게시물갯수'}, function(에러, 결과){
    let 총게시물갯수 = 결과.totalPost;

    // 게시물 업로더 당사자에게만 게시물 삭제 권한 부여하기 위해 게시물 등록될 때 { 작성자: 요청.user._id } 값을 활용해 게시물 소유자 기록요
    // [ express-session & passport & passport-local ] ★★★★★ 코드 배치 순서가 실행을 좌우한다 app.get('/write', function(요청, 응답){}) 내부의 { 작성자: 요청.user._id } 코드에 대해 TypeError: Cannot read property '_id' of undefined
    // [ express-session & passport & passport-local ] ★★★★★ 코드 배치 순서가 실행을 좌우한다 app.get('/write', function(요청, 응답){}) 코드는 app.post('/login', function(요청, 응답){}) 코드와 더불어 이와 연계된 passport 세션 인증 코드가 끝나는 지점 이후에 위치해야 세션 인증 이후에 생성되는 요청.user._id 를 활용할 수 있음
    let 업로드요청한게시물 = { _id: 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date, 작성자: 요청.user._id };
    
    // 인서트 직전 시점까지의 총게시물갯수를 counterCol에서 찾은 후 postCol에 인서트하면서 _id : 총게시물갯수+1로 넘버링 함
    db.collection('postCol').insertOne(업로드요청한게시물, function(에러, 결과){
      console.log('form submit 저장완료')

      // crUd 기능: counterCol 컬렉션의 totalPost 항목도 1 증가시켜야 함 (즉, 1게시물 증가, 1카운터 증가)
      // [Mongo DB 문법] 연산자(operator) 예시(그외많음): 변경은 { $set: { key: 바꿀값 } } / 증가는 { $inc { key: 기존값에 더해줄 값(음수도 가능)} } / 기존값보다 작을 때만 변경은 {$min : } {min : []} / key값 이름변경은 $rename 등등
    
      db.collection('counterCol').updateOne({ name: '게시물갯수' }, {$inc: { totalPost: 1}}, function(에러, 결과){
        if(에러) return console.log('updateOne 에러 발생:', 에러);
        
        // ??? 재확인요: 두 번째 form submit 후에 총게시물갯수 콘솔로그값이 2가 나올 줄 알았는데 1이 나옴. 콘솔로그 위치문제? 콘솔로그 내용 자체 문제? 둘다?
            console.log('총게시물갯수는', 총게시물갯수);
      })
    })
  });  

    // ?? 재확인요: 응답.send 대신에 응답.render로 list.ejs 페이지 연결하려는데 왜 Error: Failed to lookup view "./views/list.ejs" in views directory "./views" 이런 오류 나는지
    // 작성페이지에서 submit 이후에 응답.render('list.ejs');코드로는 오류나고 응답.redirect('/list'); 코드로는 리스트페이지로 이동 성공??
      // 응답.render('list.ejs');
      // 응답.send('/add로 전송완료')
      console.log('리다이렉트 직전')
      응답.redirect('/list');
      console.log('리다이렉트 직후')
})

// JQuery Min 버전(X: Slim Min) CDN 연동 후 JQuery 문법에 기반하여 AJAX 요청 구현(HTML에서 DELETE요청)
// EJS, HTML 에서 AJAX 코드로 서버에 DELETE 요청 보낸 것을 express의 app.delete가 받아서 MongoDB로 DELETE 요청해줌
// [ express-session & passport & passport-local ] ★★★★★ 코드 배치 순서가 실행을 좌우한다 app.delete('/delete', function(요청, 응답){} 코드는 app.post('/login', function(요청, 응답){}) 코드와 더불어 이와 연계된 passport 세션 인증 코드가 끝나는 지점 이후에 위치해야 세션 인증 이후에 생성되는 요청.user._id 를 활용할 수 있음
app.delete('/delete', function(요청, 응답){
  // AJAX로 DELETE 요청( 즉, $ajax({ }) )하면 게시물 번호( 즉, $ajax.( { method: , url: , _id: } ) 속에 담긴 _id 정보)도 서버에 보내주세요
  // 주의: ejs 파일 내에서 사용자가 클릭한 삭제 버튼에 부여된 _id를 식별하기 위해 data-창작명 문법을 사용하는 올바른 문법은 data-소문자(언더바 가능)= / 틀린 문법은 data-카멜케이스와 마이너스 기호와 콜론(data-list--Id:)
  // 요청.body로 들어오는 데이터는 list.ejs 코드의 button 태그 속성으로 data-소문자(언더바 가능)= 문법을 활용해 li_tag_data_id라고 창작한 속석명 앞에 data- 속성 지정 접두어를 붙여 data-li_tag_data_id= "<%= postResult[i]._id %>" 라고 보낸 데이터인 _id 값임
  console.log('DELETE하기 위해 AJAX로 서버에 보내려는 데이터', 요청.body);
  
  // Object 자료 다루기 스킬 설명: AJAX 요청 코드에서 { data: { _id: 숫자 } } 문법으로 보냈지만 데이터 내부 처리 과정에서 epxress의 app.delete 함수에서 받은 요청.body에는 { _id: 문자형 숫자 } 자료형 변환 이뤄졌기에 parseInt(요청.body._id) 문법을 통해 다시 숫자 자료형으로 치환해야 함
  요청.body._id = parseInt(요청.body._id);

  // 게시물의 작성자 _id 와 로그인한 사용자의 _id 가 일치하면 게시물 삭제 기능 실행
  // [ express-session & passport & passport-local ] ★★★★★ 코드 배치 순서가 실행을 좌우한다 app.delete('/delete', function(요청, 응답){} 코드는 app.post('/login', function(요청, 응답){}) 코드와 더불어 이와 연계된 passport 세션 인증 코드가 끝나는 지점 이후에 위치해야 세션 인증 이후에 생성되는 요청.user._id 를 활용할 수 있음
  var 삭제할데이터 = { _id: 요청.body._id, 작성자: 요청.user._id };

  // 요청.body에 담긴 게시물 번호에 따라 MongoDB에서 게시물 삭제
  // [ MongoDB 문법 ] deleteOne( -어떤 항목을 삭제할지-, -DELETE요청 성공했을 때 실행할 내용-) 함수 문법으로 게시물 하나 삭제
  // 요청.body._id 자료형은 숫자형(ejs파일 속 $.ajax함수) -> 문자형 숫자(js파일 속 express의 app.delete함수) -> 숫자형(js파일 속 MongoDB의 db.collection(' ').deleteOne함수)
  db.collection('postCol').deleteOne(삭제할데이터, function(에러, 결과){
            // db.collection('postCol').deleteOne(요청.body, function(에러, 결과){
    
    // 요청이 성공했다고 브라우저단( ejs파일의 $.ajax( { }).done( ).fail ( ) )에 알려주는 코드
    // 중요: 서버는 꼭 뭔가 응답해줘야 함
    // 요청에 대한 응답.내장함수는 한 번만 작성가능함 Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client 
    // ★★★ 주의! - 상태코드를 무조건 .status(200) 으로 성공 처리시키는 논리적 허점 존재함
    // ★★★ 주의! - [ JQuery & AJAX 문법 ] list.js 에서 $.ajax( { } ).done( ).fail( ) 코드 입장에서는 내가 보낸 요청에 대해 서버단에서 처리 성공했는지 실패했는지 모름
    // ★★★ 주의! - [ JQuery & AJAX 문법 ] list.js 에서 $.ajax( { } ).done( ).fail( ) 코드에서 .fail() 부문 동작 확인하려고 무조건 .status(400) 으로 에러 던지게 테스트함 / db.collection('postCol').deleteOne(요청.body, function(에러, 결과){응답.status(400).send()}         
    응답.status(200).send( { message: '$.ajax DELETE 요청 성공 from server'});

    // [ MongoDB 문법 ] 현실적으로는 삭제 실패시 nodejs 터미널에 에러는 뜨지 않고 결과만 0 으로 나옴
    console.log('app.delete /delete ---- deleteOne함수 에러 여부', 에러);
    if(결과){ console.log('app.delete /delete ---- 결과.result.n --- 삭제된 결과물 수(게시물 소유자가 아니면 삭제 승인되지 않아 0개로 표시됨) ------', 결과.result.n)};
  })
});

// [ Mongo DB 문법^^ ] 형변환을 위한 ObjectId() 문법을 사용하려면 코드 상단부에 const { ObjectId } = require('mongodb'); 기능 사용 명시요
const { ObjectId } = require('mongodb');

// [ Express 문법^^ ] 채팅 기능 코드가 배치돼야 할 위치는 passport 세션 인증 기반의 로그인 기능 코드 하단부에 위치해야 정상 동작함
// list.ejs 로부터 채팅 버튼 클릭 이벤트 발생으로 채팅 당한사람id(즉, 작성자) 값을 받아와 로그인했는지검사하는미들웨어를 거친후 서버에 전달해 당한사람(즉, 요청.body.당한사람.id)과 건사람(즉, 요청.user._id) 사이에 채팅방 개설
app.post('/chatroom', 로그인했는지검사하는미들웨어, function(요청, 응답){

  var 개설할채팅방정보 = {
    title: 'aaaaa',
    // [ Mongo DB 문법^^ ] String 형태인 요청.body.당한사람id 값(즉, "62b9216e37eec08ddc82a0bd")을 Object 형으로 변경요
    // [ Mongo DB 문법^^ ] 형변환을 위한 ObjectId() 문법을 사용하려면 코드 상단부에 const { ObjectId } = require('mongodb'); 기능 사용 명시요
    member: [ObjectId(요청.body.당한사람id), 요청.user._id],
            // member: [요청.body.당한사람id, 요청.user._id],
    date: new Date()
  }

  // [ Mongo DB 문법^^ ] insertOne 쿼리문 내에 콜백함수 작성하는 대신에 .insertOne().then() 문법으로 대체 사용 가능
  db.collection('chatroomCol').insertOne(개설할채팅방정보).then((결과)=>{
    
    // 브라우저에서 안보이는데???
    응답.send('채팅방개설성공');

    console.log(`채팅방개설성공 - ${요청.user._id} 사용자가 ${요청.body.당한사람id} 사용자에게 `);
  })
})

// [ Express 문법^^ ] /chat 접속시 채팅방 내부 페이지인 chat.ejs 보여주기
app.get('/chat', 로그인했는지검사하는미들웨어, function(요청, 응답){
  
  // [ Mongo DB 문법^^ ] /chat 접속시 내가 속한 모든 채티방 목록도 보여주기(즉, chatroom member 항목)
  // [ Mongo DB 문법^^ ] array (즉, 배열 형태로 생긴 member: [어쩌구, 어쩌구] ) 내부에서 한 개의 속성에 대해 검색하는 경우에 한하여 별도 쿼리문 활용하지 않고 .find({ member: 요청.user._id }) 형태로 쿼리 가능
  db.collection('chatroomCol').find({ member: 요청.user._id }).toArray().then((결과)=>{
    응답.render('chat.ejs', { myChatroomList: 결과 });
  })
})

// [ Express 문법^^ ] chat.ejs 에서 전송 버튼 클릭하여 최소정보송신용꾸러미(즉, 송신하려는메시지 와 지금누른채팅방id) 를 $.post('/message', 최소정보송신용꾸러미).then(() => {}) 코드를 통해 서버로 전송함
// [ Express 문법^^ ] 메시지송신자id /  날짜 값 / chat.ejs 로부터 받은 송신하려는메시지 / chat.ejs 로부터 받은 지금누른채팅방id 를 messageCol 에 저장함
app.post('/message', 로그인했는지검사하는미들웨어, function(요청, 응답){
  
  var 송신발저장용꾸러미 = {
    parent: 요청.body.parent, // chat.ejs 로부터 받은 지금누른채팅방id
    content: 요청.body.content, // chat.ejs 로부터 받은 송신하려는메시지
    senderid: 요청.user._id, // 메시지송신자id
    date: new Date(), // 날짜
  }
  console.log('server.js ---- 송신발저장용꾸러미 ----', 송신발저장용꾸러미);

  db.collection('messageCol').insertOne(송신발저장용꾸러미).then(() => {
    응답.send('messageCol 에 송신발저장용꾸러미 저장 성공');
    console.log('messageCol 에 송신발저장용꾸러미 저장 성공');
  })
})