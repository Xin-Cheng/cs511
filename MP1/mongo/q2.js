conn = new Mongo();
db = conn.getDB("mydb");

var c = db.br.aggregate(
    [
        {
            $match: { city: "Las Vegas" }
        },
        {
            $project : { name : 1 , city:1, user_id: 1, _id: 0, user_id: 1}
        },
        {
            $group : {
                _id : "$user_id",
                count:{$sum:1},
                user_id: {"$first" : "$user_id"},
            }
        },
        {
            $match: { count: { $gt: 2 } }
        },
        {
            $sort:{ "count": 1 }
        },
        {
            $project : { _id: 0, user_id: 1}
        }
    ]
);

while(c.hasNext()) 
{
    printjson(c.next());
}