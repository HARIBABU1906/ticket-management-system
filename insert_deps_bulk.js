db.departments.dropIndex("shortName_1");

const departments = [
{ name: "Computer Science", description: "Software related issues" },
{ name: "Information Technology", description: "IT system complaints" },
{ name: "Electronics", description: "Electronics hardware issues" },
{ name: "Mechanical", description: "Mechanical department issues" },
{ name: "Civil", description: "Infrastructure complaints" },
{ name: "Electrical", description: "Electrical maintenance issues" },
{ name: "Administration", description: "Office admin complaints" },
{ name: "Library", description: "Library related complaints" },
{ name: "Hostel", description: "Hostel facility complaints" },
{ name: "Maintenance", description: "General maintenance issues" }
];

const operations = departments.map(d => ({
  updateOne: {
    filter: { name: d.name },
    update: { $set: d, $setOnInsert: { shortName: d.name.split(' ').map(w => w[0]).join('').toUpperCase() } },
    upsert: true
  }
}));

db.departments.bulkWrite(operations);
