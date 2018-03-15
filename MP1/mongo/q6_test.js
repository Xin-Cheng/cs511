conn = new Mongo();
db = conn.getDB("q6test");

var user_state = db.br.aggregate(
    [
        {
            $group : {
                _id : {
                    user_id: "$user_id" ,
                    state: "$state"
                },
                user_id: {"$first" : "$user_id"},
                state: {"$first" : "$state"},
                count: { $sum: 1 },
            }
        },
        {
            $project : { _id: 0, user_id:1, state:1, count:1 }
        },
        {
            $sort:{ user_id: 1 }
        },
        { $out : "user_state" }
    ]
);

var user_state_sum = db.br.aggregate(
    [
        {
            $group : {
                _id : {
                    user_id: "$user_id" ,
                },
                user_id: {"$first" : "$user_id"},
                sum: { $sum: 1 },
            }
        },
        {
            $project : { _id: 0, user_id:1, sum:1 }
        },
        { $out : "user_state_sum" }
    ]
);

var user_out_state = db.user_state.aggregate(
    [
        {
            $lookup: {
               from: "user_state_sum",
               localField: "user_id",
               foreignField: "user_id",
               as: "fromItems"
            }
         },
         {
            $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
         },
         { $project: { fromItems: 0} },
         { 
            $project:{ 
                _id: 0,
                user_id: 1,
                state: 1,
                count: 1,
                sum: 1,
                diff: { $subtract: [ { $subtract: [ "$sum", "$count" ] }, "$count" ]}
            }
         },
         {
            $match: { diff: { $gt: 0 } }
         },
         { $out : "user_out_state" }
    ]
);

var c = db.br.aggregate(
    [
        {
            $lookup: {
               from: "user_out_state",
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
         { $project: {user_id:1}}
    ]
);

while(c.hasNext()) 
{
    printjson(c.next());
}