conn = new Mongo();
db = conn.getDB("mydb");

var temp = db.br.aggregate(
    [
        {
          $group:
            {
                _id: "$business_id",
                avgReview: { $avg: "$stars_y" },
            }
        },
        { $out : "averageReviews" }
      ]
);

var c = db.br.find({
    business_id: {
        $in: db.averageReviews.find(
            {
                avgReview: { $in: db.averageReviews.aggregate(
                    [
                        {
                          $group:
                            {
                                _id: null,
                                maxReview: { $max: "$avgReview" },
                            }
                        }
                    ]).map(function(doc) {
                        return doc.maxReview;
                    })
                }
            }
        ).map(function(doc) {return doc._id;})
    }
}, {business_id:1, name: 1, _id:0});


while(c.hasNext()) 
{
    printjson(c.next());
}