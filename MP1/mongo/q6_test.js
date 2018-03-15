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
               let: {
                    brUser: "$user_id",
                    brState: "$state"
                },
                pipeline: [
                    {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                $eq: [
                                    "$user_id",
                                    "$$brUser"
                                ]
                                },
                                {
                                $eq: [
                                    "$state",
                                    "$$brState"
                                ]
                                }
                            ]
                        }
                    }
                    }
                ],
               as: "fromItems"
            }
         },
         {
            $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
         },
         { $project: { fromItems: 0} },
         {
            $match: { diff : { $gt: 0 } }
         },
         {
            $group : {
                _id : {
                    business_id: "$business_id" ,
                },
                business_id: {"$first" : "$business_id"},
                avg_out_of_state_rating: { $avg: "$stars_y" },
            }
        },
         {
             $project: {_id:0}
         },
    ]
);

while(c.hasNext()) 
{
    printjson(c.next());
}