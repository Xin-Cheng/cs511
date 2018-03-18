conn = new Mongo();
db = conn.getDB("mydb");

// var drop = db.trueDelivery.drop();
// var true_delivery = db.br.aggregate(
//     [
//         {
//             $match: { attributes_RestaurantsDelivery: true }
//         },
//         {
//             $group : {
//                 _id : "$user_id",
//                 user_id: {"$first" : "$user_id"},
//                 true_count:{$sum:1},
//             }
//         },
//         {
//             $project : { _id: 0, user_id: 1, true_count: 1 }
//         },
//         { $out : "trueDelivery" }
//     ]
// );
var true_index = db.trueDelivery.createIndex( { user_id: 1 } );

// var false_delivery = db.br.aggregate(
//     [
//         {
//             $match: { attributes_RestaurantsDelivery: false }
//         },
//         {
//             $group : {
//                 _id : "$user_id",
//                 user_id: {"$first" : "$user_id"},
//                 false_count:{$sum:1},
//             }
//         },
//         {
//             $project : { _id: 0, user_id: 1, false_count: 1 }
//         },
//         { $out : "falseDelivery" }
//     ]
// );
var false_index = db.falseDelivery.createIndex( { user_id: 1 } );
var c = db.trueDelivery.aggregate(
    [
        {
            $lookup: {
               from: "falseDelivery",
               localField: "user_id",
               foreignField: "user_id",
               as: "fromItems"
            }
         },
         {
            $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
         },
         { $project: { fromItems: 0} },
         { $project:{ 
             _id: 0,
             user_id: 1,
             true_count: 1,
             false_count: 1,
             cmp: {$cmp: ['$true_count','$false_count']},}
         },
         {
            $match: { cmp: { $gt: 0 } }
         },
         { $project: {user_id:1}},
         { $sort : { user_id : 1 } }
    ]
);

while(c.hasNext()) 
{
    printjson(c.next());
}