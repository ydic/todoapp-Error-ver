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

app.get('/', function(요청, 응답){
  // 주의: ejs 엔진이 views 폴더 찾아갈 수 있도록 app.set('views', './views') 코드 작성했으므로 index.ejs 파일에 대한 경로를 views/index.ejs라고 적는 것은 views/views/index.ejs를 찾으라는 말이 되므로 주의
    응답.render('index.ejs');
})

app.get('/write', function(요청, 응답){
  응답.render('write.ejs');
})

// /add 경로로 POST 요청하면 ~를 해주세요
// form 태그 action="/add" method="POST"
// form input에 적은 정보는 요청 파라미터에 들어있음(express라이브러리에 body-parser 라이브러리도 내장됨)
// express 미포함 시절에는 (1) npm install body-parser (2) const bodyParse = require('body-Parser'); app.use(express.urlencoded({extended: true}));
// body-Parser 라이브러리(input 태그에 적은 내용 해석 도와줌) 실행 app.use(express.urlencoded({extended: true}));
// POST 요청으로 서버에 데이터 전송하려면 (1) body-Parser(input 태그에 적은 내용 해석 도와줌) 코드실행 app.use(express.urlencoded({extended: true})); (2) form데이터 input태그들에 name 쓰기 (3) 요청.body (ex: 요청.body.인풋 태그 name 속성의 값)라고 하면 form에서 보낸 자료 수신가능
app.post('/write', function(요청, 응답){
    
  // console.log(요청.body.title)
  // console.log(요청.body.date)

  // Crud 기능: /write 페이지에서 form submit하여 /add로 POST 요청하면 todoapp 데이터베이스의 postCol 컬렉션에 해당 값 인서트
  // 올바른 게시물 DB 넘버링 원칙 (마치 영구결번처럼): 삭제된 게시물일지라도 그 게시물의 넘버링 값은 유니크하게 유지되어야 함

  db.collection('counterCol').findOne({name: '게시물갯수'}, function(에러, 결과){
    let 총게시물갯수 = 결과.totalPost;
    
    // 인서트 직전 시점까지의 총게시물갯수를 counterCol에서 찾은 후 postCol에 인서트하면서 _id : 총게시물갯수+1로 넘버링 함
    db.collection('postCol').insertOne({ _id: 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date}, function(에러, 결과){
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


// JQuery Min 버전(X: Slim Min) CDN 연동 후 JQuery 문법에 기반하여 AJAX 요청 구현(HTML에서 DELETE요청)
// EJS, HTML 에서 AJAX 코드로 서버에 DELETE 요청 보낸 것을 express의 app.delete가 받아서 MongoDB로 DELETE 요청해줌
app.delete('/delete', function(요청, 응답){
  // AJAX로 DELETE 요청( 즉, $ajax({ }) )하면 게시물 번호( 즉, $ajax.( { method: , url: , _id: } ) 속에 담긴 _id 정보)도 서버에 보내주세요
  // 주의: ejs 파일 내에서 사용자가 클릭한 삭제 버튼에 부여된 _id를 식별하기 위해 data-창작명 문법을 사용하는 올바른 문법은 data-소문자(언더바 가능)= / 틀린 문법은 data-카멜케이스와 마이너스 기호와 콜론(data-list--Id:)
  // 요청.body로 들어오는 데이터는 list.ejs 코드의 button 태그 속성으로 data-소문자(언더바 가능)= 문법을 활용해 li_tag_data_id라고 창작한 속석명 앞에 data- 속성 지정 접두어를 붙여 data-li_tag_data_id= "<%= postResult[i]._id %>" 라고 보낸 데이터인 _id 값임
  console.log('DELETE하기 위해 AJAX로 서버에 보내려는 데이터', 요청.body);
  
  // Object 자료 다루기 스킬 설명: AJAX 요청 코드에서 { data: { _id: 숫자 } } 문법으로 보냈지만 데이터 내부 처리 과정에서 epxress의 app.delete 함수에서 받은 요청.body에는 { _id: 문자형 숫자 } 자료형 변환 이뤄졌기에 parseInt(요청.body._id) 문법을 통해 다시 숫자 자료형으로 치환해야 함
  요청.body._id = parseInt(요청.body._id);
  
  // 요청.body에 담긴 게시물 번호에 따라 MongoDB에서 게시물 삭제
  // [ MongoDB 문법 ] deleteOne( -어떤 항목을 삭제할지-, -DELETE요청 성공했을 때 실행할 내용-) 함수 문법으로 게시물 하나 삭제
  // 요청.body._id 자료형은 숫자형(ejs파일 속 $.ajax함수) -> 문자형 숫자(js파일 속 express의 app.delete함수) -> 숫자형(js파일 속 MongoDB의 db.collection(' ').deleteOne함수)
  db.collection('postCol').deleteOne(요청.body, function(에러, 결과){
    
    // 요청이 성공했다고 브라우저단( ejs파일의 $.ajax( { }).done( ).fail ( ) )에 알려주는 코드
    // 중요: 서버는 꼭 뭔가 응답해줘야 함
    // 요청에 대한 응답.내장함수는 한 번만 작성가능함 Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client 
    // ★★★ 주의! - 상태코드를 무조건 .status(200) 으로 성공 처리시키는 논리적 허점 존재함
    // ★★★ 주의! - [ JQuery & AJAX 문법 ] list.js 에서 $.ajax( { } ).done( ).fail( ) 코드 입장에서는 내가 보낸 요청에 대해 서버단에서 처리 성공했는지 실패했는지 모름
    // ★★★ 주의! - [ JQuery & AJAX 문법 ] list.js 에서 $.ajax( { } ).done( ).fail( ) 코드에서 .fail() 부문 동작 확인하려고 무조건 .status(400) 으로 에러 던지게 테스트함 / db.collection('postCol').deleteOne(요청.body, function(에러, 결과){응답.status(400).send()}     
    응답.status(200).send( { message: '$.ajax DELETE 요청 성공 from server'});

    console.log('deleteOne함수 에러 여부', 에러);
  })
});

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