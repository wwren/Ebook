const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { setGlobalOptions } = require('firebase-functions/v2');

const logger = require('firebase-functions/logger');
const cors = require('cors')({ origin: true });
const axios = require('axios');
const { ocrSpace } = require('ocr-space-api-wrapper');

setGlobalOptions({ region: 'australia-southeast2' });
const apiKey = defineSecret('TRANSLATE_GPT_API_KEY');
const ocrAPIKey = defineSecret('OCR_API_KEY');

exports.quickAsk = onRequest({ secrets: [apiKey] }, async (req, res) => {
  const API_KEY = apiKey.value();
  if (!API_KEY) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  cors(req, res, async () => {
    const { action, selectedSentence, language } = req.body;
    const generatedContent = generatePromptForAction(action, language);
    try {
      const apiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: generatedContent },
            { role: 'user', content: selectedSentence },
          ],
          temperature: 0.6,
        },
        {
          headers: generateHeaders(API_KEY),
        },
      );
      const completion = apiResponse.data.choices[0].message.content;
      logger.info('completion', completion);
      logger.info('completion is being logged', completion);
      res.status(200).json({
        message: 'OpenAI API connection successful.',
        completion,
      });
    } catch (error) {
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

// Need to past down the conversation history
exports.askAnything = onRequest({ secrets: [apiKey] }, async (req, res) => {
  const API_KEY = apiKey.value();
  if (!API_KEY) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      },
    });
    return;
  }

  cors(req, res, async () => {
    const { history, newQuestion } = req.body;

    try {
      const apiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [...history, { role: 'user', content: newQuestion }],
          temperature: 0.6,
        },
        {
          headers: generateHeaders(API_KEY),
        },
      );
      const completion = apiResponse.data.choices[0].message.content;
      logger.info('completion', completion);
      res.status(200).json({
        message: 'OpenAI API connection successful.',
        completion,
      });
    } catch (error) {
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

exports.ocrExtractTextFromImg = onRequest({ secrets: [ocrAPIKey] }, async (req, res) => {
  const OCR_API_KEY = ocrAPIKey.value();
  if (!OCR_API_KEY) {
    res.status(500).json({
      error: {
        message: 'OCR API key is not configured.',
      },
    });
    return;
  }

  cors(req, res, async () => {
    const { base64Data } = req.body;

    try {
      const response = await ocrSpace(base64Data, { apiKey: OCR_API_KEY });

      logger.info('res2', response);
      const parsedText = response.ParsedResults[0].ParsedText;
      res.status(200).json({
        message: 'OCR API connection successful.',
        data: parsedText,
      });
    } catch (error) {
      logger.error('error', error);
    }
  });
});

function generatePromptForAction(action, language) {
  let content;

  switch (action) {
    case 'translate':
      content = generatePromptForTranslation(language);
      break;
    case 'define':
      content = generatePromptForDefination(language);
      break;
    case 'summarise':
      content = generatePromptForSummarisation(language);
      break;
  }

  return content;
}

function generatePromptForTranslation(language) {
  return `You will be provided with sentences, and your task is to translate them into ${language}.`;
}

function generatePromptForDefination(language) {
  return `You will be provided with a work or a phrase, and your task is to provide defination and usage for this word in ${language}.`;
}

function generatePromptForSummarisation(language) {
  return `You will be provided with paragraphs, and your task is to give a summary in ${language}.`;
}

function generateHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}
