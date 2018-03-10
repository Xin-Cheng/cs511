conn = new Mongo();
db = conn.getDB("mydb");
var c = db.br.aggregate(
    [
        {
          $group:
            {
                _id: "$business_id",
                avgReview: { $avg: "$stars_y" },
            }
        },
        {
            $project : {
                 "name": 1 
                }
        }
      ]
);

while(c.hasNext()) 
{
    printjson(c.next());
}