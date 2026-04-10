# DB 실습

### 문제 1
1. attendance 테이블은 중복된 데이터가 쌓이는 구조이다. 중복된 데이터는 어떤 컬럼인가?
</br>
crew_id, nickname 
2. attendance 테이블에서 중복을 제거하기 위해 crew 테이블을 만들려고 한다. 어떻게 구성해 볼 수 있을까?
 ```
CREATE TABLE crew (
    crew_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    PRIMARY KEY (crew_id)
);
```
3. crew 테이블에 들어갈 크루 정보는 어떻게 추출할까?
```
SELECT DISTINCT
    crew_id,
    nickname
    FROM attendance;
```
   
4. 최종적으로 crew 테이블 생성
```
CREATE TABLE crew (
   crew_id INT NOT NULL,
   nickname VARCHAR(50) NOT NULL,
   PRIMARY KEY (crew_id)
);
```
5. attendance 테이블에서 크루 정보를 추출해서 crew 테이블에 삽입하기:
```aiexclude
INSERT INTO crew (crew_id, nickname)
SELECT DISTINCT
    crew_id,
    nickname
FROM attendance;
```

### 문제 2: 테이블 컬럼 삭제하기 (ALTER TABLE)
1. crew 테이블을 만들고 중복을 제거했다. attendance에서 불필요해지는 컬럼은?
nickname
2. 컬럼을 삭제하려면 어떻게 해야 하는가?
ALTER TABLE attendance
DROP COLUMN nickname;

### 문제 3: 외래키 설정하기
```
ALTER TABLE attendance
ADD CONSTRAINT fk_attendance_crew
FOREIGN KEY (crew_id)
REFERENCES crew(crew_id);
```

### 문제 4: 유니크 키 설정
```aiexclude
ALTER TABLE crew
ADD CONSTRAINT uq_crew_nickname
UNIQUE (nickname);
```

### 문제 5: 크루 닉네임 검색하기 (LIKE)
```aiexclude
SELECT c.nickname
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id
WHERE a.attendance_date = '2026-03-04'
AND c.nickname LIKE '디%';
```

### 문제 6: 출석 기록 확인하기 (SELECT + WHERE)
```aiexclude
SELECT *
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id
WHERE c.nickname = '어셔'
AND a.attendance_date = '2026-03-06';
```

### 문제 7: 누락된 출석 기록 추가 (INSERT)
```aiexclude
INSERT INTO attendance (crew_id, attendance_date, start_time, end_time)
VALUES (
  (SELECT crew_id FROM crew WHERE nickname = '어셔'),
  '2026-03-06',
  '09:31:00',
  '18:01:00'
);
```

### 문제 8: 잘못된 출석 기록 수정 (UPDATE)
```aiexclude
UPDATE attendance a
JOIN crew c ON a.crew_id = c.crew_id
SET a.start_time = '10:00:00'
WHERE c.nickname = '주니'
AND a.attendance_date = '2026-03-12';
```

### 문제 9: 허위 출석 기록 삭제 (DELETE)
```aiexclude
DELETE a
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id
WHERE c.nickname = '아론'
AND a.attendance_date = '2026-03-12';
```

### 문제 10: 출석 정보 조회하기 (JOIN)
```aiexclude
SELECT
  a.attendance_id,
  c.nickname,
  a.attendance_date,
  a.start_time,
  a.end_time
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id;
```

### 문제 11: nickname으로 쿼리 처리하기 (서브 쿼리)
```aiexclude
SELECT *
FROM attendance
WHERE crew_id = (
  SELECT crew_id
  FROM crew
  WHERE nickname = '어셔'
);
```

### 문제 12: 가장 늦게 하교한 크루 찾기
```aiexclude
SELECT
  c.nickname,
  a.end_time
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id
WHERE a.attendance_date = '2026-03-05'
AND a.end_time = (
  SELECT MAX(end_time)
  FROM attendance
  WHERE attendance_date = '2026-03-05'
);
```

### 문제 13: 크루별로 '기록된' 날짜 수 조회
```
SELECT
c.nickname,
COUNT(*) AS recorded_date_count
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id
GROUP BY c.nickname;
```

### 문제 14: 크루별로 등교 기록이 있는(start_time IS NOT NULL) 날짜 수 조회
```
SELECT
c.nickname,
COUNT(*) AS attendance_count
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id
WHERE a.start_time IS NOT NULL
GROUP BY c.nickname;
```

### 문제 15: 날짜별로 등교한 크루 수 조회
```
SELECT
attendance_date,
COUNT(*) AS crew_count
FROM attendance
WHERE start_time IS NOT NULL
GROUP BY attendance_date;
```

### 문제 16: 크루별 가장 빠른 등교 시각(MIN)과 가장 늦은 등교 시각(MAX)
```
SELECT
c.nickname,
MIN(a.start_time) AS earliest_start_time,
MAX(a.start_time) AS latest_start_time
FROM attendance a
JOIN crew c ON a.crew_id = c.crew_id
WHERE a.start_time IS NOT NULL
GROUP BY c.nickname;
```