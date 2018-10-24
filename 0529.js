/*
	날짜표현식 : $year, $month, $dayOfMonth, $dayOfwWeek,
	          $dayOfYear, $hour, $minute, $second
*/
db.employees.aggregate();

// 입사년도 조회
db.employees.aggregate(
	{$project : {hireInYear : {$year : '$hiredate'}}}
);

// 채용된 달 조회
db.employees.aggregate(
	{$project : {hireInMonth : {$month : '$hiredate'}}}
);

// 각 사원의 근무년수 조회
db.employees.aggregate(
	{$project : 
	  {duringYear : 
	    {$subtract : [{$year : new Date()}, 
	      			  {$year : '$hiredate'}]}}}
);

// 달별 입사인원수 조회
db.employees.aggregate(
	{$project : {hireInMonth : {$month : '$hiredate'}}},
	{$group : {_id : '$hireInMonth', count : {$sum : 1}}},
	{$sort : {_id : -1}}
);

// 입사년도 월별 인원수 조회
db.employees.aggregate(
	{$group : {_id : {hireInMonth : {$month : '$hiredate'},
	                   hireInYear : {$year : '$hiredate'} },
	           count : {$sum : 1}}}
);

/*
	문자열 표현식
	$substr : [value, 시작인덱스, 길이]
	$concat : [value, value[, value...]]
	$toLower : value
	$toUpper : value
*/
db.employees.aggregate(
	{$project : {email : {$concat : [{$substr : ['$job', 0, 2]}, 
	  								 '.',
	                                 '$ename', 
	                                 '@bit.co.kr']}}}
);

db.employees.aggregate(
	{$project : {email : {$toLower : {$concat : [{$substr : ['$job', 0, 2]}, 
	  								 '.',
	                                 '$ename', 
	                                 '@bit.co.kr']}}}}
);
/*
	논리표현식
	$cmp : [value, value]
	$strcasecmp
	$eq, $ne, $gte, $lte, $gt, $lt
	$and, $or, $not
	$cond : [boolean표현식, 참, 거짓]
	$ifNull : [value, 대체value]
	
	묶음연산자 
	$sum, $avg
*/
//deptno 별 sal 총액 조회

db.employees.aggregate([
        
        {$group : {_id : '$deptno'}}
])


db.employees.aggregate([
        {$group : {_id : '$deptno' ,totalSal : {$sum :'$sal'}}}
])

//deptno 별 sal 평균
        
db.employees.aggregate([
    {$group :{_id : '$deptno', avgSag : {$avg : '$sal'}
    ,totalSal : {$sum :'$sal'}, count : {$sum : 1}}}    
  ])


/*
  $max : value
  $min : value
  $first : value
  $last : value
    */
//부ㅊ별 최대급여, 최소급여
db.employees.aggregate([
    {$group : {_id : '$deptno', maxSal : {$max : '$sal'}, minSal : {$min : '$sal'}}}
    ,{$sort : {_id: 1}}
    ])

db.employees.aggregate([
    {$sort : {sal : 1}}
    ,{$group :{_id :'$deptno',
     MaxSalary : {$last : '$sal'}, MinSalary : {$first : '$sal'}}}
    ])

 /*
   $unwind : 배열의 원소들을 별개의 문서로 변환
   예시 : 댓글 => board 
   
    */   
db.users.aggregate([
     {$project : {hobby : 1}} 
     ])   
  
     
db.users.aggregate([
     {$project : {hobby : '$hobby'}},
     {$unwind : '$hobby'},
     {$match :{hobby : 'reading'}}
     
     ])
db.zipcode.drop()
     
db.zipcode.aggregate([])

/*
     fisher Island 도시의 인구수조회
 */
db.zipcode.aggregate([
     {$project : {city : '$city'}}     
     ,{$match : {city : 'FISHERS ISLAND'}}
     ])
     
db.zipcode.aggregate([
     {$match : {city : 'NEW YORK'}}
     ])
/*
     부서번호가 30 이고 급여가 500이상 3000이하인 사원이면서 
     직업이 cleark 이거나 salesman 인 사원의 empno, enmae, jobm, sal
     */

db.employees.aggregate([
    
     {$match : {deptno : 30, sal : {$gte : 500 , $lte : 3000}
                , job : {$in : ['CLERK','SALESMAN']}}},
      {$project : {emp :1, ename:1, job:1, sal :1, _id :0}}
                
     ])  
     
     
 /*
   부서번호가 30 이고
    empno, ename, sal, comm을 출력하는데
    comm이 없으면 0으로 표시
      sal + comm의 값을 total_sal 표시하여 출려
 */

db.employees.aggregate([
      {$match : {deptno : 30}}
      , {$project : {empno :1 , ename : 1, sal : 1
          , comm :{$ifNull : ['$comm', 0]}
          , total_sal : {$sum : ['$sal','$comm']}}}
           //, total_sal : {$add : ['$sal',{$ifNull : ['$comm' ,0]}}}
      ])
     
db.employees.aggregate([
      {$match : {deptno : 30}}
      , {$project : {empno :1 , ename : 1, sal : 1
          , comm : {$cond : ['$comm' ,'$comm' ,0]}
           ,totoal_sal : {$add : ['$sal', {$cond : ['$comm','$comm',0]}]}}}
          ])     
     
  /*
   map&reduce : 집계연산을 수행 (다수의 분산서버에서 처리)
                분할, 전달, 집계연산 수행 
    단계
    1.map단계 : collection의 모든 문서를 대상으로 연산 매칭을 수행
    2.shuffle 단계 : 키별로 연산 매칭의 데이터를 목록으로 생성 
    3, reduce 단계 : shuffle단계에서 모아진 데이터 목록을 하나의 요소로 집계 
 */
  //employees에 있는 사원수를 조회                     
  
  
   var reduce = function(key, values) {
    var total = 0;
       for(var i =0; i < values.length; i++)
           total += values[i].count;
       return {count : total};
       }
       
db.words.insert({word : 'I am a boy'});
db.words.insert({word : 'You are a girl'});

     
   var reduce = function(key, values){
        var total = 0;
        for (var i in values){
        total = total +values[i].count;
        }  
        return {count : total};
  }
  
 db.runCommand({
    'mapreduce' : 'words',
    'map' : map,
    'reduce' : reduce, 
     'out': {inline : 1}
 });
  
  
 db.words.mapReduce(map,reduce,{'out' : {inline :1}});
 
 
 
 //전체 employees 사원수 조회
 var map = function (){
     emit ('count',1);
 }
 
 var reduce = function (key,value){
     var total = 0;
     for (var i in value){
         total = total + value[i];
     }
     return total;
 }
 db.employees.mapReduce (map,reduce,{'out' : {inline :1}});
/*----------------------------------------------------------------*/
 
 var map = function(){
     var keyArr  = ['empno','deptno', 'comm','sal',
                '_id','hiredate','ename','bonus','job'];
  
 }
 
 var reduce = function(key, values) {
    var total = 0;
       for(var i =0; i < values.length; i++)
           total += values[i].count;
       return {count : total};
       }
 
 
 db.employees.mapReduce (map,reduce,{'out' : {inline :1}});
 /*---------------------------------*/
 db.words.insert({word : 'I am a girl'});

db.words.aggregate([]);

  var map = function(){
     var wordArr = this.word.split(' ');
     for(var i = 0; i<wordArr.length; i++){
            var key = wordArr[i];
            var value = {count:1};
            emit(key,value);
         }
      }    
 
 
 
 
 
 
 
 
 
 
 
  
  