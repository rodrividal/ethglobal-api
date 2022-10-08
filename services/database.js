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

const poapsByKeyword = async (keywords) => {
    const { data, error, count } = await supabase
        .from('poaps')
        .select('id')
        .ilike('description', '%' + keywords[0] + '%');

    return { data, error, count };
};

exports.test = test;
exports.signIn = signIn;
exports.signUp = signUp;
exports.getPoaps = getPoaps;
exports.poapsByKeyword = poapsByKeyword;
