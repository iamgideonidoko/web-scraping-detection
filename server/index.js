require('dotenv').config();
const 
    express = require('express'),
    axios = require('axios'),
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
        let badUA = false;
        const consistentDetails = visits?.every((visit) => {
            const userAgent = visit?.browserDetails?.userAgent;
            if (userAgent.substr(0, 11) !== "Mozilla/5.0") badUA = true;
            if (userAgent.match(new RegExp(['headless', 'bot', 'crawl', 'index', 'archive', 'spider', 'http', 'google', 'bing', 'yahoo', 'msn', 'yandex', 'facebook'].join('|'), 'i'))) badUA = true;
            return visit?.browserDetails.toString() === visits?.[0]?.browserDetails.toString();
        });

        return res.json({
            status: 'success',
            message: 'Visitor checked successfully',
            scraper_detected: !consistentDetails || badUA,
            fpResData: fpRes.data,
        });
    } catch (err) {
        console.log('err: ', err);
        return res.status(400).json({
            status: 'fail',
            message: 'An error occurred',
        });
    }
});

app.get('/data', async (_, res) => {
    try {
        const jpRes = await axios.get('https://jsonplaceholder.typicode.com/users/1/posts');
        return res.json({
            status: 'success',
            message: 'Data fetched successfully',
            data: jpRes.data,
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