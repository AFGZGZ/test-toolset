### TEST EDITOR

RUN:

```cd test-editor
npm run dev
```

BUILD:

```cd test-editor
npm run build
```

\*Copy the content of test-editor/dist in to the tools folder for github pages deployment

### CLI TOOL

RUN: npm run build:pack

### STRUCTURE

Input:

```pack/
├── questions.json
├── audio/
│ └── xxx.mp3
│ └── ...
├── images/
│ └── xxx.png
│ └── ...
```

Output:

```dist/pack.zip
├── questions.json
├── manifest.json
├── audio/
│ └── xxx.mp3
│ └── ...
├── images/
│ └── xxx.png
│ └── ...
```
