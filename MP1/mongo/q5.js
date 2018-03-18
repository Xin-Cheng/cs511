conn = new Mongo();
db = conn.getDB("mydb");

var c = db.br.aggregate(
    [
        {
            $group : {
                _id : {
                    "user_id": "$user_id",
                    "city" : "$city"
                },
                user_id: {"$first" : "$user_id"},
                city: {"$first" : "$city"},
            }
        },
        {
            $group : {
                _id : {
                    "user_id": "$user_id",
                },
                user_id: {"$first" : "$user_id"},
                count:{$sum:1}
            }
        },
        {
            $match: { count: { $gt: 3 } }
        },
        {
            $project : { _id: 0, user_id: 1}
        },
        { $sort : { user_id : 1 } }
    ]
);

while(c.hasNext())
{
    printjson(c.next());
}