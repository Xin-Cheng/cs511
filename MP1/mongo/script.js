conn = new Mongo();
db = conn.getDB("mydb");
var c = db.br.find({}, {name:1, _id:1}).limit(2); 
while(c.hasNext()) 
{
    printjson(c.next());
}