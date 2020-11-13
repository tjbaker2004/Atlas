const cfg = require('../cfg.json');

const { MongoClient } = require('mongodb');
const client = new MongoClient(cfg.dbUrl);

module.exports = {
	name: 'register',
	description: 'Register a nation.',
	execute(message, args, nationID) {
		let nationDoc = {
            "name": args[1],
            "population": args[2],
            "gdp": args[3],
            "foodStorage": args[4],
            "researchLVL": args[5],
            "infrastructureLVL": args[6],
            "currency": args[7],
            "nationID": nationID
        }

        async function run() {
            try {
                await client.connect();
                console.log('Connected Successfully!!!');
                const db = client.db(cfg.dbName);
        
                const col = db.collection('nations');
        
                const docInsert = await col.insertOne(nationDoc);
        
                const myDoc = await col.findOne();
        
                console.log(myDoc);
        
                } catch (err) {
                    console.log(err.stack);
            }
        
            finally {
                await client.close();
            }
        }

        run();
	},
};