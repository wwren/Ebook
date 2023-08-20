import { useEffect, useState } from 'react';

import { Flex, Button, useMantineTheme } from '@mantine/core';

import { URL_ENDPOINT, QUICK_ASK } from '../../API/constants';
// import styles from './App.module.css';

import axios from 'axios';

const quickAskAction = [
  {
    key: 'translate',
    label: 'Translate',
  },
  {
    key: 'define',
    label: 'Defination & Usage',
  },
  {
    key: 'summarise',
    label: 'Summarise',
  },
];
const language = ['Chinese', 'English', 'French', 'Spanish'];

function QuickAsk({ selectedText, setHistory }) {
  const [selectedAction, setSelectedAction] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();

  useEffect(() => {
    const quickAsk = async () => {
      if (selectedAction && selectedLanguage && selectedText) {
        setHistory((prev) => [
          ...prev,
          {
            role: 'user',
            content: `${selectedAction} the highlighted sentences in ${selectedLanguage}. Highlighted sentences: ${selectedText}`,
          },
        ]);
        const data = {
          action: selectedAction,
          language: selectedLanguage,
          selectedSentence: selectedText,
        };

        try {
          const response = await axios.post(`${URL_ENDPOINT}${QUICK_ASK}`, data);

          setHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: response.data.completion,
            },
          ]);

          setSelectedAction();
          setSelectedLanguage();
        } catch (e) {
          console.log('error', e);
        }
      }
    };

    quickAsk();
  }, [selectedAction, selectedLanguage, selectedText]);

  return (
    <Flex gap="md" direction="column" wrap="nowrap">
      <Flex height="100%" gap="md" justify="flex-start" align="center" direction="row" wrap="wrap">
        {quickAskAction.map(({ key, label }) => (
          <Button key={key} onClick={() => setSelectedAction(key)}>
            {label}
          </Button>
        ))}
      </Flex>
      <Flex height="100%" gap="md" justify="flex-start" align="center" direction="row" wrap="wrap">
        {language.map((label) => (
          <Button key={label} onClick={() => setSelectedLanguage(label)}>
            {label}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}

export default QuickAsk;
