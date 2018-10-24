var insertAll = function() {
    
    var start = (new Date()).getTime();
    
    var addrs = ['pusan', 'seoul', 'daejun', 'incheon'];
    for(var i = 0; i < 10000; i++) {
        db.users.insert({
            user_id : 'hong' + i,
            age : Math.floor(Math.random() * 80),
            addr : addrs[Math.floor(Math.random() * 4)]
        });
    }
    
    var end = (new Date()).getTime();
    print("time : " + (end - start) + "ms");
};

show collections();
db.users.find();

insertAll();

db.users.count();

db.users.update(
    {age : 70},
    {$set : {addr : 'jeju'}},
    {multi : true}
);
    
db.users.find({addr : 'jeju'});
db.users.find({addr : 'jeju'}).count();

db.users.update(
    {age : 70},
    {$set : {hobby : 'mountain'}},
    {multi : true}
);
    
db.users.find({age : 70}).limit(5);

db.users.update(
    {age : 70}   {$unset : {hobby : 'mountain'}},
    {multi : true}
);
db.users.count()
    
    
    
db.test.insert({
    name : 'aaa',
    age : 10,
    addr : 'seoul'})
    
db.test.insert ({
      name : 'bbb',
    age : 30,
    addr : 'seoul'})
    
db.test.find();
    
var user = db.test.findOne({name : 'aaa'})
print(user.age)

user.age = user.age + 1;
db.test.update(
    { name : 'aaa'},
    user);

db.test.update (
    {name : 'bbb'},
    {$inc : {age : 1}}
    )


/*
    update users
    set age = age -5
    where age = 70 and addr = 'pusan'
    */
db.users.drop()
db.users.find(
    {$and : [{age :70}, {addr : 'pusan'}]}    
    )
    
    
db.users.update(
    {age : 65, addr : 'pusan'},
    {$inc : {age : +5}},
    {multi : true}
    )

db.users.find ({user_id : 'hong1'})

db.users.update({
    user_id : 'hong1'},
    {$set :  {hobby: 'reading'}})

db.users.update (
    {user_id : 'hong1'},
    {$set : {hobby : ['reading', 'movie']}}
    )


db.users.update (
    {user_id : 'hong1'},
    {$unset : {hobby : 1}}
    )

db.users.update(
    {user_id  : 'hong3'},
    {$push : {hobby : 'reading'}}
)


db.users.update(
    {user_id  : 'hong1'},
    {$push : {hobby : 'reading'}}
)

db.users.update(
    {user_id : 'hong4'},
    {$push : {hobby :{$each : ['pingpong','moviv']}}}
    )


db.users.update(
    {user_id : 'hong1'},
    {$push : {hobby :{$each : ['pingpong','movie','game'],$slice : -4}}}
)


db.users.find({user_id : 'hong2'})

db.users.update(
    {user_id : 'hong1'},
    {$push :{hobby : {$each :[{name : 'music' ,cnt : 7 }, 
                              {name : 'reading', cnt : 3}, 
                              {name :'movie', cnt : 4}],
                      $sort : {cnt : -1}
                     }
            }
    }
  )      
//Study what is the different 'hong1' and 'hong2' 
db.users.find({user_id : 'hong1'})

db.users.update({user_id :'hong2'}, 
               {$unset :{hobby :1}})

db.users.update(
    {user_id : 'hong2',hobby : {$ne : 'reading'}},
    {$push : {hobby : 'higing'}}
    )
    
db.users.update(
    {user_id : 'hong2'},
    {$addToSet : {hobby : 'tennis'}})//only array  and no overlap
    
db.users.update(
    {user_id  : 'hong2'},
    {$pop : {hobby :-1}}) //deletet array[0]
    
db.users.update({user_id : 'hong2'},
                 {$pull : {hobby :'game'}})
                 
db.users.update(
    { user_id : 'hong2'},
    { $set : {'hobby.0' : 'ten'}})

db.users.find({user_id: 'hong1'})

db.users.update (
    {user_id : 'hong1'},
    {$set : {'hobby.1.cnt' : 4}})


db.users.update (
    {user_id : 'hong1', 'hobby.cnt' : 4},
    {$set : {'hobby.$.cnt' : 1}}//only the first search
    )

db.users.update (
    {user_id : 'hong1', hobby : {$elemMatch :{cnt : 4, name :'reading'}}},
    {$set : {'hobby.$.cnt' : 1}}
    )

