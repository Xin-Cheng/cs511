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
var c = db.br.aggregate(
    [
        {
            $match: {
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
            }
        },
        {
            $group : {
                _id : "$business_id",
                business_id: {"$first" : "$business_id"},
                name: {"$first" : "$name"}
            }
        },
        {
            $project : { business_id : 1 , name : 1 , _id: 0}
        },
        { $sort : { business_id : 1 } }
    ]
);

while(c.hasNext()) 
{
    printjson(c.next());
}