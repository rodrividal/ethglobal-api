// import { createClient } from "@supabase/supabase-js";
const createClient = require('@supabase/supabase-js').createClient

const databaseUrl = process.env.SUPABASE_URL
const databaseKey = process.env.SUPABASE_KEY

const supabase = createClient(
    databaseUrl,
    databaseKey
)

const test = async () => {
    return "It works!"
};

const signIn = async () => {
    return null
};

const signUp = async () => {
    return null
};

const getPoaps = async () => {
    const { data, error } = await supabase
        .from('poaps')
        .select()

    return { data, error }
};

exports.test = test
exports.signIn = signIn
exports.signUp = signUp
exports.getPoaps = getPoaps
