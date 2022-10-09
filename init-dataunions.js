require('dotenv').config();

const init = async () => {
    const DU = require("./services/dataunions");
    const database = require("./services/database");

    const categories = require("./predefined-categories.json")

    console.log("Initializing data unions for each category")

    let dataUnions = []

    for (let i = 0; i < categories.length; i++) {
        let du = await DU.createDataUnion(categories[i].name, "This is the data union for the following category: " + categories[i].name)
        dataUnions.push({keyword: categories[i].name, address: du.getAddress()})
    }

    console.log("These are my data unions:")
    console.log(dataUnions)

    console.log("Saving data unions in our off chain database")

    for (let i = 0; i < dataUnions.length; i++) {
        await database.insertDataUnion(dataUnions[i].keyword, dataUnions[i].address)
    }

    console.log("All set!")
}

init()
