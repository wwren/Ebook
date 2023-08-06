const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');
const cors = require('cors')({ origin: true });
const axios = require('axios');

exports.translate = functions
  .region('australia-southeast1')
  .runWith({ secrets: ['TRANSLATE_GPT_API_KEY'] })
  .https.onRequest(async (req, res) => {
    const API_KEY = process.env.TRANSLATE_GPT_API_KEY;

    if (!API_KEY) {
      res.status(500).json({
        error: {
          message: 'OpenAI API key not configured, please follow instructions in README.md',
        },
      });
      return;
    }
    cors(req, res, async () => {
      const sentence = req.body.sentence;
      const language = req.body.language;
      try {
        const apiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: generatePromptForTranslation(language) },
              { role: 'user', content: sentence },
            ],
            temperature: 0.6,
          },
          {
            headers: generateHeaders(API_KEY),
          },
        );
        const completion = apiResponse.data.choices[0].message.content;
        logger.info('apiResponse', completion);
        res.status(200).json({
          message: 'OpenAI API connection successful.',
          completion,
        });
      } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
          logger.error('error.response', error.response.status, error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else {
          logger.error(`Error with OpenAI API request: ${error.message}`);
          res.status(500).json({
            error: {
              message: 'An error occurred during your request.',
            },
          });
        }
      }
    });
  });

function generatePromptForTranslation(language) {
  return `You will be provided with a sentence in English, and your task is to translate it into ${language}.`;
}

function generateHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}
