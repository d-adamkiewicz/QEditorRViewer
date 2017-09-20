### Requirements:

* Nodejs, yarn or npm

* Runing postgresql server

### Steps:

* Create necessary db structures and records 
	
```sql
-- create table "categories" 
CREATE TABLE categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR(64) NOT NULL
);
```
```sql
-- insert some categories, at least one is required
INSERT INTO categories (name) VALUES ('category example1'),('category example2');
```
```sql
-- create one-row table "active_category"
CREATE TABLE active_category (
    id BOOLEAN DEFAULT TRUE NOT NULL,
    cat_id INTEGER,
    CONSTRAINT id_uniq CHECK (id)
);
```
```sql
-- set default active category, it must be value of "id" column of "categories" table
INSERT INTO active_category (cat_id) VALUES (1); 
```
```sql
-- create table "sqls" where column "text" will contain saved sql queries
CREATE TABLE sqls (
    id SERIAL PRIMARY KEY,
    text TEXT,
    cat_id INTEGER
);
```
```sql
-- create one-row table "active" where "sql_id" column store id of lately added or changed row of "sqls" table 
CREATE TABLE active (
    id BOOLEAN DEFAULT TRUE NOT NULL,
    sqls_id INTEGER,
    CONSTRAINT id_uniq CHECK (id)
);
```
* Install packages, when in app directory:

<code>/>yarn install</code>

* Run app

<code>/>npm start</code> 

### Example usage 

* place each of following queries in textarea and then push "Run" button each time

```sql
-- create some table
CREATE TABLE my_table(id SERIAL PRIMARY KEY, name TEXT);
```
```sql
-- insert some rows into table
INSERT INTO my_table (name) VALUES ('Ala ma kota'), ('Ola ma psa'), ('Pies Ali wabi się As');
```
```sql
-- display "name" values 
SELECT name FROM my_table;
```
```sql
-- insert some long text
INSERT INTO my_table (name) VALUES ('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
```
```sql
-- 3 forms of displaying "name" column value
SELECT name AS name1_25, name AS name2_15, name AS name3_60 FROM my_table;
```
