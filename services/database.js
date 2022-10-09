// import { createClient } from "@supabase/supabase-js";
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

    return { data, error, count };
};

const insertMessage = async (message) => {
    const { response, error } = await supabase
        .from('messages')
        .insert([
            message,
        ]);

    if (error) {
        console.log(error)
        return false
    }

    return response
}

const insertWatchedAd = async (data) => {
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

exports.test = test;
exports.signIn = signIn;
exports.signUp = signUp;
exports.getPoaps = getPoaps;
exports.getCategories = getCategories;
exports.poapsByKeyword = poapsByKeyword;
exports.getMessagesByKeywords = getMessagesByKeywords;
exports.insertDataUnion = insertDataUnion;
exports.insertMessage = insertMessage;
exports.insertWatchedAd = insertWatchedAd;
