db.test.find();

db.test.insert({
    name : 'aaa',
    age : 10,
    addr : 'seoul'
});

db.test.insert({
    name : 'bbb',
    age : 20,
    addr : 'pusan'
});

db.test.find();

var user = db.test.findOne({name : 'bbb'});
user.age = user.age + 1;
db.test.update(
    {name : 'bbb'},
    user
);
    
db.test.update(
    {name : 'bbb'},
    {$inc : {age : 1}}
);    
    
/*
   update users
      set age = age - 5
    where age = 70 and addr = 'pusan'
*/    
db.users.find(
    {$and : [{age : 55}, {addr : 'pusan'}]}
).count();
    
db.users.update(
    {age : 60, addr : 'pusan'},
    {$inc : {age : -5}},
    {multi : true}
);    
    
db.users.find({user_id : 'hong1'})    

db.users.update(
    {user_id : 'hong1'},
    {$set : {hobby : 'reading'}}
);
    
db.users.update(
    {user_id : 'hong1'},
    {$set : {hobby : ['reading', 'movie']}}
)    
    
db.users.update(
    {user_id : 'hong1'},
    {$unset : {hobby : 1}}
)    

db.users.find({'user_id' : 'hong1'})

db.users.update(
    {user_id : 'hong1'},
    {$push : {hobby : 'reading'}}
)
    
db.users.update(
    {user_id : 'hong1'},
    {$push : {hobby : 'movie'}}
)    
    
// pingpong, music
db.users.update(
    {user_id : 'hong1'},
    {$push : {hobby : {$each : ['pingpong', 'music']}}}
)

db.users.update(
    {user_id : 'hong1'},
    {$unset : {hobby : 1}}
)

db.users.update(
    {user_id : 'hong1'},
    {$push : {hobby : {$each : ['reading', 'music'],
                       $slice : -4
                      }
             }
    }
)

db.users.find({'user_id' : 'hong1'})

db.users.update(
    {user_id : 'hong1'},
    {$push : {hobby : {$each : ['pingpong', 'movie', 'game'],
                       $slice : -4
                      }
             }
    }
)

db.users.find({user_id : 'hong2'})
db.users.update(
    {user_id : 'hong2'},
    {$unset : {hobby : 1}}
)

db.users.update(
    {user_id : 'hong2'},
    {$push : {hobby : {$each : [{name: 'music', cnt : 7},
                                {name: 'reading', cnt : 3},
                                {name: 'movie', cnt : 4}],
                       $sort : {cnt : -1}
                      }
             }
    }
)

db.users.find({user_id : 'hong1'})

db.users.update(
    {user_id : 'hong1', hobby : {$ne : 'reading'}},
    {$push : {hobby : 'reading'}}
)
    
// $addToSet
db.users.update(
    {user_id : 'hong1'},
    {$addToSet : {hobby : 'tennis'}}
)

db.users.find({user_id : 'hong0'})

db.users.update(
    {user_id : 'hong0'},
    {$addToSet : {hobby : 'reading'}}
)

db.users.find({user_id : 'hong1'})

db.users.update(
    {user_id : 'hong1'},
    {$pop : {hobby : 1}}
);

db.users.update(
    {user_id : 'hong1'},
    {$pop : {hobby : -1}}
);
    
db.users.update(
    {user_id : 'hong1'},
    {$pull : {hobby : 'game'}}
)    

db.users.find({user_id : 'hong1'})

db.users.update(
    {user_id : 'hong1'},
    {$set : {'hobby.0' : 'tennis'}}
)

db.users.find({user_id : 'hong2'})

db.users.update(
    {user_id : 'hong2'},
    {$inc : { 'hobby.2.cnt': 1}}
)

db.users.update(
    {user_id : 'hong2', 'hobby.cnt' : 4},
    {$set : {'hobby.$.cnt' : 1}}
)

db.users.update(
    {user_id : 'hong2', 'hobby.cnt' : 1, 'hobby.name' : 'reading'},
    {$set : {'hobby.$.cnt' : 4}}
)    
        
db.users.update(
    {user_id : 'hong2', 
     hobby : {$elemMatch : {cnt : 1, name : 'reading'}}},
    {$set : {'hobby.$.cnt' : 4}}
)

db.test.find();

db.test.update(
	{name : 'aaa'},
	{$inc : {cnt : 1}}
);

db.test.update(
	{name : 'ccc'},
	{$inc : {cnt : 1}},
	true
);

db.test.findAndModify({
  	query : {name : 'ddd'},
  	update : {$inc : {cnt : 1}},
  	upsert : true	// query에 해당하는 문서가 존재하지 않을 시 생성유무 판단
});

/*
	delete from test
*/
db.test.remove({});

/*
	delete from test
	 where name = 'ccc'
*/
db.test.remove(
	{name : 'ccc'}
)

db.test.find()

var page1 = db.users.find().limit(20);
var page2 = db.users.find().skip(20).limit(20);
var page3 = db.users.find().skip(40).limit(20);

