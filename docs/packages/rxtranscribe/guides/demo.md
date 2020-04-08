# Demo: Hello World

{% hint style="info" %}
**Dependencies**. Running it requires node.js and yarn to be installed locally. (It has been tested with node 12, yarn 1.21.)
{% endhint %}

## Sample demo
The source code for `@bottlenose/rxtranscribe` includes a demo that can be run from the command line.  It provides a sample audio file and transcribes it using AWS Transcribe,  If you don't want to run the demo or copy the source code, you can simply [view it on Github](https://github.com/buccaneerai/bottlenose/tree/dev/packages/rxtranscribe/demo).

To run the demo locally, first install the dependencies (see above). Then follow the steps below:

### Configure an AWS account
To use this package, you'll need an AWS account.  The account needs to be [configured to allow real-time streaming](https://docs.aws.amazon.com/transcribe/latest/dg/websocket.html) via [AWS Transcribe](https://aws.amazon.com/transcribe/).

### Copy & install the source code
The demo lives in the Bottelnose repository on Github.
```bash
git clone https://github.com/buccaneerai/bottlenose.git
cd bottlenose
yarn install
yarn bootstrap
```

### Run the transcription pipeline
To run the demo, enter the following commands from the root of the repository:
```bash
cd packages/rxtranscribe
AWS_ACCESS_KEY_ID=<YOUR_KEY> AWS_SECRET_ACCESS_KEY=<YOUR_SECRET> yarn demo:run
```
You should now get a real-time transcript of the audio file!

