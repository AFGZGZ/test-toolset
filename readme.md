RUN: npm run build:pack

Input:

pack/
├── questions.json
├── audio/
│ └── xxx.mp3
│ └── ...
├── images/
│ └── xxx.png
│ └── ...

Output:
dist/pack.zip
├── questions.json
├── manifest.json
├── audio/
│ └── xxx.mp3
│ └── ...
├── images/
│ └── xxx.png
│ └── ...
