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
const PORT = 8080;
const MYDBURL = 'mongodb+srv://admin:qwer1234@cluster0.k01og.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const MongoClient = require('mongodb').MongoClient;
      // import { default as mongodb } from 'mongodb';
      // let MongoClient = mongodb.MongoClient;

// mongoDB database 변수 선언
let db;

// [ mongoDB Connection Guide ] https://docs.mongodb.com/drivers/node/current/fundamentals/connection/
// mongoDB connect 파라미터 값으로 {useUnifiedTopology:true} 추가함
// 이유(노드서버 실행시 경고문구 나옴): To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
MongoClient.connect(MYDBURL, {useUnifiedTopology:true}, function(에러, client){

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
  app.listen(PORT, function(){
  console.log(`listening on ${PORT}`)
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

// 껐다 켜기 귀찮으니 npm install -g nodemon 

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
  let editput = parseInt(요청.body.editput);
  let edittitle = 요청.body.title;
  let editdate = 요청.body.date;

  db.collection('postCol').updateOne({_id: editput},{ $set: {제목: edittitle, 날짜: editdate}}, function(에러, 결과){
    console.log('수정완료')
    응답.redirect('/list');
  })
})