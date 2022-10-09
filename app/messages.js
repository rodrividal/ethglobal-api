const express = require('express')
const router = express.Router()

const createClient = require('@supabase/supabase-js').createClient;

const databaseUrl = process.env.SUPABASE_URL;
const databaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(
    databaseUrl,
    databaseKey
);

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.post('/', (req, res) => {
    const { title, description, image_url, link, keyword } = req.body;

    const { data, error } = await supabase
        .from('messages')
        .insert([
            { title, description, image_url, link, keyword },
        ]);

    if(error) {
        console.log(error)
        res.status(500).json({ message: error.message });
        return;
    }

    res.status(200).json({ message: "ok" });
})

module.exports = router
