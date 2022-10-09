require('dotenv').config();

const init = async () => {
    const DU = require("./services/dataunions");

    const categories = require("./predefined-categories.json")

    console.log("Initializing data unions for each category")

    let dataUnions = []

    for (let i = 0; i < categories.length; i++) {
        let du = await DU.createDataUnion(categories[i].name, "This is the data union for the following category: " + categories[i].name)
        dataUnions.push({category: categories[i].name, du_address: du.getAddress()})
    }

    console.log("These are my data unions:")
    console.log(dataUnions)

    console.log("Saving data unions in our off chain database")
    
}

init()
