conn = new Mongo();
db = conn.getDB("mydb");

var c = db.br.aggregate(
    [
        {
            $group : {
                _id : "$state",
                state: {"$first" : "$state"},
                avg_rating: { $avg: "$stars_y" }
            }
        },
        {
            $sort:{ state: 1 }
        },
        {
            $project : { _id: 0}
        }
    ]
);

while(c.hasNext()) 
{
    printjson(c.next());
}