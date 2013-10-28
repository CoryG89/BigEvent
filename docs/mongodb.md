Getting Started With MongoDB
============================

We are using [MongoDB][mongodb] for our backend database. MongoDB is an open
source project written in C++ and is the leading NoSQL document database
management system. There is great [documentation][mongodb-docs] available for
MongoDB in general as well as good docs for the 
[native driver][mongodb-native-driver] which is written in as a Node.JS module. 
There are a number of [other drivers][mongodb-drivers] available as well. and 
there are lots of examples of it being used in other Node projects so it's a
good fit for our project.

MongoDB is different from more common relation database systems such as MySQL as
it does not store data in the form of tables (relations) with rows and columns.
Instead, MongoDB stores data in JSON-style *documents* in groups of
*collections*. Documents in MongoDB collections have what is called dynamic
schema, which means that documents of the same collection can differ in what 
fields they contain. Similarly, two documents with the same field can be of
different type. Some libraries such as Mongoose add a strict schema which is 
associated with a collection, guaranteeing that any documents within said
collection have the fields and field types declared by the schema. There are 
advantages and disadvantages to both approaches. I prefer to use dynamic schema 
for more rapid prototyping and iteration.

Recommended Reading
-------------------------
 - [A Basic Introduction to MongoDB][mongodb-node-basic-intro]
 - [And Then There Was CRUD][mongodb-node-crud-intro]
 - [Time to Query][mongodb-node-querying]

[mongodb]: mongodb.org
[mongodb-docs]: http://docs.mongodb.org/manual/
[mongodb-native-driver]: http://mongodb.github.io/node-mongodb-native/
[mongodb-drivers]: http://docs.mongodb.org/ecosystem/drivers/downloads/
[mongodb-downloads]: http://www.mongodb.org/downloads
[mongodb-crud-intro]: http://docs.mongodb.org/manual/core/crud-introduction/
[mongodb-read-ops]: http://docs.mongodb.org/manual/core/read-operations/
[mongodb-write-ops]: http://docs.mongodb.org/manual/core/write-operation
[mongodb-insert-documents]: http://docs.mongodb.org/manual/tutorial/insert-documents/
[mongodb-query-documents]: http://docs.mongodb.org/manual/tutorial/query-documents/
[mongodb-modify-documents]: http://docs.mongodb.org/manual/tutorial/modify-documents/
[mongodb-remove-documents]: http://docs.mongodb.org/manual/tutorial/remove-documents/
[mongodb-cursors]: http://docs.mongodb.org/manual/core/cursors/
[mongodb-query-optimization]: http://docs.mongodb.org/manual/core/query-optimization/
[mongodb-write-concern]: http://docs.mongodb.org/manual/core/write-concern/
[mongodb-data-modeling]: http://docs.mongodb.org/manual/data-modeling/
[mongodb-install-windows]: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/
[mongodb-install-osx]: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
[mongodb-install-linux]http://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/

[mongodb-operators]: http://docs.mongodb.org/manual/reference/operator/
[mongodb-query-operators]: http://docs.mongodb.org/manual/reference/operator/nav-query/
[mongodb-update-operators]: http://docs.mongodb.org/manual/reference/operator/nav-update/
[mongodb-aggregation-operators]: http://docs.mongodb.org/manual/reference/aggregation/operators/
[mongodb-meta-query-operators]: http://docs.mongodb.org/manual/reference/operator/nav-meta-query/
[mongodb-two-phase-commits]: http://docs.mongodb.org/manual/tutorial/perform-two-phase-commits/

[mongodb-node-basic-intro]: http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
[mongodb-node-crud-intro]: http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html#and-then-there-was-crud
[mongodb-node-querying]: http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html#time-to-query