while(page1.hasNext()) {
  var data = page1.next();
  print(data.user_id + ' : ' + data.age + ' : ' + data.addr);
}

db.users.count();

db.users.find(
	{user_id : 'hong9992'}
).explain(true);

db.users.find({
  _id : ObjectId("5b0b5186285a47d5c931ad7f")
}).explain(true);

db.users.getIndexes();

db.users.createIndex({user_id : 1});
db.users.createIndex({user_id : 1, age : 1});

db.users.dropIndex({user_id : 1, age : 1});

/*
	집계프레임워크 : 여과, 선출, 묶음, 정렬, 제한, 건너뛰기등을 통해 
	원하는 데이터를 추출하는 방식(파이프방식)
	
	잡지기사에서 가장 많은 기사를 작성한 저자를 검색
	
	1. $project : {저자  : 1}
	2. $group : {저자 : 저자, 기사총합 : {$sum : 1}} 
	3. $sort : {기사총합 : -1}
	4. $limit : 1
	
	$match
	$project
	$group
	$sort
	$limit
	$unwind
*/
// 지역이 부산 인 회원 조회
db.users.find({'addr' : 'pusan'});

db.users.aggregate(
	{$match : {addr : 'pusan'}}
);

// 지역이 부산이면서 나이가 40세이상인 회원 조회
db.users.aggregate(
	{$match : {addr : 'pusan'}},
	{$match : {age : {$gte : 40}}}
);

// $project : 하위문서의 필드를 추출하여 새로운 문서 생성(필드명 새로 생성)

// user_id를 조회
db.users.find({}, {user_id : 1, _id : 0});

db.users.aggregate(
	{$project : {user_id : 1}}
);

db.users.aggregate(
	{$project : {user_id : 1, _id : 0}}
);

db.users.aggregate([
//	{$project : {_id : 1, user_id : 1}}
	{$project : {"id" : "$_id", "name" : '$user_id', _id : 0}}
]);

// 지역이 부산인 사람의 id, user_id 조회
db.users.aggregate([
	{$match : {addr : 'pusan'}},
	{$project : {id : '$_id', user_id : 1, _id : 0}}
]);

db.users.aggregate([
	{$project : {id : '$_id', user_id : 1, _id : 0}},
	{$match : {addr : 'pusan'}}

]);

/*
	$project에서는 연산자 사용할수 있음
	산술표현식 : $add, $subtract, $multiply, $divide, $mod
*/
db.employees.drop();
db.employees.find();
/*
c:\>mongoimport --db test 
            --collection employees 
            --file d:\employees.json
*/
db.employees.aggregate();

// sal + bonus 값을 total_pay로 조회 
db.employees.aggregate(
	{$project : {sal : 1, bonus : 1,
	            'total_pay' : {$add : ['$sal', '$bonus']}}}
);

db.employees.aggregate(
	{
	  '$project' : {
	    			'total_pay' : {'$add' : ['$sal', '$bonus']}
	  			 }
	}
);

// total_pay에서 300 제한 값을 조회
db.employees.aggregate(
	{$project : {'total_pay : ' : 
	  				{$subtract : [
	  				  				{$add : ['$sal', '$bonus']}
	  				  				, 300
	  				  			 ]}}}
);


// total_pay, tax 조회 (세금 : total_pay * 0.3)
db.employees.aggregate(
	{$project : {'total_pay' : {$add : ['$sal', '$bonus']},
	             tax : {$multiply : [{$add : ['$sal', '$bonus']}, 0.3]}}}
);


db.employees.aggregate(
	{$project : {'total' : {$add : ['$sal', '$bonus']}}},
	{$project : {'total_pay' : '$total',
	             tax : {$multiply : ['$total', 0.3]}}}
);


db.employees.aggregate(
	{$project : {'total_pay' : {$add : ['$sal', '$bonus']}}},
	{$project : {'total_pay' : 1,
	             tax : {$multiply : ['$total_pay', 0.3]}}}
);

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
// deptno 별 sal총액 조회
db.employees.aggregate(
	{$group : {_id : '$deptno'}}
)

db.employees.aggregate(
	{
	  $group : {
	  			_id : '$deptno', 
	  			totalSal : {$sum : '$sal'}
	  		   }
	}
)

// deptno별 salary 평균
db.employees.aggregate([
	{$group : {_id : '$deptno',
	           totalSalary : {$sum : '$sal'},
	           avgSalary : {$avg : '$sal'}
			  }
	}
]);

// 부서별 인원수 포함
db.employees.aggregate([
	{$group : {_id : '$deptno',
	           totalSalary : {$sum : '$sal'},
	           avgSalary : {$avg : '$sal'},
	           count : {$sum : 1}
			  }
	}
]);

