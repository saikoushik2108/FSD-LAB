const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

const dbName = "studentDB";
const collectionName = "students";

async function main() {
    try {
        await client.connect();

        console.log("\nConnected to MongoDB!");
        console.log("Database:", dbName);
        console.log("Collection:", collectionName);

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // READ CURRENT DATA
        const students = await collection.find({}).toArray();

        console.log("\n=================================");
        console.log("CURRENT DATA FROM MONGODB");
        console.log("=================================");

        students.forEach(student => {
            console.log("\nStudent ID:", student.studentId);
            console.log("Name:", student.name);
            console.log("Department:", student.department);
            console.log("Subjects:");

            student.subjects.forEach(subject => {
                console.log(
                    "  -",
                    subject.subject,
                    "Marks:",
                    subject.marks,
                    "Grade:",
                    subject.grade
                );
            });
        });

        // AGGREGATION
        console.log("\n=================================");
        console.log("UPDATED GRADE SUMMARY");
        console.log("=================================");

        const result = await collection.aggregate([
            {
                $unwind: "$subjects"
            },
            {
                $group: {
                    _id: "$studentId",

                    studentId: {
                        $first: "$studentId"
                    },

                    name: {
                        $first: "$name"
                    },

                    department: {
                        $first: "$department"
                    },

                    totalMarks: {
                        $sum: "$subjects.marks"
                    },

                    averageMarks: {
                        $avg: "$subjects.marks"
                    },

                    highestMarks: {
                        $max: "$subjects.marks"
                    },

                    lowestMarks: {
                        $min: "$subjects.marks"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    studentId: 1,
                    name: 1,
                    department: 1,
                    totalMarks: 1,

                    averageMarks: {
                        $round: ["$averageMarks", 2]
                    },

                    highestMarks: 1,
                    lowestMarks: 1
                }
            },
            {
                $sort: {
                    averageMarks: -1
                }
            }
        ]).toArray();

        console.table(result);

    } catch (error) {
        console.error("\nMongoDB Error:");
        console.error(error);
    } finally {
        await client.close();
    }
}

main();
