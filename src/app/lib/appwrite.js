import { Client, Account, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = "685ba4d5000ebcb9e464";
const WORD_ID = "685ba4db0033bacfc756";
const STATS_ID = "6864e828003b3d86179d";

async function getWeeks() {
  const collectionID = WORD_ID; // or STATS_ID if you want from stats
  const queries = [Query.limit(1000)]; // Increase limit if you have many documents
  const response = await databases.listDocuments(DATABASE_ID, collectionID, queries);
  // Extract unique weeks
  const weeks = Array.from(new Set(response.documents.map(doc => doc.week))).filter(Boolean);
  return weeks.sort((a, b) => b - a); // Sort weeks numerically
}

async function getData(id, week) {
  console.log("Fetching data for week:", week);
  const collectionID = id === 'word' ? WORD_ID : STATS_ID;
  const queries = id === 'word' ? [Query.limit(100)] : [Query.orderDesc('points')];
  if (week) queries.push(Query.equal('week', week));
  let promise = databases.listDocuments(
    DATABASE_ID, collectionID, queries
  );

  promise.then(function (response) {
    console.log(response);
  }, function (error) {
    console.log(error);
  });
  return promise;
}

async function postData(id, data) {
  const collectionID = id === 'word' ? WORD_ID : STATS_ID;
  let promise = databases.createDocument(
    DATABASE_ID,
    collectionID,
    "unique()",
    data
  );

  promise.then(function (response) {
    console.log(response);
  }, function (error) {
    console.log(error);
  });

  return promise;
}

export { getData, postData, getWeeks };
