require('dotenv').config();
const 
    express = require('express'),
    axios = require('axios');
    cors = require('cors'),
    app = express(),
    fpSecretKey = process.env.FP_API_SECRET_KEY,
    fpBaseUrl = 'https://api.fpjs.io';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get('/visitors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const fpRes = await axios.get(`${fpBaseUrl}/visitors/${id}`, {
            headers: {
                'Auth-API-Key': fpSecretKey,
            }
        });
        const visits = fpRes.data?.visits?.slice(0, 30);
        const consistentBrowserDetails = visits?.slice(0, 20)?.every((visit) => visit?.browserDetails.toString() === visits?.[0]?.browserDetails.toString());

        return res.json({
            status: 'success',
            message: 'Visitor checked successfully',
            scraper_detected: !consistentBrowserDetails,
        });
    } catch (err) {
        console.log('err: ', err);
        return res.status(400).json({
            status: 'fail',
            message: 'An error occurred',
        });
    }
});


app.use((_, res, next) => next(res.status(404).json({ error: '404 not found' })));

app.listen(5000, () => console.log(`Server started on port 5000`) );