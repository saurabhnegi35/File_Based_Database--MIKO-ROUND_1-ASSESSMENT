const fs = require("fs");
const path = require("path");

const metadataFile = "metadata.txt"; // File to store table metadata
const dataDirectory = __dirname; // Directory to store table data files

// Function to create a table
function createTable(tableName, columns) {
  const metadata = `${tableName}: ${columns.join(" ")}\n`;
  fs.appendFileSync(metadataFile, metadata); // Append metadata to the metadata file
}

// Function to insert data into a table
function insertIntoTable(tableName, values) {
  const tableFile = path.join(dataDirectory, `${tableName}.txt`); // Get the path of the table file
  const rowData = `${values.join(",")}\n`; // Convert values array to a comma-separated string
  fs.appendFileSync(tableFile, rowData); // Append row data to the table file
}

// Function to parse the CREATE TABLE query
function parseCreateTable(query) {
  const start = query.indexOf("(") + 1;
  const end = query.indexOf(")");
  const tableName = query.slice(13, start - 1).trim(); // Extract the table name from the query
  const columns = query
    .slice(start, end)
    .split(",")
    .map((col) => col.trim()); // Extract column names/types and store them in an array
  return { tableName, columns }; // Return an object with tableName and columns properties
}

// Function to parse the INSERT INTO query
function parseInsertInto(query) {
  const start = query.indexOf("(") + 1;
  const end = query.indexOf(")");
  const tableName = query.slice(12, start - 8).trim(); // Extract the table name from the query
  const values = query
    .slice(start, end)
    .split(",")
    .map((value) => value.trim()); // Extract values and store them in an array
  return { tableName, values }; // Return an object with tableName and values properties
}

// Function to execute a query
function executeQuery(query) {
  if (query.startsWith("CREATE TABLE")) {
    const { tableName, columns } = parseCreateTable(query); // Parse the CREATE TABLE query
    createTable(tableName, columns); // Create the table by appending metadata
    console.log(`Table '${tableName}' created successfully.`);
  } else if (query.startsWith("INSERT INTO")) {
    const { tableName, values } = parseInsertInto(query); // Parse the INSERT INTO query
    insertIntoTable(tableName, values); // Insert the data into the table
    console.log(`Data inserted into table '${tableName}' successfully.`);
  } else {
    console.log("Invalid query.");
  }
}

// Example usage
const query1 = "CREATE TABLE NAMES (col1 INTEGER, col2 STRING)";
const query2 = "INSERT INTO NAMES VALUES (1, 'MIKO')";
const query3 = "INSERT INTO NAMES VALUES (2, 'Saurabh Negi')";

executeQuery(query1);
executeQuery(query2);
executeQuery(query3);
