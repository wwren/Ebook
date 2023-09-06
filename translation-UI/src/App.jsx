import { useState } from 'react';

import { Grid, SimpleGrid } from '@mantine/core';
import styles from './App.module.css';

import PictureUploader from './Components/PictureUploader/PictureUploader';
import QuickAsk from './Components/QuickAsk/QuickAsk';
import ConversationHistory from './Components/ConversationHistory/ConversationHistory';
import AskAnything from './Components/AskAnything/AskAnything';
import { DropzoneContainer } from './Components/Dropzone/Dropzone';

// const PRIMARY_COL_HEIGHT = '100vh';

function App() {
  // const theme = useMantineTheme();
  const [content, setContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [history, setHistory] = useState([]);

  const handleTextSelect = () => {
    const selection = window.getSelection().toString();
    setSelectedText(selection);
  };

  console.log('selectedText', selectedText);
  console.log('content', content);

  return (
    <SimpleGrid cols={2} spacing="sm" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
      <Grid gutter="sm">
        <DropzoneContainer setContent={setContent} />
        <Grid.Col>
          <PictureUploader
            selectedText={selectedText}
            setContent={setContent}
            handleTextSelect={handleTextSelect}
            content={content}
          />
        </Grid.Col>
        <Grid.Col className={styles.quickAskGrid}>
          <QuickAsk selectedText={selectedText} setHistory={setHistory} />
        </Grid.Col>
        <Grid.Col>
          <AskAnything history={history} setHistory={setHistory} />
        </Grid.Col>
      </Grid>
      <ConversationHistory history={history} />
    </SimpleGrid>
  );
}

export default App;