db.users.find({user_id : 'hong1'})

db.test.insert({ name :'ddd', age : 27});

db.test.find();

db.test.update(
    {name :'ddd'},
    {$inc :{cnt : 1}}
    );

db.test.findAndModify({
    query :{name :'ccc'},
    update : {$inc :{cnt :1}}}
    upsert : true //if there is not 'ccc', upsert can make new thing name is 'ccc'
    );
    
    
    /*
    delete from test
    */
db.test.remove();


/*
    delete from test
    where name  = 'ccc'
    */
db.test.remove(
    {name : 'ccc'}
    )
//paging
var page1 = db.users.find().limit(20);
var page2 = db.users.find().skip(20).limit(20);
var page3 = db.users.find().skip(40).limit(20);

while(page1.hasNext()){
    var data = page1.next();
    print(data.user_id + ' : ' + data.age + ' : ' + data.addr);
    }

db.users.count();

db.users.find(
    {user_id : 'hong9992'}      
    
    ).explain(true);
    

db.users.find({
    _id :   ObjectId("5b0b690f6b1670a418e61b7f")
}).explain(true); // more faster  because of using B-tree like binary tree

db.users.createIndex({user_id : 1});

db.users.getIndexes();

db.users.dropIndex({user_id : 1});

/*
    집계 프레임워크 : {여과where 선출select}find , 묶음group by, 정렬order by, 제한, 건너뛰기 등을 통해 
    원하는 데이터를 추출하는 방식  (파이프방식)
        
    잡지기사에서 가장많은 기사를 작성한 저자를 검색
    1. $project : {writer :1}
    2. $group : {writer : writer, articlesum : {$sum :1 }} 
    3. $sort : {articlesum : -1}
    4. $limit : 1
    $match
    $project
    $group
    $sort
    $limit
    
*/


//지역이 부산인 회원 조회
db.users.find({ addr : 'pusan' });

db.users.aggregate([
    {$match : {addr : 'pusan'}}
    ]);
    
db.users.aggregate(
    {$match : {addr : 'pusan'}},
    {$match : {age : {$gte : 40}}}
    );
    
    
//$project :  하위문서의 필드를 추출하여 새로운 문서를 생성(필드명을 새로 생성)
db.users.drop()
db.getCollection('users').find({})
db.users.find()
db.users.find(
    {},{user_id : 1, _id :0});

db.users.aggregate(
    {$project : { user_id:1 , _id : 0}}
    );

db.users.aggregate([
    //{$project : { user_id:1 , _id : 1}}
    {$project : {'id' : '$_id' , 'name' : '$user_id', _id : 0}}
    
    ]);

//지역이 부산인 사람의 id, user_id 조회

db.users.aggregate([
    {$match : {addr : 'pusan'}}
    , {$project :{id : '$_id', user_id :1, _id :0}}
    ]);
//순서가중요
db.users.aggregate([
    {$project :{id : '$_id', user_id :1,addr : 1 , _id :0}}
      , {$match : {addr : 'pusan'}}
    ]);

db.employees.drop()
db.employees.find()
 
      
 ////////////////////////////     
 db.employees.aggregate([
    {$project : {sal :1, bonus : 1,
        'total_pay' : {$add : ['$sal',  '$bonus']}}}//use array when I need add, subtract 
    ])     
   
     
        
db.employees.aggregate([
   {$project : {'total_pay' : {$add : ['$sal' , '$bonus']}}}      
      ])
      
 
        
db.employees.aggregate([
   {$project : {'total_pay' :
               {$subtract : [{$add : ['$sal' , '$bonus']},300] }}}      
      ])      
      
     
db.employees.aggregate([
   {$project : {'total' : {$add : ['$sal' , '$bonus']}}},
   {$project : {'total' : 1 
                , 'tax' : {$multiply : ['$total' ,0.3]}}}     
      ])     
      
/*
   expression of Date
                */
 //the yeare of hire_date      
 db.employees.aggregate([
                {$project : { hireInYear : { $year : '$hiredate'}}}
                ]);
      
      
 // the month of hire_date
 db.employees.aggregate([
           {$project :{hireInMonth : { $month : '$hiredate'}}}
      ]);     
  //working year
  db.employees.aggregate([
           {$project : 
               {duringYear : 
                    {$subtract : [{$year : new Date()} ,
                        {$year : '$hiredate'}]}}}
     ]) 
      

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      




