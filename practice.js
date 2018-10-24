show collections
db.users.stats()

db.users.find()
db.users.insert({
    user_id :'abc1234',
    age : 15,
    status :'A'
})

db.users.aggregate([
    {$match : {age : {$gt : 25}}}
    ])
    
db.users.aggregate ([
    {$match : {age : {$lt : 50}}}
    ])

db.users.aggregate ([
    {$match : {user_id :/^1/}}
    ])

var insertAll = function () {
    
    var start = (new Date()).getTime();
    
    var addrs = ['pusan', 'seoul', 'daejun', 'incheon'];
    for (var i =0 ; i<1000; i++){
        db.users.insert({
            user_id : 'Lee'+i,
            age : Math.floor(Math.random()*80),
            addr : addrs[Math.floor(Math.random()*4)] 
        });
    }
};

db.users.drop()
db.users.find()
insertAll();
    
    
    

































