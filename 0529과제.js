db.zipcode.aggregate([])

/*
     fisher Island ������ �α�����ȸ
 */
db.zipcode.aggregate([
     {$project : {city : '$city'}}     
     ,{$match : {city : 'FISHERS ISLAND'}}
     ])

//2) MA ���� ��� ���ø� ���Ͻÿ�
db.zipcode.aggregate([
    {$match : {state : 'MA'}},
    {$project : {state : 1 , city : 1}}
     ])
 

//�ߺ�����  => groupby demartment_id, department_name;
db.zipcode.aggregate([
    {$match : {state : 'MA'}},
    {$group : {_id : {state : '$state',city :'$city'}}}
     ])
    

//3)�α����� ���� ������ 10���� ���� �� �α����� ���Ͻÿ�
 db.zipcode.aggregate([
    {$group : {_id : '$city', sum_pop :{$sum :'$pop'}}}
    , {$sort : {sum_pop : -1}},{$limit : 10}
    ])
    
//4)MA���� ���� �� �α��� 1000������ ���ø� ���Ͻÿ�

db.zipcode.aggregate([
    {$match : {state : 'MA'}},
    {$group : { _id :'$city', pop :{$sum : '$pop'}}},
    {$match : {pop : {$lte : 1000}}},
    {$project : {city : '$_id' , pop :'$pop', _id :0}}
    ])
    
//5)�ָ��� ��� ���ð� �ִ��� ����Ͻÿ�(hint : {$sum : 1} )
db.zipcode.aggregate([
    {$group : { _id : {state : '$state', city :'$city'}}},
    {$group : {_id : '$_id.state', sum_city : {$sum :1}}}
    //group ���� �ΰ��� �ʵ带 ��Ƴ����� ���ٹ��
    ])    
    
    //6)�α����� 1000���̻��� �ָ� ���Ͻÿ�
db.zipcode.aggregate([
    {$group : {_id : '$state', sum_pop : {$sum : '$pop'}}},
    {$match : {sum_pop :{$gte : 10000000}}},
    {$project : {state : '$_id', sum_pop : '$sum_pop', _id : 0}}
    ])    
    
    
//7)   WA�ִ� ��� ���ø� ���� �ִ��� ���Ͻÿ�
 db.zipcode.aggregate([
    {$match : {state : 'WA'}},
    {$group :  {_id : '$state', sum_city : {$sum : 1}}}
    
    ])
    
//8)�ֺ� �α��� ���� �������� ���� ���� ���Ͻÿ�
 db.zipcode.aggregate([
    {$group : {_id : '$state', max_pop :{$max : '$pop'}, min_pop : {$min : '$pop'}}}
    
    ])
 
    
    //9)�ֺ� �α����� ���� ���� ���� ���� �������� ���� ���Ͻÿ�
    db.zipcode.aggregate([
        {$group :{_id : '$state', sum_pop: {$sum:'$pop'}}},
        {$sort : {sum_pop : 1}},
        {$group : {_id: 0, max_pop : {$last : '$sum_pop'},min_pop :{$first : '$sum_pop'}}},
        {$project : {subtract_pop : {$subtract : ['$max_pop', '$min_pop']}}}
    ])
 
        
  //10)NEW YORK���� �α����� ���� ���� ���� zipcode�� ���Ͻÿ�
  db.zipcode.aggregate([
        {$match : {city : 'NEW YORK'}},
        {$project : {zipcode : '$_id', pop : '$pop', _id : 0}}
  ,      {$sort : {pop : -1}}
  ,     {$limit : 1}      
  ])
  
  //11)�ֺ� �α��� ����� ���Ͻÿ�
  db.zipcode.aggregate([
    {$group : {_id : '$state' , avg_pop : {$avg : '$pop'}}}
  ])
    
    
//WA,DC�ִ� ��� ���ø� ���� �ִ��� ���Ͻÿ�
 db.zipcode.aggregate([
    {$match : {$or : [{state : 'WA'}, {state : 'DC'}]}},
    {$group :  {_id : {state : '$state', city :'$city'}}},
    {$group : {_id : '$_id.state' , sum_city : {$sum :1}}}
    ])
        
    
    
    
    
    
    
   