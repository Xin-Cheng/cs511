conn = new Mongo();
db = conn.getDB("mydb");

var drop = db.trueDelivery.drop();
var true_delivery = db.br.aggregate(
    [
        {
            $match: { attributes_RestaurantsDelivery: true }
        },
        {
            $group : {
                _id : "$user_id",
                user_id: {"$first" : "$user_id"},
                true_count:{$sum:1},
            }
        },
        {
            $project : { _id: 0, user_id: 1, true_count: 1 }
        },
        { $out : "trueDelivery" }
    ]
);
var drop2 = db.falseDelivery.drop()
var false_delivery = db.br.aggregate(
    [
        {
            $match: { attributes_RestaurantsDelivery: false }
        },
        {
            $group : {
                _id : "$user_id",
                user_id: {"$first" : "$user_id"},
                false_count:{$sum:1},
            }
        },
        {
            $project : { _id: 0, user_id: 1, false_count: 1 }
        },
        { $out : "falseDelivery" }
    ]
);

var c = db.trueDelivery.aggregate(
    [
        {
            $lookup: {
                from: "falseDelivery",
                localField: "user_id",    // field in the true collection
                foreignField: "user_id",  // field in the false collection
                as: "fromItems"
             }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
        },
        {
            $match: { true_count:{$gt:"$false_count"}}
        },
        { $project: { fromItems: 0 } },
        { $out : "q4" }
    ]
);

while(c.hasNext()) 
{
    printjson(c.next());
}