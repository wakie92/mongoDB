/*
    몽고디비 복제 동작원리
    1. 몽고디비의 마스터는 읽기 쓰기 가능
    2. 마스터 서버에 쓰기 연산이 수행되면 opLog에 저장
    3. 몽고디비의 슬레이브는 읽기만 가능
    4. 슬레이브 서버는 마스터서버의 opLog를 감시하여 정보를 유지
*/

//1단계 : 마스터 서버 실행
mongod --dbpath d:\data\master -port 10000 -master

//2단계 : 슬레이브 서버 실행
mongod --dbpath d:\data\slave01 -port 10001 -slave -source localhost:10000
mongod --dbpath d:\data\slave02 -port 10002 -slave -source localhost:10000

// 3단계 : 마스터 서버 접속
mongo localhost:10000

/*
    리플리카셋(ReplicaSet)
    primary server : 데이터 입출력 담당
    secondary server : 데이터 복제관리
    서버끼리 2초마다 heart beat를 서로 주고받음
    primary server에 문제가 있는경우는 자동으로 
    secondary server에서 데이터 입출력 담당
*/

// 1단계 : primary server 실행
mongod --dbpath d:\data\master --replSet repSet -port 10000

// 2단계 : secondary server 실행
mongod --dbpath d:\data\slave01 --replSet repSet -port 10001
mongod --dbpath d:\data\slave02 --replSet repSet -port 10002

// 3단계 : primary server 접속
mongo localhost:10000

// 4단계 : replicaset 환경설정
use admin
rs.add('아이피:포트');

var config = {
    _id : 'repSet',
    members : [{_id : 0, host : 'localhost:10000'},
               {_id : 1, host : 'localhost:10001'},
               {_id : 2, host : 'localhost:10002'}]
}
rs.initiate(config);







