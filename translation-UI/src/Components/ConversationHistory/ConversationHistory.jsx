import { useState } from 'react';

import { Container, Text } from '@mantine/core';
import styles from './ConversationHistory.module.css';

function ConversationHistory({ history }) {
  return (
    <Container height="100vh">
      {history.map(({ role, content }, idx) => {
        return (
          <Text key={idx} className={`${role === 'assistant' ? styles.divider : ''}`}>
            <span>{role}: </span>
            <span>{content}</span>
          </Text>
        );
      })}
    </Container>
  );
}

export default ConversationHistory;
