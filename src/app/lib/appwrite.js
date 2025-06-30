import { Client, Account, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

const databaseID = "685ba4d5000ebcb9e464";
const collectionID = "685ba4db0033bacfc756";

async function getData(week) {
  console.log("Fetching data for week:", week);
  let promise = databases.listDocuments(
    databaseID, collectionID, week ? [Query.equal('week', week)] : []
  );

  promise.then(function (response) {
    console.log(response);
  }, function (error) {
    console.log(error);
  });
  return promise;
}

async function postData(data) {
  let promise = databases.createDocument(
    databaseID,
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

export { getData, postData };
