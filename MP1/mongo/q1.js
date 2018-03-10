conn = new Mongo();
db = conn.getDB("mydb");
// var averageReview = db.br.aggregate(
//     [
//         {
//           $group:
//             {
//                 _id: "$business_id",
//                 avgReview: { $avg: "$stars_y" },
//             }
//         },
//         { $out : "averageReviews" }
//       ]
// );
// db.averageReviews.aggregate(
//     [
//         {
//           $group:
//             {
//                 _id: null,
//                 maxReview: { $max: "$avgReview" },
//             }
//         }
//       ]
// );


// var c = db.br.find({
//     _id: {
//         $in: db.averageReviews.find(
//             {
//                 avgReview: { $eq: db.averageReviews.aggregate(
//                     [
//                         {
//                           $group:
//                             {
//                                 _id: null,
//                                 maxReview: { $max: "$avgReview" },
//                             }
//                         }
//                       ]
//                 ).maxReview}
//             }
//         )}
// }, {name: 1});
// var c = db.averageReviews.find(
//     {
//         avgReview: { $eq: db.averageReviews.aggregate(
//             [
//                 {
//                   $group:
//                     {
//                         _id: null,
//                         maxReview: { $max: "$avgReview" },
//                     }
//                 }
//               ]
//         ).maxReview}
//     }
// );
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
var c = db.averageReviews.aggregate(
    [
        {
          $group:
            {
                _id: null,
                maxReview: { $max: "$avgReview" },
            }
        }
      ]
).map(function(doc) {
    return doc.maxReview;
});
while(c.hasNext()) 
{
    printjson(c.next());
}