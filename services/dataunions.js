const DataUnionClient = require('@dataunions/client').DataUnionClient

const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const PUBLIC_KEY = process.env.ADMIN_ADDRESS;

const createDataUnion = async (name, description = "") => {
    const DU = new DataUnionClient({
        auth: {
            privateKey: PRIVATE_KEY,
        },
        chain: 'polygon',
    });

    const deploymentOptions = {
        owner: PUBLIC_KEY,
        joinPartAgents: [PUBLIC_KEY],
        dataUnionName: name,
        adminFee: 0.1,
        metadata: {
            "information": description,
        }
    }

    const dataUnion = await DU.deployDataUnion(
        deploymentOptions
    );

    console.log("Our data union contract address (" + name + "):", dataUnion.getAddress())
    // console.log("Full data union object: ", dataUnion)

    return dataUnion
}

exports.createDataUnion = createDataUnion;
