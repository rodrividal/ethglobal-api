const createClient = require('@supabase/supabase-js').createClient;

const databaseUrl = process.env.SUPABASE_URL;
const databaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(
    databaseUrl,
    databaseKey
);

const test = async () => {
    return "It works!";
};

const signIn = async () => {
    return null;
};

const signUp = async () => {
    return null;
};

const getPoaps = async () => {
    const { data, error, count } = await supabase
        .from('poaps')
        .select()

    return { data, error, count };
};

const getCategories = async () => {
    const { data, error, count } = await supabase
        .from('dataunions')
        .select()

    return { data, error, count };
};

const getDataUnion = async (keyword) => {
    const { data, error } = await supabase
        .from('dataunions')
        .select()
        .eq('keyword', keyword)
        .limit(1)
        .single()

    return { data, error };
};

const categoryExists = async (keyword) => {
    const { data, error, count } = await supabase
        .from('dataunions')
        .select()
        .eq('keyword', keyword)

    return data.length > 0
}
const poapsByKeyword = async (keywords) => {
    const { data, error, count } = await supabase
        .from('poaps')
        .select('id,description')
        .ilike('description', '%' + keywords[0] + '%');

    return { data, error, count };
};

const insertDataUnion = async (keyword, address) => {
    const { response, error } = await supabase
        .from('dataunions')
        .insert([
            { keyword, address },
        ]);

    if (error) {
        console.log(error)
        return false
    }

    return response
}

const getMessagesByKeywords = async (keywords) => {
    const { data, error, count } = await supabase
        .from('messages')
        .select()
        .filter('keyword', 'in', '(' + keywords.toString() + ')')
        .eq('verify', true)

    return { data, error, count };
};

const getMessageById = async (id) => {
    const { data, error } = await supabase
        .from('messages')
        .select()
        .eq('id', id)

    return { data, error };
};

const insertMessage = async (message) => {
    const { data, error } = await supabase
        .from('messages')
        .insert([
            message,
        ]);

    if (error) {
        console.log(error)
        return false
    }

    return data
}

const verifyMessage = async (id) => {
    const { data, error } = await supabase
        .from('messages')
        .update({ verified: true })
        .match({ id: id })

    if (error) {
        console.log(error)
        return false
    }

    return data
}

const watchedAdExists = async (address, message_id) => {
    const { data, error, count } = await supabase
        .from('watched_ads')
        .select()
        .eq('message_id', message_id)
        .eq('address', address)

    return data.length > 0
}

const insertWatchedAd = async (data) => {
    if (!await watchedAdExists(data.address, data.message_id)) {
        const { response, error } = await supabase
            .from('watched_ads')
            .insert([
                data,
            ]);

        if (error) {
            console.log(error)
            return false
        }

        return response
    }
    return true
}

exports.test = test;
exports.signIn = signIn;
exports.signUp = signUp;
exports.getPoaps = getPoaps;
exports.getCategories = getCategories;
exports.getDataUnion = getDataUnion;
exports.poapsByKeyword = poapsByKeyword;
exports.getMessagesByKeywords = getMessagesByKeywords;
exports.getMessageById = getMessageById;
exports.verifyMessage = verifyMessage;
exports.insertDataUnion = insertDataUnion;
exports.insertMessage = insertMessage;
exports.insertWatchedAd = insertWatchedAd;
exports.categoryExists = categoryExists;