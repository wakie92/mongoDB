/*
	��¥ǥ���� : $year, $month, $dayOfMonth, $dayOfwWeek,
	          $dayOfYear, $hour, $minute, $second
*/
db.employees.aggregate();

// �Ի�⵵ ��ȸ
db.employees.aggregate(
	{$project : {hireInYear : {$year : '$hiredate'}}}
);

// ä��� �� ��ȸ
db.employees.aggregate(
	{$project : {hireInMonth : {$month : '$hiredate'}}}
);

// �� ����� �ٹ���� ��ȸ
db.employees.aggregate(
	{$project : 
	  {duringYear : 
	    {$subtract : [{$year : new Date()}, 
	      			  {$year : '$hiredate'}]}}}
);

// �޺� �Ի��ο��� ��ȸ
db.employees.aggregate(
	{$project : {hireInMonth : {$month : '$hiredate'}}},
	{$group : {_id : '$hireInMonth', count : {$sum : 1}}},
	{$sort : {_id : -1}}
);

// �Ի�⵵ ���� �ο��� ��ȸ
db.employees.aggregate(
	{$group : {_id : {hireInMonth : {$month : '$hiredate'},
	                   hireInYear : {$year : '$hiredate'} },
	           count : {$sum : 1}}}
);

/*
	���ڿ� ǥ����
	$substr : [value, �����ε���, ����]
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
	��ǥ����
	$cmp : [value, value]
	$strcasecmp
	$eq, $ne, $gte, $lte, $gt, $lt
	$and, $or, $not
	$cond : [booleanǥ����, ��, ����]
	$ifNull : [value, ��üvalue]
	
	���������� 
	$sum, $avg
*/
//deptno �� sal �Ѿ� ��ȸ

db.employees.aggregate([
        
        {$group : {_id : '$deptno'}}
])


db.employees.aggregate([
        {$group : {_id : '$deptno' ,totalSal : {$sum :'$sal'}}}
])

//deptno �� sal ���
        
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
//�Τ��� �ִ�޿�, �ּұ޿�
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
   $unwind : �迭�� ���ҵ��� ������ ������ ��ȯ
   ���� : ��� => board 
   
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
     fisher Island ������ �α�����ȸ
 */
db.zipcode.aggregate([
     {$project : {city : '$city'}}     
     ,{$match : {city : 'FISHERS ISLAND'}}
     ])
     
db.zipcode.aggregate([
     {$match : {city : 'NEW YORK'}}
     ])
/*
     �μ���ȣ�� 30 �̰� �޿��� 500�̻� 3000������ ����̸鼭 
     ������ cleark �̰ų� salesman �� ����� empno, enmae, jobm, sal
     */

db.employees.aggregate([
    
     {$match : {deptno : 30, sal : {$gte : 500 , $lte : 3000}
                , job : {$in : ['CLERK','SALESMAN']}}},
      {$project : {emp :1, ename:1, job:1, sal :1, _id :0}}
                
     ])  
     
     
 /*
   �μ���ȣ�� 30 �̰�
    empno, ename, sal, comm�� ����ϴµ�
    comm�� ������ 0���� ǥ��
      sal + comm�� ���� total_sal ǥ���Ͽ� ���
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
   map&reduce : ���迬���� ���� (�ټ��� �л꼭������ ó��)
                ����, ����, ���迬�� ���� 
    �ܰ�
    1.map�ܰ� : collection�� ��� ������ ������� ���� ��Ī�� ����
    2.shuffle �ܰ� : Ű���� ���� ��Ī�� �����͸� ������� ���� 
    3, reduce �ܰ� : shuffle�ܰ迡�� ����� ������ ����� �ϳ��� ��ҷ� ���� 
 */
  //employees�� �ִ� ������� ��ȸ                     
  
  
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
 
 
 
 //��ü employees ����� ��ȸ
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
 
 
 
 
 
 
 
 
 
 
 
  
  