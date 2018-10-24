
db.employees.aggregate([
    {$group  : {_id : '$deptno', sum_salary : {$sum : '$sal'}}}
])

/*      �μ��� ���� ����       */
    /*map+shuffle�� ��Ŀ�� ȭ�� ¦���� ������ ���°��̶�� �����Ұ�
        key ���� �������� value [......]�� �ٸ� �͵��� ������*/
var map = function() {
  var key = this.deptno;
  var value = this.sal;
  emit(key, value);
}

// key : 20
// values : [2975, 800, 3000, 1100, 3000]
var reduce = function(key, values) {
  var total = 0;
  for(var data of values) {
    total += data;
  }
  
  return total;
}

db.employees.mapReduce(map, reduce, {out : {inline : 1}});


var map = function(){
  //this ==> {_id : ObjectId(...),empno:2566, job:manager, hiredate : '1981-04-01' ,sal 2975, deptno 20}
    /*emit(this.deptno{
      name :[this.ename],
      sal : this.sal
      })*/
    var key = this.deptno;
    var value = {
            name : [this.ename],
            sal : this.sal
        }
    emit(key,value);
}

var reduce = function(key,values){//values is only array
    var total = 0;
    var names = [];
    for (var user of values){
       names = names.concat(user.name);
        total += user.sal;
        }
        
    return {name : names, sal : total};

}

db.sites.insert(
        {
            url : 'http:www.kyobobook.co.kr',
            keywords : ['��������','����,' , 'å�ֹ�']
            });



db.sites.insert(
        {
            url : 'http:www.bitacademy.com',
            keywords : ['IT','�������']
            });


db.sites.insert(
        {
            url : 'http:www.hanbit.co.kr',
            keywords : ['IT','�Ѻ�', 'å']
            });


db.sites.insert(
        {
            url : 'http:www.kangcom.co.kr',
            keywords : ['IT','å', '�ι���','����']
            });

var map = function (){
    var value = {urls : this.url};
    for(var k of this.keywords){
        var key = {keyword : k}
        emit(key : value}
        }
    var keyword = {
}

var reduce = function(key,values){
    var urls = [];
    for(var i in values){
        values[i].urls.forEach(function(data, index){
            urls.push(data);
        });
        return {'urls' : urls}
}
















































