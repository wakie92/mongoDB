show collections

db.users.stats()

db.users.find()

db.users.insert({
    user_id : 'abc123',
    age : 55,
    status : 'A'
})

db.users.insert({
    _id : ObjectId(),
    user_id : 'ccc',
    name : 'ddd',
    status : 'A'
})

db.users.find()

db.test.insert({
    _id : 1
})

db.test.insert( [
    {
        _id : 2
    },
    {
        _id : 3
    },
    {
        _id : 4
    }
]);
  
var inputData = {
    _id : 5
};

db.test.insert(inputData)

db.test.find()

// select * from users
db.users.find()
db.users.find({})
//db.users.find({expr}, ¤©eld});

/*
 select user_id, status
      from users
*/
db.users.find(
    {},
    { user_id : 1, status : 1 }
)

db.users.find(
    {},
    { user_id : 1, status : 1, _id : 0 }
)

db.users.find(
    {},
    { user_id : 1, name : 1, _id : 0 }
)

db.users.find()
db.users.findOne()
    
/*
   select * 
     from users
    where status = 'A'
*/    
db.users.find(
    { status : 'A' }
);

/*
    select user_id, age
      from users
     where status = 'A'
*/
db.users.find(
    { status : 'A'},
    { user_id : 1, age : 1, _id : 0}
);
    
/*
   select *
      from users
    where status != 'A'
*/
db.users.find(
   { status : {$ne : 'A'}}
);
   
db.users.insert( {
    user_id : 'bcd123',
    age : 35,
    status : 'B'
});

/*
    select *
      from users
     where status = 'A'
       and age = 55
*/
db.users.find(
    { status : 'A', age : 55 }
);
    
db.users.find(
    {$and : [{ status : 'A'}, {age : 55}] }
);    

/*
    select *
      from users
     where status = 'A'
        or age = 55
*/
db.users.find(
    {$or : [{status : 'A'}, {age : 55}]}
);
    
/*
    select *
      from users
     where age > 25
*/    
db.users.find(
    { age : { $gt : 25 }}
);

/*
    select *
      from users
     where age < 50
*/    
db.users.find(
    { age : { $lt: 50 }}
);

/*
    select *
      from users
     where age > 25
       and age <= 50
*/
db.users.find(
    { age : {$gt : 25, $lte : 50} }
);

/*
    select *
      from users
     where user_id like '%bc%'
*/
db.users.find(
    { user_id : /bc/ }
);

/*
    select *
      from users
     where user_id like 'bc%'
*/
db.users.find(
    {user_id : /^bc/ }
);    

// dummy document
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

db.users.find();

insertAll();

db.users.count();

/*
    select *
      from users
     where user_id = 'hong1'
        or user_id = 'hong2'
        or user_id = 'hong6'
        or user_id = 'hong8'
*/
// user_id : hong1, hong2, hong6, hong8
db.users.find(
    {$or : [
                {user_id : 'hong1'}, 
                {user_id : 'hong2'}, 
                {user_id : 'hong6'},
                {user_id : 'hong8'}
           ]
     }
   
);
     
/*
     select *
       from users
      where user_id in ('hong1', 'hong2', 'hong6', 'hong8')
*/
db.users.find(
    {user_id : {$in : ['hong1', 'hong2', 'hong6', 'hong8']}}
);  
 
/*
     select *
       from users
      where user_id not in ('hong1', 'hong2', 'hong6', 'hong8')
*/    
var result = db.users.find(
    {user_id : {$nin : ['hong1', 'hong2', 'hong6', 'hong8']}}
);
    
result.count()    
    
// age => 0, 10, 20, 30, 40, 50, 60, 70, 80    
db.users.find(
    {age : {$in : [0, 10, 20, 30, 40, 50, 60, 70, 80] } }
);

db.users.find(
    {age : {$mod : [10, 0]}}
);

db.users.insert({
    user_id : 'user',
    age : 15
});


db.users.insert({
    user_id : 'user01',
    age : 15,
    addr : null
});

db.users.find(
    {addr : null}
);

db.users.find(
    {addr : {$in : [null]}}
);
   
db.users.find(
    {addr : {$in : [null], $exists : true }}
);    

db.users.find(
    {addr : {$exists : false}}
);
    
db.food.insert({
    fruit : ['apple', 'banana', 'orange']
});

db.food.insert({fruit : ['apple', 'grape', 'kiwi']});
db.food.insert({fruit : ['cherry', 'banana', 'apple']});
db.food.insert({fruit : ['orange', 'peach']});

db.food.find();

db.food.find(
    {fruit : ['cherry', 'banana', 'apple']}
);

db.food.find(
    {fruit : 'banana'}
);

db.food.find(
    {fruit : {$all : ['banana', 'apple']}}
);

// key.index
db.food.find(
    {'fruit.2' : 'apple'}
);

db.food.find(
    {fruit : {$size : 2} }
);
    
db.food.find(
    {},
    {fruit : { $slice : -2}}
);    

db.food.find(
    {},
    {fruit : { $slice : 2}}
);     
    
/*
    select *
      from users
    order by user_id asc
*/
// asc : 1, desc : -1
db.users.find().sort({user_id : 1});

/*
    select user_id, addr
      from users
     where addr = 'seoul'
     order by user_id desc
*/
db.users.find(
    {addr : 'seoul'},
    {user_id : 1, addr : 1, _id : 0}
).sort({user_id : -1});

/*
    select count(addr)
      from users
*/
db.users.find(
    {addr : {$exists : true}}
).count();
db.users.count({addr : {$exists : true}});

/*
    select count(*)
      from users
     where age >= 50
*/
db.users.find({age: {$gte : 50}}).count();
db.users.count({age : {$gte : 50}});

/*
    select distinct(addr)
      from users
*/
db.users.distinct('addr');

/*
    select *
      from users
     where rownum = 1
*/
db.users.findOne();
db.users.find().limit(1);

/*
    select *
      from users
     where rownum <= 5
*/
db.users.find().limit(5);

db.users.find().skip(5).limit(5);

db.users.find(
    {age : 70}
).count();      // 131
    
/*
    update users
       set addr = 'jeju'
     where age = 70
*/    
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
    {age : 70},
    {$unset : {hobby : 'mountain'}},
    {multi : true}
);
    
/*
    select empno, ename
      from employees
     where sal <= 1000
*/    
db.employees.find();
db.employees.find(
    {sal : {$lte : 1000}},
    {empno : 1, ename : 1, _id : 0}
);

db.employees.find(
    {sal : {$gte : 1500, $lte : 3000}},
    {empno : 1, ename : 1, sal : 1, _id : 0}
);    

    
db.employees.find(
    {$and : [
                {sal : {$gte : 1500} }, 
                {sal : {$lte : 3000}}
            ]
    },
    {empno : 1, ename : 1, sal : 1, _id : 0}
);    
    
/*
    select *
      from employees
     where deptno = 10 or deptno = 20
*/    
db.employees.find(
    {$or : [{deptno : 10}, {deptno : 20}]}
);    

/*
    select empno, deptno
      from employees
     where deptno in (10, 30)
*/        
db.employees.find(
    {deptno : {$in : [10, 30]}},
    {empno : 1, deptno : 1, _id : 0}
);    

/*
   select *
     from employees
    where deptno = 10 and sal >= 1000
*/    
db.employees.find(
   {deptno : 10, sal : {$gte : 1000}}
);
   
   
    
    
    
    
    
    
    
    
    