/*
	$max : value
	$min : value
	$first : value
	$last : value
*/
// 부서별 최대급여, 최소급여 조회
db.employees.aggregate([
	{$group : {_id : '$deptno', 
	           maxSal : {$max : '$sal'},
	           minSal : {$min : '$sal'}}
]);

// 부서별 오름차순 정렬
db.employees.aggregate([
	{$sort : {deptno : 1}},
	{$group : {_id : '$deptno'}}
]);

db.employees.aggregate([
	{$group : {_id : '$deptno',
			   maxSalary : {$max : '$sal'},
			   minSalary : {$min : '$sal'}}},
	{$sort : {_id : 1}}
]);

db.employees.aggregate([
	{$sort : {sal : 1}},
	{$group : {_id : '$deptno',
			   MaxSalary : {$last : '$sal'},
			   MinSalary : {$first : '$sal'}}}
]);

/*
	$unwind : 배열의 원소들을 별개의 문서로 변환
*/
db.users.aggregate(
	{$project : {hobbys : '$hobby'}},
	{$unwind : '$hobbys'}
);

db.users.aggregate(
	{$project : {hobbys : '$hobby'}},
	{$unwind : '$hobbys'},
	{$match : {hobbys : 'reading'}}
);

db.zipcode.aggregate()

/*
	FISHERS ISLAND 도시의 인구수 조회
*/
db.zipcode.aggregate(
	{$match : {city : 'FISHERS ISLAND'}},
	{$project : {city : 1, pop : 1, _id : 0}}
);

/*
	NEW YORK의 인구수 조회
*/
db.zipcode.aggregate([
	{$match : {city : 'NEW YORK'}},
	{$group : {_id : '$city', 'totalPop' : {$sum : '$pop'}}}
]);

/*
	부서번호가 30이고, 급여가 500이상 3000이하인 사원이면서
	직업이 CLERK이거나 SALESMAN인 사원의 
	empno, ename, job, sal 출력
*/
db.employees.aggregate([
	{$match : {
	  			deptno : 30, 
	  			sal : {$gte : 500}, 
	  			sal : {$lte : 3000}}},
	{$match : {$or : [{job : 'CLERK'}, {job : 'SALESMAN'}]}},
	{$project : {empno : 1, ename : 1, job : 1, 
	             sal : 1, _id : 0}}
]);

/*
	부서번호가 30인 사람의
	empno, ename, sal, comm을 출력하는데,
	comm이 없으면 0으로 표시
	sal + comm의 값을 total_sal 표시하여 출력
*/
db.employees.aggregate([
	{$match : {deptno : 30}},
	{$project : {empno : 1, ename : 1, sal : 1, comm : 1}}
]);

db.employees.aggregate([
	{$match : {deptno : 30}},
	{$project : {empno : 1, 
	             ename : 1, 
	             sal : 1, 
	             comm : {$ifNull : ['$comm', 0]}}}
]);


db.employees.aggregate([
	{$match : {deptno : 30}},
	{$project : {empno : 1, 
	             ename : 1, 
	             sal : 1, 
	             comm : {$ifNull : ['$comm', 0]},
	             total_sal : 
	             	{$add : 
	               		['$sal', {$ifNull : ['$comm', 0]}]}}}
]);

db.employees.aggregate([
	{$match : {deptno : 30}},
	{$project : {empno : 1, ename : 1, sal : 1,
	             comm : {$cond : ['$comm', '$comm', 0]},
	             total_sal : 
	             	{$add : 
	             	  	['$sal', 
	             	  	 {$cond : ['$comm', '$comm', 0]}]}}}
]);
                                                 
/*
	map&reduce : 집계연산을 수행(다수의 분산서버에서 처리)
   	                        분할, 전달, 집계연산 수행
       단계   	                        
    1. map단계 : 콜력션의 모든 문서를 대상으로 연산 매칭을 수행
    2. shuffle단계 : 키별로 연산매칭의 데이터를 목록으로 생성
    3. reduce단계 : shuffle단계에서 모아진 데이터 목록을 하나의 요소로 집계
*/                 

db.words.insert({word : 'I am a boy'});                 
db.words.insert({word : 'You are a girl'});                 
db.words.insert({word : 'I am a girl'});                 

var map = function() {
  var wordArr = this.word.split(' ');
  for(var i = 0; i < wordArr.length; i++) {
    var key = wordArr[i];
    var value = {count : 1};
    emit(key, value);
  }
}

var reduce = function(key, values) {
  var total = 0;
  for(var i in values) {
    total = total + values[i].count;
  }
  return {count : total};
}

db.runCommand({
	"mapreduce" : "words",
	"map" : map,
	"reduce" : reduce,
	"out" : {inline : 1}
});

db.words.mapReduce(map, reduce, {out : {inline : 1}});

// 전체 employees 사원수 조회
var map = function() {
  emit("count", 1);
}

var reduce = function(key, value) {
  	var total = 0;
  	for(var i in value) {
  	  total = total + value[i];
  	}
 	return  total;
}

db.employees.mapReduce(map, reduce, {out : {inline : 1}});

var map = function() {
  for(var key in this) {

    emit(this.empno + this[key], {count : 1});
  }
}

db.employees.mapReduce(map, reduce, {out : {inline : 1}})                 
                 
                 
                 
                 
                 
                 
                 
                                                 
                                                 
                                                 
                                                 