conn = new Mongo();
db = conn.getDB("mydb");

var c = db.br.aggregate(
    [
        {
            $group : {
                _id : {
                    user_id: { $user_id: "$user_id" },
                    state: { $state: "$state" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project : { _id: 0 }
        }
    ]
);

while(c.hasNext()) 
{
    printjson(c.next());
}