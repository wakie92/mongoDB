db.zipcode.aggregate([])

/*
     fisher Island 도시의 인구수조회
 */
db.zipcode.aggregate([
     {$project : {city : '$city'}}     
     ,{$match : {city : 'FISHERS ISLAND'}}
     ])

//2) MA 주의 모든 도시를 구하시오
db.zipcode.aggregate([
    {$match : {state : 'MA'}},
    {$project : {state : 1 , city : 1}}
     ])
 

//중복없이  => groupby demartment_id, department_name;
db.zipcode.aggregate([
    {$match : {state : 'MA'}},
    {$group : {_id : {state : '$state',city :'$city'}}}
     ])
    

//3)인구수가 많은 순으로 10개의 도시 및 인구수를 구하시오
 db.zipcode.aggregate([
    {$group : {_id : '$city', sum_pop :{$sum :'$pop'}}}
    , {$sort : {sum_pop : -1}},{$limit : 10}
    ])
    
//4)MA주의 도시 중 인구가 1000이하인 도시를 구하시오

db.zipcode.aggregate([
    {$match : {state : 'MA'}},
    {$group : { _id :'$city', pop :{$sum : '$pop'}}},
    {$match : {pop : {$lte : 1000}}},
    {$project : {city : '$_id' , pop :'$pop', _id :0}}
    ])
    
//5)주마다 몇개의 도시가 있는지 출력하시오(hint : {$sum : 1} )
db.zipcode.aggregate([
    {$group : { _id : {state : '$state', city :'$city'}}},
    {$group : {_id : '$_id.state', sum_city : {$sum :1}}}
    //group 으로 두개의 필드를 잡아놨을때 접근방법
    ])    
    
    //6)인구수가 1000만이상인 주를 구하시오
db.zipcode.aggregate([
    {$group : {_id : '$state', sum_pop : {$sum : '$pop'}}},
    {$match : {sum_pop :{$gte : 10000000}}},
    {$project : {state : '$_id', sum_pop : '$sum_pop', _id : 0}}
    ])    
    
    
//7)   WA주는 몇개의 도시를 갖고 있는지 구하시오
 db.zipcode.aggregate([
    {$match : {state : 'WA'}},
    {$group :  {_id : '$state', sum_city : {$sum : 1}}}
    
    ])
    
//8)주별 인구가 제일 많은곳과 작은 곳을 구하시오
 db.zipcode.aggregate([
    {$group : {_id : '$state', max_pop :{$max : '$pop'}, min_pop : {$min : '$pop'}}}
    
    ])
 
    
    //9)주별 인구수의 합이 제일 많은 곳과 작은곳의 차를 구하시오
    db.zipcode.aggregate([
        {$group :{_id : '$state', sum_pop: {$sum:'$pop'}}},
        {$sort : {sum_pop : 1}},
        {$group : {_id: 0, max_pop : {$last : '$sum_pop'},min_pop :{$first : '$sum_pop'}}},
        {$project : {subtract_pop : {$subtract : ['$max_pop', '$min_pop']}}}
    ])
 
        
  //10)NEW YORK에서 인구수가 제일 많은 곳의 zipcode를 구하시오
  db.zipcode.aggregate([
        {$match : {city : 'NEW YORK'}},
        {$project : {zipcode : '$_id', pop : '$pop', _id : 0}}
  ,      {$sort : {pop : -1}}
  ,     {$limit : 1}      
  ])
  
  //11)주별 인구수 평균을 구하시오
  db.zipcode.aggregate([
    {$group : {_id : '$state' , avg_pop : {$avg : '$pop'}}}
  ])
    
    
//WA,DC주는 몇개의 도시를 갖고 있는지 구하시오
 db.zipcode.aggregate([
    {$match : {$or : [{state : 'WA'}, {state : 'DC'}]}},
    {$group :  {_id : {state : '$state', city :'$city'}}},
    {$group : {_id : '$_id.state' , sum_city : {$sum :1}}}
    ])
        
    
    
    
    
    
    
   