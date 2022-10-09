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

const addMember = async (DUContractAddress, newMemberAddress) => {
    const DU = new DataUnionClient({
        auth: {
            privateKey: PRIVATE_KEY,
        },
        chain: 'polygon',
    });

    const dataUnion = await DU.getDataUnion(DUContractAddress);

    const isMember = await dataUnion.isMember(newMemberAddress)

    if (!isMember) {
        const tx = await dataUnion.addMembers([newMemberAddress]);
        console.log("Member added!")
        console.log("Data union:", await dataUnion.getActiveMemberCount())
    } else {
        console.log("Member already exists in dataUnion!")
        console.log("Data union:", await dataUnion.getActiveMemberCount())
    }
}

exports.createDataUnion = createDataUnion;
exports.addMember = addMember;
