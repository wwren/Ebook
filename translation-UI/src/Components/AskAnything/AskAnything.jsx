import { useState } from 'react';
import { useForm } from '@mantine/form';
import axios from 'axios';

import { Container, Textarea, Button } from '@mantine/core';

import { URL_ENDPOINT, ASK_ANYTHING } from '../../API/constants';
// import styles from './App.module.css';

const PRIMARY_COL_HEIGHT = '100vh';

function AskAnything({ history, setHistory }) {
  const form = useForm({
    initialValues: {
      question: '',
    },
  });

  const handleSubmit = async (value) => {
    // console.log('value', value);
    const { question } = value;
    if (question) {
      const data = {
        history,
        newQuestion: question,
      };

      try {
        const response = await axios.post(`${URL_ENDPOINT}${ASK_ANYTHING}`, data);

        setHistory((prev) => [
          ...prev,
          {
            role: 'user',
            content: question,
          },
          {
            role: 'assistant',
            content: response.data.completion,
          },
        ]);
      } catch (e) {
        console.log('error', e);
      } finally {
        form.reset();
      }
    }
  };

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          placeholder="You can enter your questions here"
          label="Ask anything"
          {...form.getInputProps('question')}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Container>
  );
}

export default AskAnything;
